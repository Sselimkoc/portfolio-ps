import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface SleepOverlayProps {
  isActive: boolean
  onWakeUp: () => void
}

export default function SleepOverlay({ isActive, onWakeUp }: SleepOverlayProps) {
  const { t } = useTranslation()
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (isActive) {
      // Yıldızları oluştur
      const newStars = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setStars(newStars)

      // Uyandırmak için click veya key press dinle
      const handleWakeUp = () => {
        onWakeUp()
      }

      window.addEventListener('click', handleWakeUp)
      window.addEventListener('keydown', handleWakeUp)

      return () => {
        window.removeEventListener('click', handleWakeUp)
        window.removeEventListener('keydown', handleWakeUp)
      }
    }
  }, [isActive, onWakeUp])

  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50"
    >
      {/* Yıldızlar */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: star.id * 0.05, duration: 0.5 }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Yıldız titremesi */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: star.id * 0.1 }}
            className="w-full h-full"
          />
        </motion.div>
      ))}

      {/* Uyandırma metni */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-white text-center"
      >
        <p className="text-sm text-white/70">{t('sleep.wakeUpMessage')}</p>
      </motion.div>
    </motion.div>
  )
}
