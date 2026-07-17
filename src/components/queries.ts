import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '../server/authMiddleware'
import { groupAndSortSkills } from '../lib/skills'
import type { PrismaClient } from '@prisma/client'

export type ProfilePayload = {
  id?: number
  name: string
  roleLine: string
  bio: string
  email: string
  githubUrl: string
  linkedinUrl: string
  location: string
  school: string
  department: string
  years?: string
  gpa?: string
  language?: string // "en" or "tr"
}

export type SkillPayload = {
  group: string
  name: string
}

export type IdentifiedRecord = {
  id: number
}

export type ProjectPayload = {
  id?: number
  name: string
  tagline: string
  description: string
  tech: Array<string>
  href?: string
  language: string // "en" or "tr"
}

export type ExperiencePayload = {
  id?: number
  role: string
  company: string
  period: string
  location?: string
  bullets?: Array<string>
  order: number
  language: string // "en" or "tr"
}

export type { SkillGroup } from '../lib/skills'

const isServer = typeof window === 'undefined'
const databaseUrl = process.env.DATABASE_URL

if (isServer && !databaseUrl) {
  throw new Error('DATABASE_URL is not set.')
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

let prismaClient: PrismaClient | undefined = globalForPrisma.prisma

async function initializePrisma(): Promise<PrismaClient> {
  if (isServer && !prismaClient) {
    const { PrismaNeon } = await import('@prisma/adapter-neon')
    const { PrismaClient } = await import('@prisma/client')

    const adapter = new PrismaNeon({ connectionString: databaseUrl! })
    prismaClient = new PrismaClient({ adapter })

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaClient
    }
  }
  return prismaClient!
}

function requireId(data: IdentifiedRecord): IdentifiedRecord {
  if (!data || typeof data.id !== 'number') {
    throw new Error('Invalid input: id is required')
  }
  return { id: data.id }
}

function requireStrings(data: Record<string, unknown>, fields: Array<string>) {
  for (const field of fields) {
    if (typeof data[field] !== 'string' || data[field] === '') {
      throw new Error(`Invalid input: ${field} is required`)
    }
  }
}

export const getPortfolioData = createServerFn({ method: 'POST' })
  .inputValidator((data?: { language?: string }) => ({
    language: data?.language === 'en' ? 'en' : 'tr',
  }))
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { language } = data
    const [profile, skills, projects, experience] = await Promise.all([
      prisma.profile.findFirst({ where: { language } }),
      prisma.skill.findMany(),
      prisma.project.findMany({ where: { language } }),
      prisma.experience.findMany({ where: { language }, orderBy: { order: 'asc' } }),
    ])

    return {
      profile,
      skills: groupAndSortSkills(skills),
      rawSkills: skills,
      projects,
      experience,
    }
  })

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>

export const updateProfile = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: ProfilePayload) => {
    requireStrings(data, ['name', 'roleLine', 'bio', 'email'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id: _id, language, ...rest } = data
    const lang = language || 'tr'

    const existing = await prisma.profile.findFirst({ where: { language: lang } })

    if (existing) {
      return prisma.profile.update({
        where: { id: existing.id },
        data: rest,
      })
    } else {
      return prisma.profile.create({
        data: { ...rest, language: lang },
      })
    }
  })

export const addSkill = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: SkillPayload) => {
    requireStrings(data, ['group', 'name'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    return prisma.skill.create({ data })
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    return prisma.skill.delete({ where: { id: data.id } })
  })

export const addProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: ProjectPayload) => {
    requireStrings(data, ['name', 'description', 'language'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id: _id, ...rest } = data
    return prisma.project.create({ data: rest })
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    return prisma.project.delete({ where: { id: data.id } })
  })

export const updateProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: ProjectPayload) => {
    if (typeof data.id !== 'number') {
      throw new Error('Invalid input: id is required')
    }
    requireStrings(data, ['name', 'description', 'language'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id, ...rest } = data
    return prisma.project.update({
      where: { id: id! },
      data: rest,
    })
  })

export const addExperience = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: ExperiencePayload) => {
    requireStrings(data, ['role', 'company', 'language'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id: _id, ...rest } = data
    return prisma.experience.create({ data: rest })
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    return prisma.experience.delete({ where: { id: data.id } })
  })

export const updateExperience = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: ExperiencePayload) => {
    if (typeof data.id !== 'number') {
      throw new Error('Invalid input: id is required')
    }
    requireStrings(data, ['role', 'company', 'language'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id, ...rest } = data
    return prisma.experience.update({
      where: { id: id! },
      data: rest,
    })
  })
