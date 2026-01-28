import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Shortcut {
  id: string
  title: string
  icon: React.ElementType
  onOpen: (appId: string) => void
}

interface DesktopShortcutsProps {
  shortcuts: Array<Shortcut>
}

export default function DesktopShortcuts({ shortcuts }: DesktopShortcutsProps) {
  const { t } = useTranslation()
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <div className="absolute top-20 left-6 flex flex-col gap-6 pointer-events-none select-none">
      {shortcuts.map((shortcut, index) => {
        const Icon = shortcut.icon
        const isHovered = hoveredId === shortcut.id

        return (
          <motion.div
            key={shortcut.id}
            className="pointer-events-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredId(shortcut.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.button
              onClick={() => shortcut.onOpen(shortcut.id)}
              className="flex flex-col items-center gap-2 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon Background */}
              <motion.div
                className={`w-16 h-16 flex items-center justify-center rounded-2xl ring-2 backdrop-blur-md transition-all ${
                  isHovered ? 'ring-white/40' : 'ring-white/20'
                }`}
                style={
                  {
                    backgroundColor: isHovered
                      ? 'hsla(0 0% 100% / 0.25)'
                      : 'hsla(0 0% 100% / 0.12)',
                    boxShadow: isHovered
                      ? '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                  } as any
                }
                animate={isHovered ? { y: -4 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={32}
                  className={isHovered ? 'text-white' : 'text-white/70'}
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Label */}
              <motion.div
                className="text-center"
                animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <p
                  className="text-white text-xs font-medium text-center leading-tight max-w-16 wrap-break-word"
                  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                >
                  {t(shortcut.title)}
                </p>
              </motion.div>
            </motion.button>
          </motion.div>
        )
      })}
    </div>
  )
}
