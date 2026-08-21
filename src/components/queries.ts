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
  cvUrl?: string
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

export type BlogPostPayload = {
  id?: number
  title: string
  excerpt: string
  tags: Array<string>
  href: string
  publishedAt?: string
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
    // Cache on globalThis in every environment so warm serverless invocations
    // reuse the connection instead of opening a fresh one per request.
    globalForPrisma.prisma = prismaClient
  }
  return prismaClient!
}

function requireId(data: unknown): IdentifiedRecord {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as Record<string, unknown>).id !== 'number'
  ) {
    throw new Error('Invalid input: id is required')
  }
  return { id: (data as { id: number }).id }
}

function requireStrings(data: Record<string, unknown>, fields: Array<string>) {
  for (const field of fields) {
    if (typeof data[field] !== 'string' || data[field] === '') {
      throw new Error(`Invalid input: ${field} is required`)
    }
  }
}

async function fetchPortfolioData(language: string) {
  const prisma = await initializePrisma()
  const [profile, skills, projects, experience, blogPosts] = await Promise.all([
    prisma.profile.findFirst({ where: { language } }),
    prisma.skill.findMany(),
    prisma.project.findMany({ where: { language } }),
    prisma.experience.findMany({ where: { language }, orderBy: { order: 'asc' } }),
    prisma.blogPost.findMany({ where: { language }, orderBy: { createdAt: 'desc' } }),
  ])

  return {
    profile,
    skills: groupAndSortSkills(skills),
    rawSkills: skills,
    projects,
    experience,
    blogPosts,
  }
}

// Portfolio content changes only via the admin panel, so cache it in memory
// for a few minutes to avoid a Neon round trip on every page load. Mutations
// below clear this cache so edits show up immediately.
const PORTFOLIO_CACHE_TTL_MS = 5 * 60 * 1000
const portfolioCache = new Map<
  string,
  { data: Awaited<ReturnType<typeof fetchPortfolioData>>; expires: number }
>()

function invalidatePortfolioCache() {
  portfolioCache.clear()
}

export const getPortfolioData = createServerFn({ method: 'POST' })
  .inputValidator((data?: { language?: string }) => ({
    language: data?.language === 'en' ? 'en' : 'tr',
  }))
  .handler(async ({ data }) => {
    const { language } = data
    const cached = portfolioCache.get(language)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }

    const result = await fetchPortfolioData(language)
    portfolioCache.set(language, { data: result, expires: Date.now() + PORTFOLIO_CACHE_TTL_MS })
    return result
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

    const result = existing
      ? await prisma.profile.update({
          where: { id: existing.id },
          data: rest,
        })
      : await prisma.profile.create({
          data: { ...rest, language: lang },
        })
    invalidatePortfolioCache()
    return result
  })

export const addSkill = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: SkillPayload) => {
    requireStrings(data, ['group', 'name'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const result = await prisma.skill.create({ data })
    invalidatePortfolioCache()
    return result
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const result = await prisma.skill.delete({ where: { id: data.id } })
    invalidatePortfolioCache()
    return result
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
    const result = await prisma.project.create({ data: rest })
    invalidatePortfolioCache()
    return result
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const result = await prisma.project.delete({ where: { id: data.id } })
    invalidatePortfolioCache()
    return result
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
    const result = await prisma.project.update({
      where: { id: id! },
      data: rest,
    })
    invalidatePortfolioCache()
    return result
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
    const result = await prisma.experience.create({ data: rest })
    invalidatePortfolioCache()
    return result
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const result = await prisma.experience.delete({ where: { id: data.id } })
    invalidatePortfolioCache()
    return result
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
    const result = await prisma.experience.update({
      where: { id: id! },
      data: rest,
    })
    invalidatePortfolioCache()
    return result
  })

export const addBlogPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator((data: BlogPostPayload) => {
    requireStrings(data, ['title', 'excerpt', 'href', 'language'])
    return data
  })
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const { id: _id, ...rest } = data
    const result = await prisma.blogPost.create({ data: rest })
    invalidatePortfolioCache()
    return result
  })

export const deleteBlogPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(requireId)
  .handler(async ({ data }) => {
    const prisma = await initializePrisma()
    const result = await prisma.blogPost.delete({ where: { id: data.id } })
    invalidatePortfolioCache()
    return result
  })
