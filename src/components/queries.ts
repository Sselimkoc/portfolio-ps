import { createServerFn } from '@tanstack/react-start'
import { PrismaNeon } from '@prisma/adapter-neon'
// Import runtime instance
import { PrismaClient as PrismaCtor } from '@prisma/client'

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

const isServer = typeof window === 'undefined'
const databaseUrl = process.env.DATABASE_URL

if (isServer && !databaseUrl) {
  throw new Error('DATABASE_URL is not set.')
}

const globalForPrisma = globalThis as unknown as { prisma?: any }

let prismaClient: any = globalForPrisma.prisma

if (isServer && !prismaClient) {
  const adapter = new PrismaNeon({ connectionString: databaseUrl! })
  prismaClient = new PrismaCtor({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
  }
}

export const prisma = prismaClient

export const getPortfolioData = createServerFn({ method: 'POST' }).handler(
  async ({ data }: any) => {
    const language = (data?.language || 'tr') as string
    const [profile, skills, projects, experience] = await Promise.all([
      prisma.profile.findFirst({ where: { language } }),
      prisma.skill.findMany(),
      prisma.project.findMany({ where: { language } }),
      prisma.experience.findMany({ where: { language }, orderBy: { order: 'asc' } }),
    ])

    const groupedSkills = skills.reduce((acc: Array<any>, skill: any) => {
      const group = acc.find((g: any) => g.title === skill.group)
      if (group) {
        group.items.push(skill.name)
      } else {
        acc.push({ title: skill.group, items: [skill.name] })
      }
      return acc
    }, [])

    return {
      profile,
      skills: groupedSkills,
      rawSkills: skills,
      projects,
      experience,
    }
  },
)

export const updateProfile = createServerFn({ method: 'POST' }).handler(
  async ({ data }: any) => {
    const payload = data as unknown as ProfilePayload
    const { id, language, ...rest } = payload
    const lang = language || 'tr'

    // First, find the profile by language
    const existing = await prisma.profile.findFirst({ where: { language: lang } })

    if (existing) {
      // Update existing profile
      return prisma.profile.update({
        where: { id: existing.id },
        data: rest,
      })
    } else {
      // Create new profile
      return prisma.profile.create({
        data: { ...rest, language: lang },
      })
    }
  },
)

export const addSkill = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const payload = data as unknown as SkillPayload
    return prisma.skill.create({ data: payload })
  },
)

export const deleteSkill = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const { id } = data as unknown as IdentifiedRecord
    return prisma.skill.delete({ where: { id } })
  },
)

export const addProject = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    return prisma.project.create({ data: data as unknown as Record<string, any> })
  },
)

export const deleteProject = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const { id } = data as unknown as IdentifiedRecord
    return prisma.project.delete({ where: { id } })
  },
)

export const updateProject = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const payload = data as unknown as ProjectPayload
    const { id, ...rest } = payload
    return prisma.project.update({
      where: { id: id! },
      data: rest,
    })
  },
)

export const addExperience = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    return prisma.experience.create({ data: data as unknown as Record<string, any> })
  },
)

export const deleteExperience = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const { id } = data as unknown as IdentifiedRecord
    return prisma.experience.delete({ where: { id } })
  },
)

export const updateExperience = createServerFn({ method: 'POST' }).handler(
  ({ data }: any) => {
    const payload = data as unknown as ExperiencePayload
    const { id, ...rest } = payload
    return prisma.experience.update({
      where: { id: id! },
      data: rest,
    })
  },
)
