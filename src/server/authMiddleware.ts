import { createMiddleware } from '@tanstack/react-start'
import { getCookie, setResponseStatus } from '@tanstack/react-start/server'
import { SESSION_COOKIE, verifySession } from './session'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const token = getCookie(SESSION_COOKIE)
    if (!token || !(await verifySession(token))) {
      setResponseStatus(401)
      throw new Error('Unauthorized')
    }
    return next()
  },
)
