import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type SkillGroup = {
  title: string
  items: Array<string>
}

export default function SkillsPalette({
  groups,
}: {
  groups: Array<SkillGroup>
}) {
  const { t } = useTranslation()
  const [selectedGroup, setSelectedGroup] = useState<SkillGroup | null>(
    groups[0] || null,
  )

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-b from-white/16 via-white/12 to-transparent sticky top-0 z-10 px-6 py-5">
        <h2 className="text-white font-semibold text-2xl">{t('apps.skills.title')}</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Categories - Left Side */}
        <div className="w-72 border-r border-white/10 overflow-y-auto">
          <div className="p-4 space-y-2">
            {groups.map((group) => (
              <button
                key={group.title}
                onClick={() => setSelectedGroup(group)}
                className={`
                  w-full text-left py-3 px-3 rounded-lg transition-all duration-200
                  ${
                    selectedGroup?.title === group.title
                      ? 'bg-white/12 border border-white/20 text-white'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/6'
                  }
                `}
              >
                <p className="font-semibold text-sm">{group.title}</p>
                <p className="text-xs text-white/50 mt-1">{group.items.length} skill{group.items.length !== 1 ? 's' : ''}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Skills - Right Side */}
        <div className="flex-1 overflow-y-auto">
          {selectedGroup ? (
            <div className="p-7 space-y-6">
              {/* Skills Grid */}
              <div className="flex flex-wrap gap-2">
                  {selectedGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm text-white/70 border border-white/15 bg-white/8 rounded-lg px-3 py-1.5 hover:bg-white/12 hover:text-white/90 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-white/40 text-sm">{t('apps.skills.title')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-linear-to-t from-white/8 via-white/4 to-transparent border-t border-white/10">
        <div className="px-6 py-4 text-center">
          <p className="text-white/30 text-xs font-light tracking-widest">
            — {groups.length} categor{groups.length !== 1 ? 'ies' : 'y'} —
          </p>
        </div>
      </div>
    </div>
  )
}
