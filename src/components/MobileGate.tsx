import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ExternalLink, GraduationCap, Mail, MapPin } from 'lucide-react'
import { getPortfolioData } from './queries'
import type { PortfolioData } from './queries'
import type { Variants } from 'framer-motion'

// Inline SVGs for brand icons (lucide-react deprecated Github/Linkedin)
function IconGithub({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function IconLinkedin({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white/8 animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

// ─── Tab: About ─────────────────────────────────────────────────────────────

function AboutTab({ data, loading }: { data: PortfolioData | null; loading: boolean }) {
  const profile = data?.profile

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-3 pt-2 pb-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Bio */}
      {profile?.bio && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-white/15 backdrop-blur-[28px] p-4 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          <p className="text-white/85 text-sm leading-relaxed">{profile.bio}</p>
        </motion.div>
      )}

      {/* Location */}
      {profile?.location && (
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 rounded-2xl border border-white/15 backdrop-blur-[28px] px-4 py-3 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <MapPin size={15} className="text-white/70" />
          </div>
          <span className="text-white/80 text-sm font-medium">{profile.location}</span>
        </motion.div>
      )}

      {/* Education */}
      {profile?.school && (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-white/15 backdrop-blur-[28px] px-4 py-3 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap size={15} className="text-white/70" />
            </div>
            <div className="min-w-0">
              <p className="text-white/90 text-sm font-semibold leading-snug">{profile.school}</p>
              {profile.department && (
                <p className="text-white/55 text-xs mt-0.5">{profile.department}</p>
              )}
              {profile.years && (
                <p className="text-white/40 text-xs mt-0.5">{profile.years}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Email */}
      {profile?.email && (
        <motion.div variants={fadeUp}>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-3 rounded-2xl border border-white/15 backdrop-blur-[28px] px-4 py-3 shadow-lg cursor-pointer hover:border-white/25 transition-colors duration-200 active:scale-[0.98]"
            style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-white/70" />
            </div>
            <span className="text-white/80 text-sm font-medium truncate">{profile.email}</span>
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Tab: Skills ─────────────────────────────────────────────────────────────

function SkillsTab({ data, loading }: { data: PortfolioData | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  const groups = data?.skills ?? []

  return (
    <motion.div
      className="space-y-3 pt-2 pb-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {groups.map((group) => (
        <motion.div
          key={group.title}
          variants={fadeUp}
          className="rounded-2xl border border-white/15 backdrop-blur-[28px] p-4 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          {/* Group header */}
          <p className="text-white/55 text-[11px] font-bold uppercase tracking-[0.14em] mb-3">
            {group.title}
          </p>

          {/* Skill badges */}
          <div className="flex flex-wrap gap-2">
            {group.items.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/85 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Tab: Projects ────────────────────────────────────────────────────────────

function ProjectsTab({ data, loading }: { data: PortfolioData | null; loading: boolean }) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    )
  }

  const projects = [...(data?.projects ?? [])].reverse()

  return (
    <motion.div
      className="space-y-3 pt-2 pb-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={fadeUp}
          className="rounded-2xl border border-white/15 backdrop-blur-[28px] p-4 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="text-white/95 text-sm font-bold leading-snug">{project.name}</h3>
              {project.tagline && (
                <p className="text-white/50 text-xs mt-0.5 leading-snug">{project.tagline}</p>
              )}
            </div>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t('projects.viewProject')} – ${project.name}`}
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white/60 hover:text-white hover:bg-white/15 transition-colors duration-200 cursor-pointer active:scale-90"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {project.description && (
            <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-3">
              {project.description}
            </p>
          )}

          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Tab: Experience ──────────────────────────────────────────────────────────

function ExperienceTab({ data, loading }: { data: PortfolioData | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const experiences = data?.experience ?? []

  return (
    <motion.div
      className="space-y-3 pt-2 pb-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {experiences.map((exp) => (
        <motion.div
          key={exp.id}
          variants={fadeUp}
          className="rounded-2xl border border-white/15 backdrop-blur-[28px] p-4 shadow-lg"
          style={{ backgroundColor: 'rgba(18,18,20,0.50)' }}
        >
          <div className="flex items-start gap-3">
            {/* Timeline dot */}
            <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-white/40 ring-2 ring-white/15" />
            <div className="min-w-0 flex-1">
              <h3 className="text-white/95 text-sm font-bold leading-snug">{exp.role}</h3>
              <p className="text-white/60 text-xs font-medium mt-0.5">{exp.company}</p>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                <span className="text-white/40 text-[11px]">{exp.period}</span>
                {exp.location && (
                  <span className="text-white/40 text-[11px]">{exp.location}</span>
                )}
              </div>

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={12} className="flex-shrink-0 mt-0.5 text-white/30" />
                      <span className="text-white/60 text-xs leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = ['about', 'skills', 'projects', 'experience'] as const
type TabId = (typeof TABS)[number]

const TAB_KEYS: Record<TabId, string> = {
  about: 'apps.about.title',
  skills: 'apps.skills.title',
  projects: 'apps.projects.title',
  experience: 'apps.experience.title',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MobileGate() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabId>('about')
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const tabBarRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Per-tab scroll memory: remembers where you left off, starts at 0 on first visit
  const scrollPositions = useRef<Partial<Record<TabId, number>>>({})

  // Fetch portfolio data whenever language changes
  useEffect(() => {
    setLoading(true)
    getPortfolioData({ data: { language: i18n.language } })
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [i18n.language])

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')
  }

  const handleTabChange = (tab: TabId) => {
    // Save current scroll position before leaving
    if (scrollRef.current) {
      scrollPositions.current[activeTab] = scrollRef.current.scrollTop
    }
    setActiveTab(tab)
    // Restore saved position (or 0 for first visit) after paint
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollPositions.current[tab] ?? 0
      }
    })
  }

  const profile = data?.profile

  return (
    <div
      className="lg:hidden fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      role="main"
      aria-label="Mobile Portfolio"
    >
      {/* ── Wallpaper (same system as desktop) ── */}
      <div className="absolute inset-0 canvas-background" aria-hidden="true" />

      {/* ── Dark overlay for readability ── */}
      <div
        className="absolute inset-0 bg-black/55"
        style={{ backdropFilter: 'blur(2px)' }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════
          HEADER — language toggle
      ══════════════════════════════════════════ */}
      <motion.header
        className="relative z-10 flex items-center justify-end px-5 pt-12 pb-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 text-white text-sm font-semibold hover:bg-white/14 hover:border-white/22 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          {i18n.language === 'tr' ? (
            <img src="/türkiye.svg" alt="TR" className="w-4 h-4 object-contain" />
          ) : (
            <img src="/gb.svg" alt="EN" className="w-4 h-4 object-contain" />
          )}
          <span className="uppercase tracking-wide">{i18n.language.toUpperCase()}</span>
        </button>
      </motion.header>

      {/* ══════════════════════════════════════════
          HERO — avatar · name · role
      ══════════════════════════════════════════ */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 pt-4 pb-5"
        initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.2, 0.65, 0.3, 0.9] }}
      >
        {/* Avatar */}
        <div className="mb-3 w-20 h-20 rounded-full ring-2 ring-white/25 shadow-xl overflow-hidden">
          <img
            src="/skpp.jpeg"
            alt={t('hero.subtitleName')}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h1
          className="font-heading text-2xl font-bold text-white tracking-tight"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.7)' }}
        >
          {t('hero.subtitleName')}
        </h1>

        {/* Role */}
        <p className="mt-1 text-white/55 text-[13px] font-medium tracking-wide">
          {t('hero.subtitle')}
        </p>

        {/* Social row */}
        <div className="mt-3 flex items-center gap-2">
          <a
            href={profile?.githubUrl ?? 'https://github.com/Sselimkoc'}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/8 border border-white/12 text-white/70 text-xs font-medium hover:bg-white/14 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
          >
            <IconGithub size={14} />
            GitHub
          </a>
          <a
            href={profile?.linkedinUrl ?? 'https://www.linkedin.com/in/sselimkoc462/'}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/8 border border-white/12 text-white/70 text-xs font-medium hover:bg-white/14 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
          >
            <IconLinkedin size={14} />
            LinkedIn
          </a>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          TAB BAR
      ══════════════════════════════════════════ */}
      <motion.div
        ref={tabBarRef}
        className="relative z-10 flex border-b border-white/10 bg-black/20 backdrop-blur-md px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        role="tablist"
        aria-label="Portfolio sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => handleTabChange(tab)}
            className={`relative flex-1 py-3 text-[12px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/65'
            }`}
          >
            {t(TAB_KEYS[tab])}
            {/* Sliding indicator */}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════
          TAB CONTENT — scrollable
      ══════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'about' && <AboutTab data={data} loading={loading} />}
            {activeTab === 'skills' && <SkillsTab data={data} loading={loading} />}
            {activeTab === 'projects' && <ProjectsTab data={data} loading={loading} />}
            {activeTab === 'experience' && <ExperienceTab data={data} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════
          FOOTER — desktop notice
      ══════════════════════════════════════════ */}
      <motion.div
        className="relative z-10 flex items-center justify-center px-6 py-3 border-t border-white/8 bg-black/20 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <p className="text-white/30 text-[11px] text-center leading-relaxed">
          {t('hero.desktopNotice')}
        </p>
      </motion.div>
    </div>
  )
}
