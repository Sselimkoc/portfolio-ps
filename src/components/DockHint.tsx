import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function DockHint() {
  const { t } = useTranslation()

  return (
    <motion.div
      className="fixed bottom-30 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
    >
      <motion.div
        className="relative glass glass-shadow rounded-xl px-5 py-3 text-white text-sm font-medium backdrop-blur-xl"
        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {t('dock.hint')}

        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0
          border-l-8 border-r-8 border-t-8
          border-l-transparent border-r-transparent border-t-white/70"
        />
      </motion.div>
    </motion.div>
  )
}
