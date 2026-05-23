import { useTranslation } from 'react-i18next'

interface BioSectionProps {
  bio: string
}

export default function BioSection({ bio }: BioSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em]">
          {t('profile.aboutTitle')}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Bio text */}
      <p
        className="text-white/80 text-sm leading-[1.75] pl-0.5"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
      >
        {bio}
      </p>
    </div>
  )
}
