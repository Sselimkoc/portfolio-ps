type Item = {
  role: string
  company: string
  period: string
  location?: string
  bullets: Array<string>
}

export default function ExperienceTimeline({ items }: { items: Array<Item> }) {
  return (
    <div className="h-full w-full overflow-auto p-5">
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">Experience</h2>
        <p className="text-white/55 text-sm mt-1">
          Roles, impact, and what I shipped.
        </p>
      </div>

      <div className="relative pl-6 space-y-6">
        <div className="absolute left-2.75 top-0 bottom-0 w-px bg-white/10" />

        {items.map((it, idx) => (
          <div key={idx} className="relative">
            <div className="absolute left-1.5 top-2 h-3 w-3 rounded-full bg-white/60" />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white text-sm font-semibold">
                    {it.role} · {it.company}
                  </p>
                  <p className="text-white/55 text-xs mt-1">
                    {it.period}
                    {it.location ? ` · ${it.location}` : ''}
                  </p>
                </div>

                <span className="text-white/55 text-xs rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {it.bullets.map((b, i) => (
                  <li key={i} className="text-white/80 text-sm leading-relaxed">
                    <span className="text-white/40 mr-2">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
