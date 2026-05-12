import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { checkAuthCookie, verifyPassword } from './auth'
import SleepScreenThree from './sleep/SleepScreenThree'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if already authenticated via HTTP-only cookie
    const checkAuth = async () => {
      try {
        const result = await checkAuthCookie()
        setIsAuthenticated(result.authenticated)
      } catch (error) {
        // Network error or endpoint doesn't exist, require login
        setIsAuthenticated(false)
      }
      setIsChecking(false)
    }

    checkAuth()

    // Auto-focus input after mount
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 500)
  }, [])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await verifyPassword({
        data: { password } as any,
      })

      if (result instanceof Response) {
        const data = await result.json()
        if (data && data.success) {
          setIsAuthenticated(true)
        } else {
          setPassword('')
        }
      } else {
        if ((result as any).success) {
          setIsAuthenticated(true)
        } else {
          setPassword('')
        }
      }
    } catch {
      setPassword('')
    }
  }

  const handleGoBack = () => {
    navigate({ to: '/' })
  }

  if (isChecking) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Three.js animated background - same as sleep screen */}
        <div className="absolute inset-0">
          <SleepScreenThree
            onWake={handleGoBack}
            customMessage={t('auth.fullMessage')}
          />
        </div>

        {/* Password Input - Visible for debugging */}
        <form
          onSubmit={handlePasswordSubmit}
          className="absolute inset-0 flex items-center justify-center"
        >
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-0 h-0 opacity-0"
            autoComplete="off"
            tabIndex={-1}
            maxLength={10}
            placeholder="Password"
          />
        </form>
      </div>
    )
  }

  return <>{children}</>
}
