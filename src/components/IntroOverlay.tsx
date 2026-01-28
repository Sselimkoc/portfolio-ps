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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          {/* Arka Plan: Daha derin bir degrade ve blur */}
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black/80 to-black backdrop-blur-[20px]"
            onMouseDown={onSkipIntro}
          />

          <motion.div
            className="relative z-10 w-full max-w-4xl px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 1. Ana Başlık - Hiyerarşinin En Üstü */}
            <motion.h1
              className="text-5xl md:text-[84px] font-bold text-white leading-[1.1] tracking-[-0.04em]"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                textShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>

            {/* 2. İsim - İkinci Derece Önem */}
            <motion.p
              className="mt-6 text-xl md:text-3xl text-zinc-300 font-medium tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('hero.subtitleName')}
            </motion.p>

            {/* 3. Role Badge - Görsel Odak Noktası */}
            <motion.div
              className="mt-6 inline-flex"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm md:text-base font-medium text-zinc-200 shadow-2xl">
                {t('hero.subtitle')}
              </span>
            </motion.div>

            {/* 4. Açıklama - Destekleyici Metin */}
            <motion.p
              className="mt-10 max-w-2xl mx-auto text-base md:text-lg text-zinc-400 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {t('hero.description')}
            </motion.p>

            {/* 5. CTA & Etkileşim - Hiyerarşinin Altı */}
            <motion.div
              className="mt-16 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={onSkipIntro}
                className="group relative px-8 py-3 rounded-full bg-zinc-100 text-black font-semibold text-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              >
                {t('hero.clickToContinue')}
              </button>

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                <div className="flex gap-1.5">
                  <kbd className="min-w-[40px] px-1.5 py-1 rounded border border-zinc-800 bg-zinc-900/50 flex items-center justify-center font-sans">
                    Enter
                  </kbd>
                  <span className="text-zinc-700">/</span>
                  <kbd className="min-w-[40px] px-1.5 py-1 rounded border border-zinc-800 bg-zinc-900/50 flex items-center justify-center font-sans">
                    Esc
                  </kbd>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
