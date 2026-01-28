import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLoaderData } from '@tanstack/react-router'
import { Github, Linkedin, MailQuestion } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apps } from '../data/apps'
import { getPortfolioData } from './queries'
import DraggableWindow from './DraggableWindow'
import DockHint from './DockHint'
import Dock from './Dock'
import IntroOverlay from './IntroOverlay'
import SleepOverlay from './SleepOverlay'

import TopBar from './TopBar'
import AboutEducation from './AboutEducation'
import SkillsPalette from './SkillsPalette'
import ProjectsGallery from './ProjectsGallery'
import ExperienceTimeline from './ExperienceTimeline'
import WallpaperSelector from './WallpaperSelector'
import SlidingPuzzle from './SlidingPuzzle'
import ContactForm from './ContactForm'
import DesktopShortcuts from './DesktopShortcuts'

interface OpenWindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
}

interface DockApp {
  id: string
  titleKey: string
  icon: React.ElementType
  action: (id: string) => void
}

const INTRO_KEY = 'portfolio:introSeen:v1'
const WALLPAPER_KEY = 'portfolio:wallpaper'

export default function CanvasArea() {
  const { t, i18n } = useTranslation()
  const initialData = useLoaderData({ from: '/' }) as any
  const [data, setData] = useState(initialData)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [showDockHint, setShowDockHint] = useState(false)
  const [showIntro, setShowIntro] = useState(() => {
    // Initialize from localStorage to avoid hydration mismatch
    if (typeof window === 'undefined') return false
    return localStorage.getItem(INTRO_KEY) !== '1'
  })
  const [isSleeping, setIsSleeping] = useState(false)

  // Initialize wallpaper from localStorage immediately
  const getInitialWallpaper = () => {
    const wallpapers: Record<string, { url: string; gradient?: boolean }> = {
      default: { url: '/desktop-bg2.jpg' },
      'desktop-bg': { url: '/desktop-bg.jpg' },
      cat: { url: '/railroad-cat.jpg' },
      dark: {
        url: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        gradient: true,
      },
      purple: {
        url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: true,
      },
      sunset: {
        url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        gradient: true,
      },
      ocean: {
        url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        gradient: true,
      },
      forest: {
        url: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        gradient: true,
      },
    }

    const savedWallpaper = localStorage.getItem(WALLPAPER_KEY) || 'default'
    const wallpaper = wallpapers[savedWallpaper] || wallpapers.default

    return {
      backgroundImage: wallpaper.gradient
        ? wallpaper.url
        : `url(${wallpaper.url})`,
    }
  }

  const [backgroundStyle, setBackgroundStyle] = useState(getInitialWallpaper)

  const [openWindows, setOpenWindows] = useState<Array<OpenWindowState>>(
    apps.map((app) => ({
      id: app.id,
      isOpen: false,
      isMinimized: false,
      position: app.defaultPosition || { x: 100, y: 100 },
    })),
  )

  const applyWallpaper = (wallpaperId: string) => {
    const wallpapers: Record<string, { url: string; gradient?: boolean }> = {
      default: { url: '/desktop-bg2.jpg' },
      'desktop-bg': { url: '/desktop-bg.jpg' },
      dark: {
        url: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        gradient: true,
      },
      purple: {
        url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient: true,
      },
      sunset: {
        url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        gradient: true,
      },
      ocean: {
        url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        gradient: true,
      },
      forest: {
        url: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        gradient: true,
      },
      cat: { url: '/railroad-cat.jpg' },
    }

    const wallpaper = wallpapers[wallpaperId] || wallpapers.default
    if (wallpaper.gradient) {
      setBackgroundStyle({
        backgroundImage: wallpaper.url,
      })
    } else {
      setBackgroundStyle({
        backgroundImage: `url(${wallpaper.url})`,
      })
    }
  }

  const skipIntro = () => {
    localStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
    setShowDockHint(true)
  }

  const handlePowerOff = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsSleeping(true)
  }

  const handleWake = () => {
    setIsSleeping(false)
  }

  const handleMinimizeAll = () => {
    setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })))
  }

  const handleMaximizeAll = () => {
    setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: false })))
  }

  // Dil değiştiğinde açık uygulamaların verilerini güncelle
  useEffect(() => {
    const loadDataForLanguage = async () => {
      try {
        const newData = await (getPortfolioData as any)({
          data: { language: i18n.language },
        })
        setData(newData)
      } catch (error) {
        console.error('Failed to load data for language:', error)
      }
    }

    loadDataForLanguage()
  }, [i18n.language])

  const bringToFront = (appId: string) => {
    setOpenWindows((prev) => {
      const windowToMove = prev.find((w) => w.id === appId)
      if (!windowToMove) return prev
      const otherWindows = prev.filter((w) => w.id !== appId)
      return [...otherWindows, windowToMove]
    })
  }

  const handleDockAction = (action: () => void) => {
    setShowDockHint(false)
    action()
  }
  const handleOpenWindow = (appId: string) => {
    setOpenWindows((prev) => {
      const window = prev.find((w) => w.id === appId)
      if (!window) return prev

      let updatedWindows: Array<OpenWindowState>

      // macOS dock behavior: toggle minimize
      if (window.isOpen && !window.isMinimized) {
        // Pencere açık ve görünürse → minimize et
        updatedWindows = prev.map((w) =>
          w.id === appId ? { ...w, isMinimized: true } : w,
        )
      } else {
        // Pencere minimize veya kapalıysa → aç
        updatedWindows = prev.map((w) =>
          w.id === appId ? { ...w, isOpen: true, isMinimized: false } : w,
        )
      }

      // Bring to front when opening
      if (!window.isMinimized || !window.isOpen) {
        const windowToMove = updatedWindows.find((w) => w.id === appId)!
        const otherWindows = updatedWindows.filter((w) => w.id !== appId)
        return [...otherWindows, windowToMove]
      }
      return updatedWindows
    })

    // Bring to front in z-index
    bringToFront(appId)
  }

  const handleCloseWindow = (appId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isOpen: false } : w)),
    )
  }

  const handleMinimizeWindow = (appId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === appId ? { ...w, isMinimized: !w.isMinimized } : w,
      ),
    )
  }

  const handleRestoreWindow = (appId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isMinimized: false } : w)),
    )
  }

  const dockApps: Array<DockApp> = [
    ...apps
      .filter((app) => !['wallpaper', 'puzzle'].includes(app.id))
      .map((app) => ({
        id: app.id,
        titleKey: app.title,
        icon: app.icon,
        action: handleOpenWindow,
      })),
    {
      id: 'github',
      titleKey: 'apps.github.title',
      icon: Github,
      action: () => window.open('https://github.com/Sselimkoc', '_blank'),
    },
    {
      id: 'linkedin',
      titleKey: 'apps.linkedin.title',
      icon: Linkedin,
      action: () =>
        window.open('https://www.linkedin.com/in/sselimkoc462/', '_blank'),
    },
  ]

  // Desktop shortcuts for wallpaper and puzzle
  const desktopShortcuts = [
    {
      id: 'wallpaper',
      title: 'apps.wallpaper.title',
      icon: apps.find((a) => a.id === 'wallpaper')?.icon || MailQuestion,
      onOpen: handleOpenWindow,
    },
    {
      id: 'puzzle',
      title: 'apps.puzzle.title',
      icon: apps.find((a) => a.id === 'puzzle')?.icon || MailQuestion,
      onOpen: handleOpenWindow,
    },
  ]

  return (
    <motion.div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative flex flex-col bg-cover bg-center"
      style={backgroundStyle}
    >
      {/* Desktop content */}
      <div
        className={
          showIntro
            ? 'opacity-0 pointer-events-none transition-opacity duration-200'
            : 'opacity-100 transition-opacity duration-300'
        }
      >
        {/* Desktop Shortcuts */}
        <DesktopShortcuts shortcuts={desktopShortcuts} />

        {/* Top Bar */}
        <TopBar
          onPowerOff={handlePowerOff}
          onMinimizeAll={handleMinimizeAll}
          onMaximizeAll={handleMaximizeAll}
        />

        {/* Draggable Windows */}
        <div className="absolute inset-0 pointer-events-none">
          {openWindows.map((windowState, index) => {
            const app = apps.find((a) => a.id === windowState.id)
            if (!app || !windowState.isOpen || windowState.isMinimized)
              return null

            return (
              <div
                key={windowState.id}
                className="pointer-events-auto"
                style={{ zIndex: 10 + index }}
              >
                <DraggableWindow
                  id={windowState.id}
                  title={t(app.title)}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onBringToFront={bringToFront}
                  dragConstraintsRef={canvasRef}
                  defaultPosition={windowState.position}
                  defaultSize={app.defaultSize || { width: 550, height: 450 }}
                >
                  {app.id === 'about' && data.profile && (
                    <AboutEducation
                      {...data.profile}
                      education={{
                        school: data.profile.school,
                        department: data.profile.department,
                        years: data.profile.years,
                        gpa: data.profile.gpa,
                      }}
                    />
                  )}
                  {app.id === 'skills' && (
                    <SkillsPalette groups={data.skills} />
                  )}
                  {app.id === 'projects' && (
                    <ProjectsGallery projects={data.projects} />
                  )}
                  {app.id === 'experience' && (
                    <ExperienceTimeline items={data.experience} />
                  )}
                  {app.id === 'wallpaper' && (
                    <WallpaperSelector
                      onApply={(wallpaper) => {
                        if (wallpaper.url.includes('gradient')) {
                          setBackgroundStyle({ backgroundImage: wallpaper.url })
                        } else {
                          setBackgroundStyle({
                            backgroundImage: `url(${wallpaper.url})`,
                          })
                        }
                      }}
                    />
                  )}
                  {app.id === 'puzzle' && <SlidingPuzzle />}
                  {app.id === 'contact' && <ContactForm />}
                  {![
                    'about',
                    'skills',
                    'projects',
                    'experience',
                    'wallpaper',
                    'puzzle',
                    'contact',
                  ].includes(app.id) && (
                    <div className="p-5 text-white/80">{t(app.content)}</div>
                  )}
                </DraggableWindow>
              </div>
            )
          })}
        </div>

        {/* Minimized windows are now shown in the Dock */}
        {/* <MinimizedWindowsIndicator
          openWindows={openWindows}
          onRestoreWindow={handleRestoreWindow}
        /> */}

        <AnimatePresence>
          {showDockHint && !showIntro && <DockHint />}
        </AnimatePresence>

        {/* Dock */}
        <Dock
          dockApps={dockApps}
          onDockAction={handleDockAction}
          openWindows={openWindows}
          onRestoreWindow={handleRestoreWindow}
        />
      </div>

      {/* Intro Overlay */}
      <IntroOverlay showIntro={showIntro} onSkipIntro={skipIntro} />

      {/* Sleep Screen */}
      <SleepOverlay isActive={isSleeping} onWakeUp={handleWake} />
    </motion.div>
  )
}
