import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLoaderData } from '@tanstack/react-router'
import { Github, Linkedin, MailQuestion } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { apps } from '../data/apps'
import { getPortfolioData } from './queries'
import DraggableWindow from './DraggableWindow'
import DockHint from './DockHint'
import MinimizedWindowsIndicator from './MinimizedWindowsIndicator'
import Dock from './Dock'
import IntroOverlay from './IntroOverlay'
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

const getInitialIntroState = () => {
  const seen =
    typeof window !== 'undefined' && localStorage.getItem(INTRO_KEY) === '1'
  return !seen
}

export default function CanvasArea() {
  const { t, i18n } = useTranslation()
  const initialData = useLoaderData({ from: '/' }) as any
  const [data, setData] = useState(initialData)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [showDockHint, setShowDockHint] = useState(false)
  const [showIntro, setShowIntro] = useState(getInitialIntroState())

  const [openWindows, setOpenWindows] = useState<Array<OpenWindowState>>(
    apps.map((app, index) => ({
      id: app.id,
      isOpen: false,
      isMinimized: false,
      position: { x: 100 + index * 50, y: 100 + index * 50 },
    })),
  )
  const [isPoweredOn, setIsPoweredOn] = useState(true)

  const skipIntro = () => {
    localStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
    setShowDockHint(true)
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
      const windowExists = prev.some((w) => w.id === appId)
      if (!windowExists) return prev

      const updatedWindows = prev.map((w) =>
        w.id === appId ? { ...w, isOpen: true, isMinimized: false } : w,
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
      style={{ backgroundImage: 'url(/desktop-bg.jpg)' }}
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
        <TopBar onPowerOff={() => setIsPoweredOn(false)} />

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

        <MinimizedWindowsIndicator
          openWindows={openWindows}
          onRestoreWindow={handleRestoreWindow}
        />

        <AnimatePresence>
          {showDockHint && !showIntro && <DockHint />}
        </AnimatePresence>

        {/* Dock */}
        <Dock dockApps={dockApps} onDockAction={handleDockAction} />
      </div>

      {/* Intro Overlay */}
      <IntroOverlay showIntro={showIntro} onSkipIntro={skipIntro} />
    </motion.div>
  )
}
