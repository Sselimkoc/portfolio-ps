import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

type SkillGroup = {
  title: string
  items: Array<string>
}

export default function SkillsPalette({
  groups,
}: {
  groups: Array<SkillGroup>
}) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return groups
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((x) => x.toLowerCase().includes(query)),
      }))
      .filter((g) => g.items.length > 0)
  }, [q, groups])

  return (
    <div className="h-full w-full overflow-auto p-5">
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">Skills</h2>
        <p className="text-white/55 text-sm mt-1">
          Search and scan by category.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-2">
        <Search size={16} className="text-white/55" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (e.g., Next.js, PostgreSQL, JWT)"
          className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/35"
        />
      </div>

      <div className="mt-4 space-y-5">
        {filtered.map((g) => (
          <div key={g.title}>
            <p className="text-white/50 text-xs mb-2">{g.title}</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {g.items.map((s, idx) => (
                <div
                  key={s}
                  className={[
                    'px-4 py-3 text-sm text-white/80',
                    idx !== g.items.length - 1
                      ? 'border-b border-white/10'
                      : '',
                  ].join(' ')}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-white/60 text-sm">No matches for “{q}”.</div>
        )}
      </div>
    </div>
  )
}
