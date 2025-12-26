import { createFileRoute } from '@tanstack/react-router'
import { getPortfolioData } from '../components/queries'
import CanvasArea from '../components/CanvasArea'

export const Route = createFileRoute('/')({
  loader: () => getPortfolioData(),
  component: CanvasArea,
})
