import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FileText,
  Briefcase,
  Code2,
  Clock,
  Github,
  Linkedin,
  Mail,
  Github as GithubIcon,
} from 'lucide-react'

export default function CanvasArea() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const cards = [
    {
      id: 1,
      title: 'About Me',
      icon: FileText,
      color: 'from-blue-400 to-blue-600',
      description: 'Learn more about me and my journey.',
    },
    {
      id: 2,
      title: 'My Projects',
      icon: Briefcase,
      color: 'from-green-400 to-green-600',
      description: 'Check out some of my latest work.',
    },
    {
      id: 3,
      title: 'My Skills',
      icon: Code2,
      color: 'from-purple-400 to-purple-600',
      description: 'Discover the tools and technologies I use.',
    },
    {
      id: 4,
      title: 'Experience',
      icon: Clock,
      color: 'from-pink-400 to-pink-600',
      description: 'Explore my work history and background.',
    },
  ]

  const taskbarApps = [
    { name: 'About', icon: FileText, color: 'blue' },
    { name: 'Projects', icon: Briefcase, color: 'green' },
    { name: 'Skills', icon: Code2, color: 'purple' },
    { name: 'Experience', icon: Clock, color: 'pink' },
    { name: 'Contact', icon: Mail, color: 'orange' },
    { name: 'Github', icon: GithubIcon, color: 'gray' },
    { name: 'LinkedIn', icon: Linkedin, color: 'blue' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className="flex-1 overflow-hidden relative flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: 'url(/desktop-bg.jpg)',
      }}
    >
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight leading-tight"
            style={{
              textShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            animate={{
              textShadow: [
                '0 8px 32px rgba(0, 0, 0, 0.5)',
                '0 12px 40px rgba(59, 130, 246, 0.3)',
                '0 8px 32px rgba(0, 0, 0, 0.5)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Hi, I'm Selim
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-3 drop-shadow-lg font-semibold tracking-wide"
            style={{
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            animate={{
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0.3,
            }}
          >
            Full Stack Developer
          </motion.p>

          <motion.p
            className="text-lg text-white/75 drop-shadow-md mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Crafting seamless web experiences with modern technologies.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card glass-shadow p-6"
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 text-white mr-3" />
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                </div>
                <p className="text-white text-sm opacity-90">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Taskbar - Dock Style - macOS */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dock glass-shadow h-18 flex items-center justify-center px-4 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div className="flex gap-2 items-center">
          {taskbarApps.map((app, index) => {
            const Icon = app.icon
            return (
              <motion.div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredApp(app.name)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* Tooltip - macOS Style */}
                <motion.div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl px-3 py-1.5 rounded-md whitespace-nowrap text-white text-xs font-medium pointer-events-none border border-white/10"
                  initial={{ opacity: 0, y: 5 }}
                  animate={
                    hoveredApp === app.name
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 5 }
                  }
                  transition={{ duration: 0.15 }}
                >
                  {app.name}
                </motion.div>

                {/* Button */}
                <motion.button
                  className="glass-button glass-shadow w-14 h-14 flex items-center justify-center text-white"
                  whileHover={{
                    scale: 1.25,
                    y: -6,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <motion.div
                    animate={
                      hoveredApp === app.name
                        ? { scale: 1.15 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={28} className={hoveredApp === app.name ? 'text-white' : 'text-white/70'} />
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
