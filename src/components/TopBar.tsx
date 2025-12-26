import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wifi } from 'lucide-react'

interface TopBarProps {
  onPowerOff: () => void
}

export default function TopBar({ onPowerOff }: TopBarProps) {
  const { t, i18n } = useTranslation()
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

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

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
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 px-2 py-1 rounded border border-white/10 bg-white/5">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`text-xs font-medium px-2 py-0.5 rounded transition-all ${
              i18n.language === 'en'
                ? 'text-white bg-white/20'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            EN
          </button>
          <span className="text-gray-500">|</span>
          <button
            onClick={() => handleLanguageChange('tr')}
            className={`text-xs font-medium px-2 py-0.5 rounded transition-all ${
              i18n.language === 'tr'
                ? 'text-white bg-white/20'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            TR
          </button>
        </div>

        <span className="text-gray-300 text-xs font-semibold">
          {currentTime}
        </span>

        <Wifi size={14} className="text-gray-300" />

        <span className="text-gray-300 text-xs">{batteryLevel}%</span>
      </div>
    </div>
  )
}
