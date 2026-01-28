import { createServerFn } from '@tanstack/react-start'
import { prisma } from './queries'
import crypto from 'crypto'

// Rate limiting storage (in-memory)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

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

      // Hash the provided password
      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')

      // Compare hashes
      if (passwordHash === auth.passwordHash) {
        // Success - clear attempts
        loginAttempts.delete(ip)
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
