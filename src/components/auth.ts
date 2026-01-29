import { createServerFn } from '@tanstack/react-start'
import { prisma } from './queries'
import { compare, hash } from 'bcryptjs'

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
      const auth = await prisma.adminAuth.findFirst()

      if (!auth) {
        return { error: 'No password configured' }
      }

      // Compare with bcrypt (secure timing-resistant comparison)
      const isPasswordValid = await compare(password, auth.passwordHash)

      if (isPasswordValid) {
        // Success - clear attempts and set HTTP-only cookie
        loginAttempts.delete(ip)
        
        // Set HTTP-only cookie for 24 hours
        const response = new Response(JSON.stringify({ success: true }), {
          headers: {
            'Set-Cookie': `tedi_auth=verified; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`,
            'Content-Type': 'application/json',
          },
        })
        
        return { success: true }
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
  async ({ request }: any) => {
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
