import { LucideGithub, LucideLinkedin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProfileHeaderProps {
  name: string
  roleLine: string
  location?: string
  githubUrl: string
  linkedinUrl: string
  onExternalLink?: (url: string) => void
}

export default function ProfileHeader({
  name,
  roleLine,
  location,
  githubUrl,
  linkedinUrl,
  onExternalLink,
}: ProfileHeaderProps) {
  const { t } = useTranslation()
  const displayLocation = location || t('admin.profile.defaultLocation')

  const links = [
    { href: githubUrl, icon: LucideGithub, label: 'GitHub' },
    { href: linkedinUrl, icon: LucideLinkedin, label: 'LinkedIn' },
  ]

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1
          className="text-4xl font-bold text-white tracking-tight"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        >
          {name}
        </h1>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-white/75 text-sm font-medium">{roleLine}</span>
          {displayLocation && (
            <>
              <span className="text-white/25 select-none">·</span>
              <span className="text-white/45 text-sm">{displayLocation}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {links.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            onClick={(e) => {
              if (onExternalLink) {
                e.preventDefault()
                onExternalLink(href)
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white/60 transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-white/10 cursor-pointer"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  )
}
