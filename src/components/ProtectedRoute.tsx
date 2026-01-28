import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { verifyPassword } from './auth'
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
    // Check if already authenticated
    const auth = sessionStorage.getItem('tedi_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)

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

      if (result.success) {
        sessionStorage.setItem('tedi_auth', 'true')
        setIsAuthenticated(true)
      } else {
        // Wrong password - show error and clear
        setPassword('')
      }
    } catch (error) {
      console.error('Auth error:', error)
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

        {/* Invisible Password Input */}
        <form
          onSubmit={handlePasswordSubmit}
          className="absolute opacity-0 pointer-events-none"
        >
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-0 h-0"
            autoComplete="off"
            tabIndex={-1}
            maxLength={10}
          />
        </form>
      </div>
    )
  }

  return <>{children}</>
}
