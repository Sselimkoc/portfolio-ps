import { createServerFn } from '@tanstack/react-start'
import { compare, hash } from 'bcryptjs'

// Dynamic prisma import to prevent client bundling
async function initializePrisma() {
  const isServer = typeof window === 'undefined'
  if (!isServer) return null
  
  const { PrismaNeon } = await import('@prisma/adapter-neon')
  const { PrismaClient } = await import('@prisma/client')
  
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

// Rate limiting storage (in-memory)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes
const BCRYPT_ROUNDS = 12

export const verifyPassword = createServerFn({ method: 'POST' }).handler(
  async ({ data, request }: any) => {
    try {
      const { password } = data

      // Input validation
      if (!password || typeof password !== 'string') {
        return { error: 'Invalid input' }
      }

      if (password.length > 10) {
        return { error: 'Password too long' }
      }

      // Get client IP for rate limiting
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()

      // Check rate limiting
      const attempts = loginAttempts.get(ip)
      if (attempts) {
        if (attempts.count >= MAX_ATTEMPTS) {
          const timeSinceLastAttempt = now - attempts.lastAttempt
          if (timeSinceLastAttempt < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000)
            return { error: `Too many attempts. Try again in ${remainingTime} minutes` }
          } else {
            // Reset after lockout time
            loginAttempts.delete(ip)
          }
        }
      }

      // Get the stored password hash from database
      const prisma = await initializePrisma()
      if (!prisma) {
        return { error: 'Database not available' }
      }
      
      const auth = await prisma.adminAuth.findFirst()

      if (!auth) {
        return { error: 'No password configured' }
      }

      // Compare with bcrypt (secure timing-resistant comparison)
      const isPasswordValid = await compare(password, auth.passwordHash)

      if (isPasswordValid) {
        // Success - clear attempts and set HTTP-only cookie
        loginAttempts.delete(ip)

        // Decide whether to mark cookie as Secure
        let isHttps = false
        try {
          const forwardedProto = request.headers.get('x-forwarded-proto')
          if (forwardedProto) {
            isHttps = forwardedProto === 'https'
          } else if (request.url) {
            const u = new URL(request.url)
            isHttps = u.protocol === 'https:'
          }
        } catch {
          // Default stays false on local/dev
        }

        const cookieParts = [
          'tedi_auth=verified',
          'Path=/',
          'Max-Age=86400',
          'HttpOnly',
          'SameSite=Strict',
        ]
        if (isHttps) cookieParts.push('Secure')
        const cookieHeader = cookieParts.join('; ')

        // Return Response to set the cookie on the server
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Set-Cookie': cookieHeader,
            'Content-Type': 'application/json',
          },
        })
      } else {
        // Failed - increment attempts
        const currentAttempts = loginAttempts.get(ip)
        if (currentAttempts) {
          loginAttempts.set(ip, {
            count: currentAttempts.count + 1,
            lastAttempt: now,
          })
        } else {
          loginAttempts.set(ip, { count: 1, lastAttempt: now })
        }
        return { error: 'Invalid password' }
      }
    } catch (error) {
      console.error('Auth error:', error)
      return { error: 'Authentication failed' }
    }
  }
)

// Helper function to hash password (for initial setup/password change)
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, BCRYPT_ROUNDS)
}

// Check if user is authenticated via cookie
export const checkAuthCookie = createServerFn({ method: 'GET' }).handler(
  ({ request }: any) => {
    try {
      const cookie = request.headers.get('cookie')

      // Check if tedi_auth cookie exists and is set to "verified"
      if (!cookie || !cookie.includes('tedi_auth=verified')) {
        return { authenticated: false }
      }

      return { authenticated: true }
    } catch (error) {
      console.error('Auth check error:', error)
      return { authenticated: false }
    }
  }
)
