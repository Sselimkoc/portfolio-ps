import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BatteryFull, BatteryCharging } from 'lucide-react'

interface TopBarProps {
  onPowerOff: () => void
  onMinimizeAll: () => void
  onMaximizeAll: () => void
}

export default function TopBar({
  onPowerOff,
  onMinimizeAll,
  onMaximizeAll,
}: TopBarProps) {
  const { t, i18n } = useTranslation()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number>(50)

  useEffect(() => {
    // Initialize after hydration to match server render
    setMounted(true)
    setBatteryLevel(Math.floor(Math.random() * 20) + 30)

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

  useEffect(() => {
    if (!mounted) return

    const chargeInterval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev >= 100) return 100
        const newLevel = prev + Math.floor(Math.random() * 3) + 1
        return Math.min(newLevel, 100) // Emin olmak için cap'le
      })
    }, 3000)

    return () => clearInterval(chargeInterval)
  }, [mounted])

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="mac-topbar h-12 rounded-none px-6 py-2 flex items-center justify-between backdrop-blur-xl bg-linear-to-b from-white/16 to-white/10 border-b border-white/20">
      {/* Left - Control Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPowerOff}
          style={{ backgroundColor: '#ff5f57' }}
          className="w-3 h-3 rounded-full transition-all hover:shadow-lg hover:scale-110 cursor-pointer hover:brightness-110 active:scale-95"
          title={t('topbar.close')}
        />
        <button
          onClick={onMinimizeAll}
          style={{ backgroundColor: '#febc2e' }}
          className="w-3 h-3 rounded-full transition-all hover:shadow-lg hover:scale-110 cursor-pointer hover:brightness-110 active:scale-95"
          title={t('topbar.minimize')}
        />
        <button
          onClick={onMaximizeAll}
          style={{ backgroundColor: '#28c840' }}
          className="w-3 h-3 rounded-full transition-all hover:shadow-lg hover:scale-110 cursor-pointer hover:brightness-110 active:scale-95"
          title={t('topbar.maximize')}
        />
      </div>

      {/* Right - Time + Language + Battery */}
      <div className="flex items-center gap-5">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/8 backdrop-blur-sm hover:bg-white/12 transition-all">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`text-xs font-medium px-2 py-0.5 rounded transition-all ${
              i18n.language === 'en'
                ? 'text-white bg-white/25 shadow-md'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            EN
          </button>
          <span className="text-white/25 text-xs">•</span>
          <button
            onClick={() => handleLanguageChange('tr')}
            className={`text-xs font-medium px-2 py-0.5 rounded transition-all ${
              i18n.language === 'tr'
                ? 'text-white bg-white/25 shadow-md'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            TR
          </button>
        </div>
        {mounted && (
          <span className="text-white/80 font-medium text-xs tracking-tight">
            {currentTime}
          </span>
        )}

        {/* Battery Status */}
        {mounted && (
          <div className="flex items-center gap-1.5 text-white/70 hover:text-white transition-all">
            {batteryLevel < 100 && (
              <BatteryCharging
                size={16}
                className="animate-pulse text-blue-300"
              />
            )}

            {batteryLevel === 100 && (
              <BatteryFull size={16} className="text-green-300" />
            )}
            <span className="text-xs font-medium">{batteryLevel}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
