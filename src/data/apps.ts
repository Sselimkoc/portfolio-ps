import { Binary, BookOpen, Briefcase, FolderGit2, Image, Mail, Puzzle, User } from 'lucide-react'
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
    icon: User,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 210, y: 60 },
  },
  {
    id: 'projects',
    title: 'apps.projects.title',
    content: 'apps.projects.content',
    icon: FolderGit2,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 290, y: 110 },
  },
  {
    id: 'skills',
    title: 'apps.skills.title',
    content: 'apps.skills.content',
    icon: Binary,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 370, y: 160 },
  },
  {
    id: 'experience',
    title: 'apps.experience.title',
    content: 'apps.experience.content',
    icon: Briefcase,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 450, y: 210 },
  },
  {
    id: 'contact',
    title: 'apps.contact.title',
    content: 'apps.contact.content',
    icon: Mail,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 530, y: 260 },
  },
  {
    id: 'wallpaper',
    title: 'apps.wallpaper.title',
    content: 'apps.wallpaper.content',
    icon: Image,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 400, y: 120 },
  },
  {
    id: 'blog',
    title: 'apps.blog.title',
    content: 'apps.blog.content',
    icon: BookOpen,
    defaultSize: { width: 900, height: 550 },
    defaultPosition: { x: 360, y: 140 },
  },
]
