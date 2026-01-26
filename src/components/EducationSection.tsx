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
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-white/45 uppercase tracking-widest">
        {t('profile.educationTitle')}
      </h3>

      <div className="space-y-1 pl-0.5">
        <p className="text-white/90 text-sm font-semibold">
          {education.school}
        </p>

        <p className="text-white/60 text-sm leading-relaxed">
          {education.department}
          {education.years && (
            <span className="text-white/50"> · {education.years}</span>
          )}
        </p>

        {education.gpa && (
          <p className="text-white/50 text-xs pt-1">
            <span className="font-medium">GPA:</span> {education.gpa}
          </p>
        )}
      </div>

      <div className="h-px bg-linear-to-r from-white/10 to-transparent mt-4" />
    </div>
  )
}
