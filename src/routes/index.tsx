import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import CanvasArea from '../components/CanvasArea'
import PowerOff from '../components/PowerOff'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [isOn, setIsOn] = useState<boolean>(true)

  if (!isOn) {
    return <PowerOff onPowerOn={() => setIsOn(true)} />
  }

  return (
    <div className="w-full h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <TopBar onPowerOff={() => setIsOn(false)} />
      <CanvasArea />
    </div>
  )
}
