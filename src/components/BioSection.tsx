import React from 'react'

interface BioSectionProps {
  bio: string
}

export default function BioSection({ bio }: BioSectionProps) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-white/80 text-sm leading-relaxed">{bio}</p>
    </div>
  )
}
