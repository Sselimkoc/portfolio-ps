import React from 'react'
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

export default function AboutEducation({
  name,
  roleLine,
  location,
  bio,
  email,
  githubUrl,
  linkedinUrl,
  education,
}: AboutEducationProps) {
  return (
    <div className="h-full w-full overflow-auto p-5">
      <ProfileHeader
        name={name}
        roleLine={roleLine}
        location={location}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        email={email}
      />
      <BioSection bio={bio} />
      <EducationSection education={education} />
    </div>
  )
}
