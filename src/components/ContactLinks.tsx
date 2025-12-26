import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import LinkRow from './LinkRow'

interface ContactLinksProps {
  email: string
  githubUrl: string
  linkedinUrl: string
  onCopy: (text: string) => Promise<void>
}

export default function ContactLinks({
  email,
  githubUrl,
  linkedinUrl,
  onCopy,
}: ContactLinksProps) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-white/60 text-xs">Contact</p>
      <div className="space-y-2">
        <LinkRow
          icon={Mail}
          label="Email"
          value={email}
          href={`mailto:${email}`}
          onCopy={() => onCopy(email)}
        />
        <LinkRow
          icon={Github}
          label="GitHub"
          value={githubUrl}
          href={githubUrl}
          onCopy={() => onCopy(githubUrl)}
        />
        <LinkRow
          icon={Linkedin}
          label="LinkedIn"
          value={linkedinUrl}
          href={linkedinUrl}
          onCopy={() => onCopy(linkedinUrl)}
        />
      </div>
    </div>
  )
}
