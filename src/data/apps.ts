import { Briefcase, Clock, Code2, FileText } from 'lucide-react'
import type React from 'react'

export interface App {
  id: string
  title: string 
  content: string 
  icon: React.ElementType
}

export const apps: Array<App> = [
  {
    id: 'about',
    title: 'apps.about.title',
    content: 'apps.about.content',
    icon: FileText,
  },
  {
    id: 'projects',
    title: 'apps.projects.title',
    content: 'apps.projects.content',
    icon: Briefcase,
  },
  {
    id: 'skills',
    title: 'apps.skills.title',
    content: 'apps.skills.content',
    icon: Code2,
  },
  {
    id: 'experience',
    title: 'apps.experience.title',
    content: 'apps.experience.content',
    icon: Clock,
  },
]
