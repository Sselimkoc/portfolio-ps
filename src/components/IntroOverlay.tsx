import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface IntroOverlayProps {
  showIntro: boolean
  onSkipIntro: () => void
}

export default function IntroOverlay({
  showIntro,
  onSkipIntro,
}: IntroOverlayProps) {
  const { t } = useTranslation()

  // Keyboard close (Enter / Esc)
  useEffect(() => {
    if (!showIntro) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        onSkipIntro()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showIntro, onSkipIntro])

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          onMouseDown={onSkipIntro}
          role="button"
          aria-label="Skip intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* Stronger, clearer backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" />

          <motion.div
            className="relative text-center px-6"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <h1
              className="text-6xl md:text-7xl font-black text-white tracking-tight"
              style={{
                textShadow:
                  '0 18px 55px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.35)',
              }}
            >
              {t('hero.title')}
            </h1>

            {/* subtitle highlight pill */}
            <div className="mt-5 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">
              <p
                className="text-base md:text-lg text-white/95 font-semibold"
                style={{ textShadow: '0 10px 26px rgba(0,0,0,0.65)' }}
              >
                {t('hero.subtitle')}
              </p>
            </div>

            <p
              className="mt-4 text-base md:text-lg text-white/85 max-w-2xl mx-auto"
              style={{ textShadow: '0 8px 22px rgba(0,0,0,0.55)' }}
            >
              {t('hero.description')}
            </p>

            {/* clear CTA */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <span className="text-white/80 text-sm font-medium">
                {t('hero.clickToContinue')}
              </span>
              <span className="text-white/40 text-sm">•</span>
              <span className="text-white/60 text-sm">Enter / Esc</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
