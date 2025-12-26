import React from 'react'

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
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white/60 text-xs">Education</p>
          <p className="mt-1 text-white/90 text-sm font-medium">
            {education.school}
          </p>
          <p className="mt-1 text-white/70 text-sm">
            {education.department}
            {education.years ? ` • ${education.years}` : ''}
          </p>
        </div>

        {education.gpa && (
          <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-white/50 text-xs">GPA</p>
            <p className="text-white/90 text-sm font-semibold">
              {education.gpa}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
