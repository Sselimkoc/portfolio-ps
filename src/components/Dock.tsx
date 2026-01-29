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
  const minimizedApps = openWindows.filter((w) => w.isMinimized && w.isOpen)

  // Separator element indicator
  const showSeparator = minimizedApps.length > 0

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock-shadow h-20 flex items-center justify-center px-3 z-50 opacity-95 hover:opacity-100 transition-opacity duration-300 ring-0"
      style={
        {
          overflow: 'visible',
        } as any
      }
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: 'spring',
        stiffness: 150,
        damping: 20,
      }}
    >
      <motion.div
        className="flex gap-2 items-center justify-center"
        style={{ overflow: 'visible' } as any}
      >
        {dockApps.map((dockApp) => {
          const Icon = dockApp.icon
          const isHovered = hoveredApp === dockApp.id
          const appWindow = openWindows.find((w) => w.id === dockApp.id)
          const isActive = !!appWindow && appWindow.isOpen && !appWindow.isMinimized

          return (
            <motion.div
              key={dockApp.id}
              className="relative"
              style={
                {
                  zIndex: isHovered ? 10 : 0,
                } as any
              }
              onMouseEnter={() => setHoveredApp(dockApp.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-lg px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/20 z-20 shadow-lg"
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
                    borderTop: '6px solid rgba(0, 0, 0, 0.75)',
                  }}
                />
              </motion.div>

              {/* Button - with modern magnification */}
              <motion.button
                onClick={() => onDockAction(() => dockApp.action(dockApp.id))}
                className="relative transition-all duration-150 focus:outline-none"
                style={
                  {
                    width: isHovered ? 64 : 56,
                    height: isHovered ? 64 : 56,
                  } as any
                }
                animate={
                  {
                    width: isHovered ? 64 : 56,
                    height: isHovered ? 64 : 56,
                  } as any
                }
                whileHover={{
                  y: -8,
                }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <div
                  className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl backdrop-blur-xl transition-all duration-150"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.45)'
                      : 'rgba(255, 255, 255, 0.16)',
                    boxShadow:
                      '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <motion.div>
                    <Icon
                      size={28}
                      className="transition-colors duration-150 text-white/70"
                    />
                  </motion.div>

                  {/* Active Indicator - Inside the box */}
                  {isActive && (
                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-white shadow-lg" />
                  )}
                </div>
              </motion.button>
            </motion.div>
          )
        })}

        {/* Separator */}
        {showSeparator && (
          <motion.div
            className="w-px h-9 bg-white/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
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
              style={
                {
                  zIndex: isHovered ? 10 : 0,
                } as any
              }
              onMouseEnter={() => setHoveredApp(`minimized-${windowState.id}`)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-lg px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/20 z-20 shadow-lg"
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
                    borderTop: '6px solid rgba(0, 0, 0, 0.75)',
                  }}
                />
              </motion.div>

              {/* Minimized Button */}
              <motion.button
                onClick={() => onRestoreWindow(windowState.id)}
                className="relative transition-all duration-150 focus:outline-none"
                style={
                  {
                    width: isHovered ? 52 : 44,
                    height: isHovered ? 52 : 44,
                  } as any
                }
                animate={
                  {
                    width: isHovered ? 52 : 44,
                    height: isHovered ? 52 : 44,
                  } as any
                }
                whileHover={{
                  y: -6,
                }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center rounded-xl backdrop-blur-lg transition-all duration-150"
                  style={{
                    backgroundColor: isHovered
                      ? 'rgba(255, 255, 255, 0.18)'
                      : 'rgba(255, 255, 255, 0.10)',
                    border: isHovered
                      ? '1px solid rgba(255, 255, 255, 0.35)'
                      : '0.5px solid rgba(255, 255, 255, 0.20)',
                    boxShadow: isHovered
                      ? '0 6px 20px rgba(255, 255, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.12), inset 0 0.5px 1px rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <Icon
                    size={isHovered ? 18 : 16}
                    className={`transition-colors duration-150 ${
                      isHovered ? 'text-white' : 'text-white/50'
                    }`}
                  />
                </div>
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
