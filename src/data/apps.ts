import { Briefcase, Clock, Code2, FileText, Image, Mail, Puzzle } from 'lucide-react'
import type React from 'react'

export interface App {
  id: string
  title: string 
  content: string 
  icon: React.ElementType
  defaultSize?: { width: number; height: number }
  defaultPosition?: { x: number; y: number }
}

export const apps: Array<App> = [
  {
    id: 'about',
    title: 'apps.about.title',
    content: 'apps.about.content',
    icon: FileText,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 80, y: 60 },
  },
  {
    id: 'projects',
    title: 'apps.projects.title',
    content: 'apps.projects.content',
    icon: Briefcase,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 150, y: 80 },
  },
  {
    id: 'skills',
    title: 'apps.skills.title',
    content: 'apps.skills.content',
    icon: Code2,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 80, y: 150 },
  },
  {
    id: 'experience',
    title: 'apps.experience.title',
    content: 'apps.experience.content',
    icon: Clock,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 150, y: 100 },
  },
  {
    id: 'wallpaper',
    title: 'apps.wallpaper.title',
    content: 'apps.wallpaper.content',
    icon: Image,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 150, y: 100 },
  },
  {
    id: 'puzzle',
    title: 'apps.puzzle.title',
    content: 'apps.puzzle.content',
    icon: Puzzle,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 350, y: 80 },
  },
  {
    id: 'contact',
    title: 'apps.contact.title',
    content: 'apps.contact.content',
    icon: Mail,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 200, y: 100 },
  },
]
