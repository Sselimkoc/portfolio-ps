import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wifi } from 'lucide-react'

interface TopBarProps {
  onPowerOff: () => void
}

export default function TopBar({ onPowerOff }: TopBarProps) {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [batteryLevel, setBatteryLevel] = useState<number>(58)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
      setCurrentTime(`${hours}:${minutes} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass glass-shadow h-12 rounded-none border-b-0 px-6 py-2 flex items-center justify-between">
      {/* Left - Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPowerOff}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-all hover:shadow-lg cursor-pointer"
          title={t('topbar.close')}
        />
        <button
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-all hover:shadow-lg cursor-pointer"
          title={t('topbar.minimize')}
        />
        <button
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-all hover:shadow-lg cursor-pointer"
          title={t('topbar.maximize')}
        />
      </div>

      {/* Right - Status Icons */}
      <div className="flex items-center gap-3">
        <span className="text-gray-300 text-xs font-semibold">
          {currentTime}
        </span>

        <Wifi size={14} className="text-gray-400" />

        <span className="text-gray-400 text-xs">{batteryLevel}%</span>
      </div>
    </div>
  )
}
