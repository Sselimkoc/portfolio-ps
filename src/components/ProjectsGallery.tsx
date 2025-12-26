import { ExternalLink } from 'lucide-react'

type Project = {
  name: string
  tagline: string
  description: string
  tech: Array<string>
  href?: string
}

export default function ProjectsGallery({
  projects,
}: {
  projects: Array<Project>
}) {
  return (
    <div className="h-full w-full overflow-auto p-5">
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">Projects</h2>
        <p className="text-white/55 text-sm mt-1">
          Selected work and experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.name}
            className="group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* top strip (visual identity, no image needed) */}
            <div className="h-20 bg-linear-to-b from-white/10 to-transparent" />

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  <p className="text-white/55 text-xs mt-1">{p.tagline}</p>
                </div>

                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
                    aria-label="Open project"
                  >
                    <ExternalLink size={16} className="text-white/70" />
                  </a>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="text-xs text-white/70 border border-white/10 bg-white/5 rounded-full px-2 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* hover reveal */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-white text-sm font-semibold">{p.name}</p>
                <p className="mt-1 text-white/80 text-sm leading-relaxed">
                  {p.description}
                </p>
                <p className="mt-3 text-white/60 text-xs">
                  Hover to preview • Click the icon to open
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
