import { useTranslation } from 'react-i18next'
import ProfileHeader from './ProfileHeader'
import BioSection from './BioSection'
import EducationSection from './EducationSection'

interface AboutEducationProps {
  name: string
  roleLine: string
  location?: string
  bio: string
  email: string
  githubUrl: string
  linkedinUrl: string
  education: {
    school: string
    department: string
    years?: string
    gpa?: string
  }
}

export default function AboutEducation(props: AboutEducationProps) {
  const { t } = useTranslation()
  
  return (
    <div className="h-full w-full overflow-y-auto flex flex-col bg-linear-to-b from-transparent via-transparent to-white/8">
      {/* CV Header - Top Section */}
      <div className="bg-linear-to-b from-white/16 via-white/12 to-transparent sticky top-0 z-10">
        <div className="p-8 pb-6">
          <ProfileHeader {...props} />
        </div>
      </div>

      {/* CV Content - Main body */}
      <div className="flex-1 px-8 py-6 space-y-8">
        <BioSection bio={props.bio} />
        <EducationSection education={props.education} />
      </div>

      {/* CV Footer - Bottom Section */}
      <div className="bg-linear-to-t from-white/8 via-white/4 to-transparent">
        <div className="p-8 pt-6 text-center">
          <p className="text-white/30 text-xs font-light tracking-widest">
            — {t('profile.endProfile')} —
          </p>
        </div>
      </div>
    </div>
  )
}
