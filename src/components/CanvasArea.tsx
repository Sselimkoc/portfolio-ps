import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLoaderData } from '@tanstack/react-router'
import { GithubIcon, LinkedinIcon, MailQuestion } from 'lucide-react'
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
import ContactForm from './ContactForm'
import DesktopShortcuts from './DesktopShortcuts'
import WarningDialog from './WarningDialog'

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

export default function CanvasArea() {
  const { t, i18n } = useTranslation()
  const initialData = useLoaderData({ from: '/' }) as any
  const [data, setData] = useState(initialData)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [showDockHint, setShowDockHint] = useState(false)
  // Start with true for first-time visitors, useEffect will hide if needed
  const [showIntro, setShowIntro] = useState(true)
  const [isSleeping, setIsSleeping] = useState(false)
  const [warningDialog, setWarningDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    url: string
  }>({ isOpen: false, title: '', message: '', url: '' })

  // Check localStorage after mount - hide intro if already seen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenIntro = localStorage.getItem(INTRO_KEY) === '1'
      if (hasSeenIntro) {
        setShowIntro(false)
      }
    }
  }, [])

  // Update data when language changes
  useEffect(() => {
    const updateData = async () => {
      try {
        const newData = await (getPortfolioData as any)({
          data: { language: i18n.language },
        })
        setData(newData)
      } catch (error) {
        console.error('Failed to update portfolio data:', error)
      }
    }
    updateData()
  }, [i18n.language])

  // Background is controlled via CSS variable on :root (see styles.css)

  const [openWindows, setOpenWindows] = useState<Array<OpenWindowState>>(
    apps.map((app) => ({
      id: app.id,
      isOpen: false,
      isMinimized: false,
      position: app.defaultPosition || { x: 100, y: 100 },
    })),
  )

  // Note: Wallpaper changes are handled by WallpaperSelector by updating
  // the `.canvas-background` element and localStorage.

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
      const win = prev.find((w) => w.id === appId)
      if (!win) return prev

      // Pencere açık ve görünürse → minimize et
      if (win.isOpen && !win.isMinimized) {
        return prev.map((w) => w.id === appId ? { ...w, isMinimized: true } : w)
      }

      // Kapalıysa → rastgele pozisyonda aç
      let newPosition = win.position
      if (!win.isOpen) {
        const app = apps.find((a) => a.id === appId)
        const winW = app?.defaultSize?.width ?? 900
        const winH = app?.defaultSize?.height ?? 550
        const topBar = 36
        const dock = 90
        const margin = 30
        const vw = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1440
        const vh = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 900
        const maxX = Math.max(margin, vw - winW - margin)
        const maxY = Math.max(topBar + margin, vh - winH - dock - margin)
        newPosition = {
          x: Math.floor(Math.random() * (maxX - margin) + margin),
          y: Math.floor(Math.random() * (maxY - topBar - margin) + topBar + margin),
        }
      }

      const updatedWindows = prev.map((w) =>
        w.id === appId ? { ...w, isOpen: true, isMinimized: false, position: newPosition } : w,
      )
      const windowToMove = updatedWindows.find((w) => w.id === appId)!
      const otherWindows = updatedWindows.filter((w) => w.id !== appId)
      return [...otherWindows, windowToMove]
    })
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
      icon: GithubIcon,
      action: () => {
        setWarningDialog({
          isOpen: true,
          title: t('links.warningTitle'),
          message: t('links.externalWarning'),
          url: 'https://github.com/Sselimkoc',
        })
      },
    },
    {
      id: 'linkedin',
      titleKey: 'apps.linkedin.title',
      icon: LinkedinIcon,
      action: () => {
        setWarningDialog({
          isOpen: true,
          title: t('links.warningTitle'),
          message: t('links.externalWarning'),
          url: 'https://www.linkedin.com/in/sselimkoc462/',
        })
      },
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
    // {
    //   id: 'puzzle',
    //   title: 'apps.puzzle.title',
    //   icon: apps.find((a) => a.id === 'puzzle')?.icon || MailQuestion,
    //   onOpen: handleOpenWindow,
    // },
  ]

  return (
    <motion.div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative flex flex-col bg-cover bg-center canvas-background"
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
                      onExternalLink={(url) => {
                        setWarningDialog({
                          isOpen: true,
                          title: t('links.warningTitle'),
                          message: t('links.externalWarning'),
                          url,
                        })
                      }}
                    />
                  )}
                  {app.id === 'skills' && (
                    <SkillsPalette groups={data.skills} />
                  )}
                  {app.id === 'projects' && (
                    <ProjectsGallery
                      projects={data.projects}
                      onExternalLink={(url) => {
                        setWarningDialog({
                          isOpen: true,
                          title: t('links.warningTitle'),
                          message: t('links.externalWarning'),
                          url,
                        })
                      }}
                    />
                  )}
                  {app.id === 'experience' && (
                    <ExperienceTimeline items={data.experience} />
                  )}
                  {app.id === 'wallpaper' && <WallpaperSelector />}
                  {/* {app.id === 'puzzle' && <SlidingPuzzle />} */}
                  {app.id === 'contact' && <ContactForm />}
                  {![
                    'about',
                    'skills',
                    'projects',
                    'experience',
                    'wallpaper',
                    // 'puzzle',
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

      {/* Warning Dialog */}
      <WarningDialog
        isOpen={warningDialog.isOpen}
        title={warningDialog.title}
        message={warningDialog.message}
        url={warningDialog.url}
        onConfirm={() => {
          window.open(warningDialog.url, '_blank')
          setWarningDialog({ isOpen: false, title: '', message: '', url: '' })
        }}
        onCancel={() => {
          setWarningDialog({ isOpen: false, title: '', message: '', url: '' })
        }}
      />
    </motion.div>
  )
}
