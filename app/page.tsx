'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import JourneyMap from '@/components/JourneyMap'
import { Sparkles, Code, BookOpen, Trophy, Zap, ChevronDown } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToJourney = () => {
    journeyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) return null

  return (
    <main className="relative">
      {/* Hero Section - Full Viewport */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4">
          {/* Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1, bounce: 0.5 }}
            className="inline-block mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Sparkles className="w-24 h-24 text-neon-cyan drop-shadow-[0_0_30px_rgba(0,255,255,0.8)]" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-7xl md:text-8xl font-bold mb-6 neon-text"
          >
            Stax AI Tutor
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Master Computer Science through an immersive, gamified journey
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto"
          >
            {[
              { icon: Code, title: 'Dynamic Content', desc: 'AI-generated lessons', color: 'neon-cyan' },
              { icon: BookOpen, title: 'Visual Learning', desc: 'Animated concepts', color: 'neon-purple' },
              { icon: Trophy, title: 'Gamified Progress', desc: 'XP & Leaderboards', color: 'neon-pink' },
              { icon: Zap, title: 'Adaptive AI', desc: 'Personalized paths', color: 'neon-green' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className={`w-12 h-12 text-${feature.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                </motion.div>
                <h3 className="font-bold text-lg mb-2 text-center">{feature.title}</h3>
                <p className="text-sm text-gray-400 text-center">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              onClick={scrollToJourney}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors"
            >
              <span className="text-sm font-bold">Explore Journey</span>
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Journey Map Section */}
      <section
        ref={journeyRef}
        className="min-h-screen py-20 px-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <JourneyMap />
        </motion.div>
      </section>
    </main>
  )
}
