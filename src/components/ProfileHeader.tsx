import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'

interface ProfileHeaderProps {
  name: string
  roleLine: string
  location?: string
  githubUrl: string
  linkedinUrl: string
  email: string
}

export default function ProfileHeader({
  name,
  roleLine,
  location = 'Türkiye',
  githubUrl,
  linkedinUrl,
  email,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold text-white">{name}</h2>
        <p className="mt-1 text-white/70 text-sm">{roleLine}</p>
        <p className="mt-1 text-white/45 text-xs">{location}</p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
          aria-label="GitHub"
        >
          <Github size={18} className="text-white/70" />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} className="text-white/70" />
        </a>
        <a
          href={`mailto:${email}`}
          className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
          aria-label="Email"
        >
          <Mail size={18} className="text-white/70" />
        </a>
      </div>
    </div>
  )
}
