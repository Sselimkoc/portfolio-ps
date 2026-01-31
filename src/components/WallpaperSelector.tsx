import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

interface Wallpaper {
  id: string
  name: string
  url: string
  thumbnail: string
}

const WALLPAPERS: Array<Wallpaper> = [
  {
    id: 'default',
    name: 'wallpapers.abstractSwirls',
    url: '/desktop-bg2.jpg',
    thumbnail: '/desktop-bg2.jpg',
  },
  {
    id: 'desktop-bg',
    name: 'wallpapers.swirls',
    url: '/desktop-bg.jpg',
    thumbnail: '/desktop-bg.jpg',
  },
  {
    id: 'cat',
    name: 'wallpapers.railroadCat',
    url: '/railroad-cat.png',
    thumbnail: '/railroad-cat.png',
  },
  {
    id: 'windowsXp',
    name: 'wallpapers.windowsXp',
    url: '/windows-xp.jpg',
    thumbnail: '/windows-xp.jpg',
  },
  {
    id: 'trippy',
    name: 'wallpapers.cosmicPurple',
    url: '/trippy-purple.png',
    thumbnail: '/trippy-purple.png',
  },
  {
    id: 'dark',
    name: 'wallpapers.deepBlue',
    url: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    thumbnail: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  {
    id: 'purple',
    name: 'wallpapers.violetDream',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'forest',
    name: 'wallpapers.emeraldForest',
    url: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    thumbnail: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  },
]

const WALLPAPER_KEY = 'portfolio:wallpaper'

interface WallpaperSelectorProps {
  onApply?: (wallpaper: Wallpaper) => void
}

export default function WallpaperSelector({ onApply }: WallpaperSelectorProps) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string>(() =>
    typeof window === 'undefined'
      ? 'default'
      : localStorage.getItem(WALLPAPER_KEY) || 'default',
  )
  const [appliedId, setAppliedId] = useState<string>(selectedId)

  // Sync initial state from localStorage on client to avoid SSR access
  useEffect(() => {
    try {
      const current = localStorage.getItem(WALLPAPER_KEY) || 'default'
      setSelectedId(current)
      setAppliedId(current)
    } catch {}
  }, [])

  const handleApply = (wallpaper: Wallpaper) => {
    setAppliedId(wallpaper.id)
    localStorage.setItem(WALLPAPER_KEY, wallpaper.id)

    const isGradient = wallpaper.url.startsWith('linear-gradient(')
    const applyCssVar = (val: string) =>
      document.documentElement.style.setProperty('--wallpaper-image', val)

    if (isGradient) {
      applyCssVar(wallpaper.url)
      onApply?.(wallpaper)
      return
    }

    // Preload the image before switching the background to avoid flash
    const img = new Image()
    img.loading = 'eager'
    img.onload = () => {
      applyCssVar(`url(${wallpaper.url})`)
      onApply?.(wallpaper)
    }
    img.onerror = () => {
      console.warn(`Failed to load wallpaper: ${wallpaper.url}`)
      // Fallback to apply anyway in case of error
      applyCssVar(`url(${wallpaper.url})`)
      onApply?.(wallpaper)
    }
    img.src = wallpaper.url
  }

  return (
    <div className="w-full h-full flex flex-col bg-linear-to-b from-white/5 to-white/10 backdrop-blur-sm p-4">
      {/* Wallpaper Grid */}
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {WALLPAPERS.map((wallpaper) => (
            <motion.div key={wallpaper.id} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => {
                  setSelectedId(wallpaper.id)
                  handleApply(wallpaper)
                }}
                className="w-full group relative overflow-hidden rounded-lg cursor-pointer transition-all"
              >
                {/* Thumbnail */}
                <div
                  className={`w-full aspect-video rounded-lg ring-2 transition-all group-hover:ring-white/50 ${
                    appliedId === wallpaper.id
                      ? 'ring-white/60'
                      : 'ring-white/20'
                  }`}
                  style={{
                    ...(wallpaper.thumbnail.includes('gradient')
                      ? { background: wallpaper.thumbnail }
                      : {
                          backgroundImage: `url(${wallpaper.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }),
                  }}
                >
                  {/* Check mark indicator */}
                  {appliedId === wallpaper.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40"
                    >
                      <motion.div
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Check
                          size={24}
                          className="text-black"
                          strokeWidth={3}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Name */}
                <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors mt-2">
                  {t(wallpaper.name)}
                </p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
