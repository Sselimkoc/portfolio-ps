import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { apps } from '../data/apps'

interface DockApp {
  id: string
  titleKey: string
  icon: React.ElementType
  action: (id: string) => void
}

interface OpenWindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
}

interface DockProps {
  dockApps: Array<DockApp>
  onDockAction: (action: () => void) => void
  openWindows?: Array<OpenWindowState>
  onRestoreWindow?: (appId: string) => void
}

export default function Dock({ 
  dockApps, 
  onDockAction,
  openWindows = [],
  onRestoreWindow = () => {},
}: DockProps) {
  const { t } = useTranslation()
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)

  // Find minimized windows
  const minimizedApps = openWindows.filter(
    (w) => w.isMinimized && w.isOpen,
  )

  // Separator element indicator
  const showSeparator = minimizedApps.length > 0

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock glass-shadow h-18 flex items-center justify-center px-4 z-50 opacity-90 hover:opacity-100 transition"
      style={{
        overflow: 'visible',
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <motion.div className="flex gap-3 items-center" style={{ overflow: 'visible' }}>
        {dockApps.map((dockApp) => {
          const Icon = dockApp.icon
          const isHovered = hoveredApp === dockApp.id
          return (
            <motion.div
              key={dockApp.id}
              className="relative"
              style={{
                zIndex: isHovered ? 10 : 0,
              }}
              onMouseEnter={() => setHoveredApp(dockApp.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/20 z-20"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.3) inset',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={
                  isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {t(dockApp.titleKey)}
                {/* Arrow tail */}
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '6px solid rgba(0, 0, 0, 0.8)',
                  }}
                />
              </motion.div>

              {/* Button */}
              <motion.button
                onClick={() => onDockAction(() => dockApp.action(dockApp.id))}
                className="glass-shadow w-14 h-14 flex items-center justify-center text-white rounded-2xl ring-1 backdrop-blur-[14px] relative transition-all"
                style={{
                  backgroundColor: isHovered
                    ? 'hsl(0 0% 100% / 0.4)'
                    : 'hsl(0 0% 100% / 0.28)',
                  boxShadow: isHovered
                    ? '0 8px 24px rgba(255, 255, 255, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                  borderColor: isHovered
                    ? 'hsl(0 0% 100% / 0.5)'
                    : 'hsl(0 0% 100% / 0.35)',
                }}
                whileHover={{
                  scale: 1.25,
                  y: -6,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <motion.div
                  animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    size={28}
                    className={isHovered ? 'text-white' : 'text-white/70'}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          )
        })}

        {/* Separator */}
        {showSeparator && (
          <div className="w-px h-8 bg-white/20" />
        )}

        {/* Minimized Windows */}
        {minimizedApps.map((windowState) => {
          const app = apps.find((a) => a.id === windowState.id)
          if (!app) return null
          const Icon = app.icon
          const isHovered = hoveredApp === `minimized-${windowState.id}`
          
          return (
            <motion.div
              key={`minimized-${windowState.id}`}
              className="relative"
              style={{
                zIndex: isHovered ? 10 : 0,
              }}
              onMouseEnter={() => setHoveredApp(`minimized-${windowState.id}`)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/20 z-20"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.3) inset',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={
                  isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {t(app.title)}
                {/* Arrow tail */}
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '6px solid rgba(0, 0, 0, 0.8)',
                  }}
                />
              </motion.div>

              {/* Minimized Button */}
              <motion.button
                onClick={() => onRestoreWindow(windowState.id)}
                className="glass-shadow w-12 h-12 flex items-center justify-center text-white rounded-xl ring-1 backdrop-blur-[14px] relative transition-all"
                style={{
                  backgroundColor: isHovered
                    ? 'hsl(0 0% 100% / 0.15)'
                    : 'hsl(0 0% 100% / 0.06)',
                  boxShadow: isHovered
                    ? '0 8px 24px rgba(255, 255, 255, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.12)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.03)',
                  borderColor: isHovered
                    ? 'hsl(0 0% 100% / 0.2)'
                    : 'hsl(0 0% 100% / 0.12)',
                }}
                whileHover={{
                  scale: 1.1,
                  y: -4,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Icon
                  size={18}
                  className={isHovered ? 'text-white' : 'text-white/50'}
                />
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
