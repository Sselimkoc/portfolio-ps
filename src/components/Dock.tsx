import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface DockApp {
  id: string
  titleKey: string
  icon: React.ElementType
  action: (id: string) => void
}

interface DockProps {
  dockApps: Array<DockApp>
  onDockAction: (action: () => void) => void
}

export default function Dock({ dockApps, onDockAction }: DockProps) {
  const { t } = useTranslation()
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock glass-shadow h-18 flex items-center justify-center px-4 z-50 opacity-90 hover:opacity-100 transition"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <motion.div className="flex gap-2 items-center">
        {dockApps.map((dockApp) => {
          const Icon = dockApp.icon
          return (
            <motion.div
              key={dockApp.id}
              className="relative"
              onMouseEnter={() => setHoveredApp(dockApp.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl px-3 py-1.5 rounded-md whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/10"
                initial={{ opacity: 0, y: 5 }}
                animate={
                  hoveredApp === dockApp.id
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 5 }
                }
                transition={{ duration: 0.15 }}
              >
                {t(dockApp.titleKey)}
              </motion.div>

              {/* Button */}
              <motion.button
                onClick={() => onDockAction(() => dockApp.action(dockApp.id))}
                className="glass-button glass-shadow w-14 h-14 flex items-center justify-center text-white"
                whileHover={{
                  scale: 1.25,
                  y: -6,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <motion.div
                  animate={
                    hoveredApp === dockApp.id ? { scale: 1.15 } : { scale: 1 }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    size={28}
                    className={
                      hoveredApp === dockApp.id ? 'text-white' : 'text-white/70'
                    }
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
