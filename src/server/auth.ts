import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { compare, hash } from 'bcryptjs'
import { SESSION_COOKIE, signSession, verifySession } from './session'
import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { authPrisma?: PrismaClient }

async function initializePrisma() {
  const isServer = typeof window === 'undefined'
  if (!isServer) return null

  if (!globalForPrisma.authPrisma) {
    const { PrismaNeon } = await import('@prisma/adapter-neon')
    const { PrismaClient } = await import('@prisma/client')

    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
    globalForPrisma.authPrisma = new PrismaClient({ adapter })
  }

  return globalForPrisma.authPrisma
}

const MAX_ATTEMPTS = 5
const LOCKOUT_TIME_MS = 15 * 60 * 1000 // 15 minutes
const SESSION_MAX_AGE_SEC = 3600
const BCRYPT_ROUNDS = 12

export const verifyPassword = createServerFn({ method: 'POST' })
  .inputValidator((data: { password: string }) => {
    if (
      !data ||
      typeof data.password !== 'string' ||
      data.password.length === 0 ||
      data.password.length > 128
    ) {
      throw new Error('Invalid input')
    }
    return data
  })
  .handler(async ({ data }) => {
    try {
      const prisma = await initializePrisma()
      if (!prisma) {
        return { error: 'Database not available' }
      }

      const auth = await prisma.adminAuth.findFirst()
      if (!auth) {
        return { error: 'No password configured' }
      }

      const now = new Date()

      // DB-backed lockout: survives redeploys and works across serverless instances
      if (auth.lockedUntil && auth.lockedUntil > now) {
        const remainingMin = Math.ceil(
          (auth.lockedUntil.getTime() - now.getTime()) / 60000,
        )
        return { error: `Too many attempts. Try again in ${remainingMin} minutes` }
      }

      const isPasswordValid = await compare(data.password, auth.passwordHash)

      if (isPasswordValid) {
        if (auth.failedAttempts > 0 || auth.lockedUntil) {
          await prisma.adminAuth.update({
            where: { id: auth.id },
            data: { failedAttempts: 0, lockedUntil: null },
          })
        }

        setCookie(SESSION_COOKIE, await signSession(SESSION_MAX_AGE_SEC), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: SESSION_MAX_AGE_SEC,
        })
        return { success: true }
      }

      // Expired lock counts as a fresh window
      const priorAttempts = auth.lockedUntil && auth.lockedUntil <= now ? 0 : auth.failedAttempts
      const failedAttempts = priorAttempts + 1
      await prisma.adminAuth.update({
        where: { id: auth.id },
        data: {
          failedAttempts,
          lockedUntil:
            failedAttempts >= MAX_ATTEMPTS
              ? new Date(now.getTime() + LOCKOUT_TIME_MS)
              : null,
        },
      })
      return { error: 'Invalid password' }
    } catch (error) {
      console.error('Auth error:', error)
      return { error: 'Authentication failed' }
    }
  })

// Helper function to hash password (for initial setup/password change)
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, BCRYPT_ROUNDS)
}

export const checkAuthCookie = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const token = getCookie(SESSION_COOKIE)
      return { authenticated: Boolean(token && (await verifySession(token))) }
    } catch (error) {
      console.error('Auth check error:', error)
      return { authenticated: false }
    }
  },
)

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie(SESSION_COOKIE, { path: '/' })
  return { success: true }
})
