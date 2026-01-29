import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

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
    <div className="h-full w-full overflow-hidden flex">
      {/* Categories - Left Side */}
      <div className="w-64 border-r border-white/10 overflow-y-auto">
        <div className="p-4 space-y-2">
          {groups.map((group) => (
            <button
              key={group.title}
              onClick={() => setSelectedGroup(group)}
              className={`
                w-full text-left py-3 px-4 rounded-lg transition-all duration-200
                ${
                  selectedGroup?.title === group.title
                    ? 'bg-white/12 border border-white/20 text-white'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/6'
                }
              `}
            >
              <p className="font-semibold text-sm">{group.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid - Right Side */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedGroup ? (
            <motion.div
              key={selectedGroup.title}
              initial={{ opacity: 0, x: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-6 pb-12"
            >
              <div className="flex flex-wrap gap-3">
                {selectedGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-[13px] text-white/70 border border-white/15 bg-white/8 rounded-xl px-4 py-3 hover:bg-white/12 transition cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
