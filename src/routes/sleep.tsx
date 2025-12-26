import { createFileRoute } from '@tanstack/react-router'
import SleepScreenThree from '../components/sleep/SleepScreenThree'

export const Route = createFileRoute('/sleep')({
  component: SleepScreenThree,
})
