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
}

export type SkillPayload = {
  group: string
  name: string
}

export type IdentifiedRecord = {
  id: number
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

export const getPortfolioData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [profile, skills, projects, experience] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany(),
      prisma.project.findMany(),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
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
  ({ data }: any) => {
    const payload = data as unknown as ProfilePayload
    const { id, ...rest } = payload

    return prisma.profile.upsert({
      where: { id: id ?? 1 },
      update: rest,
      create: { ...rest, id: id ?? 1 },
    })
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
