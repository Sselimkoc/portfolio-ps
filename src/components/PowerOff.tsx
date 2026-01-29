import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface PowerOffProps {
  onPowerOn: () => void
}

export default function PowerOff({ onPowerOn }: PowerOffProps) {
  const { t } = useTranslation()

  // Yıldızları oluştur
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }))

  // Container varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  // Yıldız varyantları
  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  }

  // İçerik varyantları
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: 'spring' as const,
        stiffness: 50,
      },
    },
  }

  return (
    <motion.div
      className="w-full h-screen bg-black flex items-center justify-center cursor-pointer overflow-hidden relative"
      onClick={onPowerOn}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Yıldızlar Container */}
      <motion.div
        className="absolute inset-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            variants={starVariants}
            style={
              {
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              } as React.CSSProperties
            }
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </motion.div>

      {/* İçerik */}
      <motion.div
        className="text-center relative z-10"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-gray-400 text-lg font-light tracking-wider"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {t('poweroff.message')}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
