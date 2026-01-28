import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Project = {
  name: string
  description: string
  tech: Array<string>
  href?: string
}

interface ProjectsGalleryProps {
  projects: Array<Project>
  onExternalLink?: (url: string) => void
}

export default function ProjectsGallery({
  projects,
  onExternalLink,
}: ProjectsGalleryProps) {
  const { t } = useTranslation()
  const reversedProjects = [...projects].reverse()
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    reversedProjects[0] || null,
  )

  return (
    <div className="h-full w-full overflow-hidden flex">
      {/* Timeline - Left Side */}
      <div className="w-72 border-r border-white/10 overflow-y-auto">
        <div className="p-4 space-y-2">
          {reversedProjects.map((project, index) => (
            <button
              key={project.name}
              onClick={() => setSelectedProject(project)}
              className={`
                  w-full text-left py-3 px-3 rounded-lg transition-all duration-200
                  ${
                    selectedProject?.name === project.name
                      ? 'bg-white/12 border border-white/20 text-white'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/6'
                  }
                `}
            >
              {/* Timeline indicator */}
              <div className="flex items-start gap-2">
                <div className="relative pt-1">
                  <div
                    className={`
                        w-2.5 h-2.5 rounded-full transition-all
                        ${
                          selectedProject?.name === project.name
                            ? 'bg-white ring-2 ring-white/30'
                            : 'bg-white/30'
                        }
                      `}
                  />
                  {index < reversedProjects.length - 1 && (
                    <div className="absolute top-2.5 left-1 w-0.5 h-10 bg-linear-to-b from-white/20 to-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs truncate">
                    {project.name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details - Right Side */}
      <div className="flex-1 overflow-y-auto">
        {selectedProject ? (
          <div className="p-7 pb-12 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h3
                className="text-2xl font-bold text-white"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {selectedProject.name}
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4
                className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {t('projects.description')}
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <h4
                className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {t('projects.technologies')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs text-white/70 border border-white/15 bg-white/8 rounded-lg px-3 py-1.5 hover:bg-white/12 transition cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Link */}
            {selectedProject.href && (
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    if (onExternalLink) {
                      onExternalLink(selectedProject.href!)
                    } else {
                      window.open(selectedProject.href, '_blank')
                    }
                  }}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink size={18} />
                  <span className="text-sm font-medium">
                    {t('projects.viewProject')}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40 text-sm">
              {t('projects.selectProject')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
