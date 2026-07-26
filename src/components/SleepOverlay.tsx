import { Suspense, lazy } from 'react'

const SleepScreenThree = lazy(() => import('./sleep/SleepScreenThree'))

interface SleepOverlayProps {
  isActive: boolean
  onWakeUp: () => void
}

export default function SleepOverlay({
  isActive,
  onWakeUp,
}: SleepOverlayProps) {
  if (!isActive) return null

  return (
    <Suspense fallback={null}>
      <SleepScreenThree onWake={onWakeUp} />
    </Suspense>
  )
}
