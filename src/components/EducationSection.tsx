import { GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Education {
  school: string
  department: string
  years?: string
  gpa?: string
}

interface EducationSectionProps {
  education: Education
}

export default function EducationSection({ education }: EducationSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em]">
          {t('profile.educationTitle')}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Education card */}
      <div className="flex items-start gap-3 pl-0.5">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
          <GraduationCap size={15} className="text-white/50" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <p className="text-white/90 text-sm font-semibold leading-snug">
            {education.school}
          </p>
          <p className="text-white/55 text-sm leading-snug">
            {education.department}
          </p>
          <div className="flex items-center gap-3 pt-0.5">
            {education.years && (
              <span className="text-white/35 text-xs">{education.years}</span>
            )}
            {education.years && education.gpa && (
              <span className="text-white/20 text-xs select-none">·</span>
            )}
            {education.gpa && (
              <span className="text-white/35 text-xs">
                GPA&thinsp;{education.gpa}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
