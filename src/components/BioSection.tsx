import { useTranslation } from 'react-i18next'

interface BioSectionProps {
  bio: string
}

export default function BioSection({ bio }: BioSectionProps) {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-white/45 uppercase tracking-widest">
        {t('profile.aboutTitle')}
      </h3>
      <p className="text-white/70 text-sm leading-relaxed font-light pl-0.5">
        {bio}
      </p>
      <div className="h-px bg-linear-to-r from-white/10 to-transparent mt-4" />
    </div>
  )
}
