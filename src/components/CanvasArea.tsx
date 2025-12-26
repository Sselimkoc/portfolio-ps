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
  const [showIntro, setShowIntro] = useState(true)
  const [isSleeping, setIsSleeping] = useState(false)

  const [openWindows, setOpenWindows] = useState<Array<OpenWindowState>>(
    apps.map((app, index) => ({
      id: app.id,
      isOpen: false,
      isMinimized: false,
      position: { x: 100 + index * 50, y: 100 + index * 50 },
    })),
  )
  // Set intro state after hydration to avoid mismatch
  useEffect(() => {
    const seen = localStorage.getItem(INTRO_KEY) === '1'
    setShowIntro(!seen)
  }, [])

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
    ...apps.map((app) => ({
      id: app.id,
      titleKey: app.title,
      icon: app.icon,
      action: handleOpenWindow,
    })),
    {
      id: 'contact',
      titleKey: 'apps.contact.title',
      icon: MailQuestion,
      action: () => alert(t('apps.contact.content')),
    },
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

  return (
    <motion.div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative flex flex-col bg-cover bg-center"
      style={{ backgroundImage: 'url(/desktop-bg2.jpg)' }}
    >
      {/* Desktop content */}
      <div
        className={
          showIntro
            ? 'opacity-0 pointer-events-none transition-opacity duration-200'
            : 'opacity-100 transition-opacity duration-300'
        }
      >
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
                  defaultSize={{ width: 550, height: 450 }}
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
                  {!['about', 'skills', 'projects', 'experience'].includes(
                    app.id,
                  ) && (
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
