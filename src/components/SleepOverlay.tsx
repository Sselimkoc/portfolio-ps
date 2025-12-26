import SleepScreenThree from './sleep/SleepScreenThree'

interface SleepOverlayProps {
  isActive: boolean
  onWakeUp: () => void
}

export default function SleepOverlay({
  isActive,
  onWakeUp,
}: SleepOverlayProps) {
  if (!isActive) return null

  return <SleepScreenThree onWake={onWakeUp} />
}
