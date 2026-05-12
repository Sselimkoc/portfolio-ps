import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IntroOverlayProps {
  showIntro: boolean
  onSkipIntro: () => void
}

export default function IntroOverlay({
  showIntro,
  onSkipIntro,
}: IntroOverlayProps) {
  const { t, i18n } = useTranslation()
  const [showNotice, setShowNotice] = useState(true)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en'
    i18n.changeLanguage(newLang)
  }

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

  useEffect(() => {
    if (!showIntro) return
    const timer = setTimeout(() => {
      setShowNotice(false)
    }, 5000) // 5 saniye sonra kaldır
    return () => clearTimeout(timer)
  }, [showIntro])

  // 1. Kapsayıcı Variant: İçindekileri sırayla tetikler (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Her eleman bir öncekinden 0.15sn sonra gelir
        delayChildren: 0.2, // Başlamadan önce kısa bir bekleme
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      transition: {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1] as any, // "Ease-out-sine" benzeri yumuşak çıkış
      },
    },
  }

  // 2. Eleman Variant: Blur ve Y ekseni ile yumuşak giriş
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(12px)', // Bulanık başlar
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)', // Netleşir
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9] as any, // Özel "Lüks" hissi veren bezier eğrisi
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {showIntro && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          suppressHydrationWarning
        >
          {/* Arka Plan: Hafif scale efekti ile nefes alma hissi */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-400/35 via-purple-500/25 to-purple-600/40 backdrop-blur-[20px]"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            onMouseDown={onSkipIntro}
          />

          {/* Language Toggle Button - Top Right */}
          <motion.button
            onClick={toggleLanguage}
            className="fixed top-6 right-6 z-20 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.4,
              ease: [0.2, 0.65, 0.3, 0.9] as any,
            }}
            whileHover={{ y: -2 }}
            style={
              {
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              } as React.CSSProperties
            }
          >
            {i18n.language === 'tr' ? (
              <img
                src="/türkiye.svg"
                alt="TR"
                className="w-5 h-5 object-contain"
              />
            ) : (
              <img src="/gb.svg" alt="EN" className="w-5 h-5 object-contain" />
            )}
            <span className="uppercase">{i18n.language.toUpperCase()}</span>
          </motion.button>

          <motion.div
            className="relative z-10 w-full max-w-4xl px-6 text-center"
            variants={containerVariants} // Kapsayıcı variantı bağladık
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 1. Ana Başlık */}
            <motion.h1
              className="text-[84px] font-bold text-white leading-[1.1] tracking-[-0.04em] font-heading"
              style={
                {
                  textShadow:
                    '0 2px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 0, 0, 0.6)',
                } as React.CSSProperties
              }
              variants={itemVariants} // Alt variant
            >
              {t('hero.title')}
            </motion.h1>

            {/* 2. İsim */}
            <motion.p
              className="mt-6 text-3xl text-white/90 font-medium tracking-tight font-heading"
              style={
                {
                  textShadow: '0 2px 30px rgba(0, 0, 0, 0.7)',
                } as React.CSSProperties
              }
              variants={itemVariants}
            >
              {t('hero.subtitleName')}
            </motion.p>

            {/* 3. Role Badge */}
            <motion.div className="mt-8 flex flex-col items-center gap-4" variants={itemVariants}>
              <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm md:text-base font-medium text-zinc-200 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                {t('hero.subtitle')}
              </span>
              <p className="text-white/40 text-xs tracking-wider uppercase font-medium">
                {t('hero.underConstruction')}
              </p>
            </motion.div>

            {/* 4. Açıklama (Yorum satırındaydı, variant ile uyumlu bıraktım) */}
            {/* <motion.p
              className="mt-10 max-w-2xl mx-auto text-base md:text-lg text-zinc-300 leading-relaxed font-normal"
              variants={itemVariants}
            >
              {t('hero.description')}
            </motion.p> 
            */}

            {/* 5. CTA Button */}
            <motion.div
              className="mt-16 flex flex-col items-center gap-6"
              variants={itemVariants}
            >
              <button
                onClick={onSkipIntro}
                className="group relative px-10 py-4 rounded-full bg-white text-black font-semibold text-base overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
              >
                <span className="relative z-10">
                  {t('hero.clickToContinue')}
                </span>
                {/* Buton içi parlama efekti */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </button>
            </motion.div>
          </motion.div>

          {/* Desktop Notice - Top Center "Dynamic Island" Style */}
          <AnimatePresence>
            {showNotice && (
              <motion.div
                className="fixed top-8 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-black/40 backdrop-blur-2xl border border-white/15 shadow-2xl"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="text-xs text-white/90 font-medium tracking-tight">
                  {t('hero.desktopNotice')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
