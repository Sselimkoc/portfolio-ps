import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Github, Linkedin } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] as any },
  },
}

export default function MobileGate() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="lg:hidden fixed inset-0 z-9999 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background — matches IntroOverlay */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-400/35 via-purple-500/25 to-purple-600/40 backdrop-blur-[20px]"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Language Toggle */}
        <motion.button
          onClick={toggleLanguage}
          className="fixed top-6 right-6 z-20 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {i18n.language === 'tr' ? (
            <img src="/türkiye.svg" alt="TR" className="w-5 h-5 object-contain" />
          ) : (
            <img src="/gb.svg" alt="EN" className="w-5 h-5 object-contain" />
          )}
          <span className="uppercase">{i18n.language.toUpperCase()}</span>
        </motion.button>

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-sm px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Avatar */}
          <motion.div
            className="mx-auto mb-8 w-36 h-36 rounded-full ring-2 ring-white/20 overflow-hidden"
            variants={itemVariants}
          >
            <img
              src="/skpp.jpeg"
              alt={t('hero.subtitleName')}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="font-heading text-4xl font-bold text-white tracking-tight leading-tight"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6)' }}
            variants={itemVariants}
          >
            {t('hero.subtitleName')}
          </motion.h1>

          {/* Role badge */}
          <motion.div className="mt-6 flex justify-center" variants={itemVariants}>
            <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-medium text-zinc-200 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              {t('hero.subtitle')}
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="my-8 mx-auto w-10 h-px bg-white/20"
            variants={itemVariants}
          />

          {/* Social links */}
          <motion.div className="flex justify-center gap-3" variants={itemVariants}>
            <a
              href="https://github.com/Sselimkoc"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-sm font-medium hover:bg-white/15 hover:text-white transition-all duration-200 backdrop-blur-xl"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sselimkoc462/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/12 text-white/70 text-sm font-medium hover:bg-white/15 hover:text-white transition-all duration-200 backdrop-blur-xl"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          </motion.div>

          {/* Desktop notice */}
          <motion.p
            className="mt-6 text-white/40 text-xs leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            variants={itemVariants}
          >
            {t('hero.desktopNotice')}
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
