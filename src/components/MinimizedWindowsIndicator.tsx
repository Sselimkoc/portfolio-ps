import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { apps } from '../data/apps'

interface OpenWindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
}

interface MinimizedWindowsIndicatorProps {
  openWindows: Array<OpenWindowState>
  onRestoreWindow: (appId: string) => void
}

export default function MinimizedWindowsIndicator({
  openWindows,
  onRestoreWindow,
}: MinimizedWindowsIndicatorProps) {
  const { t } = useTranslation()

  const minimizedAndOpenWindows = openWindows.filter(
    (w) => w.isMinimized && w.isOpen,
  )

  if (minimizedAndOpenWindows.length === 0) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-32 left-1/2 -translate-x-1/2 glass glass-shadow rounded-lg px-3 py-2 flex gap-2 z-40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {minimizedAndOpenWindows.map((windowState) => {
        const app = apps.find((a) => a.id === windowState.id)
        if (!app) return null
        return (
          <motion.button
            key={windowState.id}
            onClick={() => onRestoreWindow(windowState.id)}
            className="glass-button rounded-md px-3 py-1 text-white text-sm font-medium whitespace-nowrap hover:bg-white/20 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t(app.title)}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
