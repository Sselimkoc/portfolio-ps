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
  return (
    <div className="h-full w-full overflow-y-auto flex flex-col">
      {/* CV Header - Top Section */}
      <div className="bg-linear-to-b from-white/10 via-white/5 to-transparent sticky top-0 z-10">
        <div className="p-8 pb-6">
          <ProfileHeader {...props} />
        </div>
      </div>

      {/* CV Content - Main body */}
      <div className="flex-1 px-8 py-6 pb-12 space-y-8">
        <BioSection bio={props.bio} />
        <EducationSection education={props.education} />
      </div>
    </div>
  )
}
