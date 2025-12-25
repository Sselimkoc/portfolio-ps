import { motion } from 'framer-motion'
import { FileText, Briefcase, Code2, Clock, Github, Linkedin, Mail, Github as GithubIcon } from 'lucide-react'

export default function CanvasArea() {
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Hi, I'm Selim
          </h1>
          <p className="text-xl text-gray-200 mb-2 drop-shadow-md">
            UX / Front-End Developer
          </p>
          <p className="text-lg text-gray-300 drop-shadow-md">
            Crafting seamless and engaging digital experiences.
          </p>
          <motion.button
            className="mt-6 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Projects
          </motion.button>
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
                className="p-6 rounded-2xl bg-gray-900 bg-opacity-10 backdrop-blur-lg shadow-xl cursor-pointer border border-white border-opacity-10"
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 text-white mr-3" />
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                </div>
                <p className="text-white text-sm opacity-90">{card.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Taskbar - Dock Style */}
      <motion.div
        className="h-24 bg-gray-900 bg-opacity-20 backdrop-blur-md border-t border-gray-500 border-opacity-20 flex items-center justify-center gap-3 px-4 rounded-t-3xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div className="flex gap-3 items-center">
          {taskbarApps.map((app, index) => {
            const Icon = app.icon
            return (
              <motion.button
                key={index}
                className="w-16 h-16 rounded-2xl bg-gray-900 bg-opacity-20 backdrop-blur-lg flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all border border-white border-opacity-10"
                whileHover={{
                  scale: 1.2,
                  y: -15,
                }}
                whileTap={{ scale: 0.9 }}
                title={app.name}
              >
                <Icon size={32} />
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
