import { Briefcase, Clock, Code2, FileText, Image, Puzzle } from 'lucide-react'
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
    defaultSize: { width: 550, height: 500 },
    defaultPosition: { x: 120, y: 80 },
  },
  {
    id: 'projects',
    title: 'apps.projects.title',
    content: 'apps.projects.content',
    icon: Briefcase,
    defaultSize: { width: 700, height: 550 },
    defaultPosition: { x: 250, y: 100 },
  },
  {
    id: 'skills',
    title: 'apps.skills.title',
    content: 'apps.skills.content',
    icon: Code2,
    defaultSize: { width: 650, height: 520 },
    defaultPosition: { x: 80, y: 150 },
  },
  {
    id: 'experience',
    title: 'apps.experience.title',
    content: 'apps.experience.content',
    icon: Clock,
    defaultSize: { width: 600, height: 550 },
    defaultPosition: { x: 200, y: 120 },
  },
  {
    id: 'wallpaper',
    title: 'apps.wallpaper.title',
    content: 'apps.wallpaper.content',
    icon: Image,
    defaultSize: { width: 600, height: 600 },
    defaultPosition: { x: 150, y: 100 },
  },
  {
    id: 'puzzle',
    title: 'apps.puzzle.title',
    content: 'apps.puzzle.content',
    icon: Puzzle,
    defaultSize: { width: 550, height: 600 },
    defaultPosition: { x: 350, y: 80 },
  },
]
