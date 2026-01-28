import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Item = {
  role: string
  company: string
  period: string
  location?: string
  bullets: Array<string>
}

export default function ExperienceTimeline({ items }: { items: Array<Item> }) {
  const { t } = useTranslation()
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    items[0] || null,
  )

  return (
    <div className="h-full w-full overflow-hidden flex">
      {/* Timeline - Left Side */}
      <div className="w-72 border-r border-white/10 overflow-y-auto">
        <div className="p-4 space-y-2">
          {items.map((item, index) => (
            <button
              key={`${item.company}-${index}`}
              onClick={() => setSelectedItem(item)}
              className={`
                w-full text-left py-3 px-3 rounded-lg transition-all duration-200
                ${
                  selectedItem === item
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
                        selectedItem === item
                          ? 'bg-white ring-2 ring-white/30'
                          : 'bg-white/30'
                      }
                    `}
                  />
                  {index < items.length - 1 && (
                    <div className="absolute top-2.5 left-1 w-0.5 h-10 bg-gradient-to-b from-white/20 to-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs truncate">{item.role}</p>
                  <p className="text-xs text-white/50 mt-1 truncate">
                    {item.company}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{item.period}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details - Right Side */}
      <div className="flex-1 overflow-y-auto">
        {selectedItem ? (
          <div className="p-7 pb-12 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h3
                className="text-2xl font-bold text-white"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {selectedItem.role}
              </h3>
              <p
                className="text-white/60"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {selectedItem.company}
              </p>
            </div>

            {/* Period & Location */}
            <div className="space-y-2">
              <h4
                className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {t('experience.details')}
              </h4>
              <p className="text-white/70 text-sm">
                {selectedItem.period}
                {selectedItem.location && (
                  <span className="text-white/50">
                    {' '}
                    · {selectedItem.location}
                  </span>
                )}
              </p>
            </div>

            {/* Bullets */}
            <div className="space-y-2">
              <h4
                className="text-xs font-semibold text-white/45 uppercase tracking-widest"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                {t('experience.achievements')}
              </h4>
              <ul className="space-y-2">
                {selectedItem.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="text-white/70 text-sm leading-relaxed"
                  >
                    <span className="text-white/40 mr-2">—</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40 text-sm">
              {t('experience.selectItem')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
