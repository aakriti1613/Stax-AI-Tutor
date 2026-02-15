'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SUBJECTS, type Subject } from '@/lib/subjects'
import { ArrowLeft, Lock, Unlock, Trophy, Zap, ChevronRight } from 'lucide-react'

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as Subject
  const subject = SUBJECTS[subjectId]
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  if (!subject) {
    return <div>Subject not found</div>
  }

  const handleUnitClick = (unitId: string) => {
    if (subject.units.find(u => u.id === unitId)?.locked) {
      return
    }
    router.push(`/subject/${subjectId}/unit/${unitId}/journey`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(157, 78, 221, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div
            style={{ opacity }}
            className="mb-12 sticky top-8 z-20 glass-card p-6 backdrop-blur-xl"
          >
            <button
              onClick={() => router.back()}
              className="btn-secondary mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Journey
            </button>

            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <div className="text-6xl">{subject.icon}</div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-5xl font-bold neon-text mb-4"
              >
                {subject.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400"
              >
                Master {subject.units.length} units to become an expert
              </motion.p>
            </div>
          </motion.div>

          {/* Units Grid with Scroll Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subject.units.map((unit, idx) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, margin: '-100px' }}
                transition={{
                  delay: idx * 0.15,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                className={`glass-card p-6 cursor-pointer relative overflow-hidden group ${
                  unit.locked ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                onClick={() => handleUnitClick(unit.id)}
              >
                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/20 group-hover:to-neon-purple/20 transition-all duration-300"
                  initial={false}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <motion.h3
                        whileHover={{ x: 5 }}
                        className="text-2xl font-bold mb-2"
                      >
                        {unit.name}
                      </motion.h3>
                      <p className="text-gray-400 mb-4">{unit.description}</p>

                      {/* Subtopics Preview */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {unit.subtopics.slice(0, 3).map((subtopic) => (
                          <span
                            key={subtopic.id}
                            className="text-xs px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full border border-neon-cyan/30"
                          >
                            {subtopic.name}
                          </span>
                        ))}
                        {unit.subtopics.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-dark-card text-gray-400 rounded-full">
                            +{unit.subtopics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: unit.locked ? 0 : [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    >
                      {unit.locked ? (
                        <Lock className="w-8 h-8 text-gray-600" />
                      ) : (
                        <Unlock className="w-8 h-8 text-neon-cyan" />
                      )}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Zap className="w-5 h-5 text-neon-cyan" />
                      </motion.div>
                      <span className="font-bold text-neon-cyan">{unit.xpReward} XP</span>
                    </div>
                    {unit.completed && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-neon-green" />
                        <span className="text-neon-green">Completed</span>
                      </div>
                    )}
                    {!unit.locked && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1 text-neon-cyan"
                      >
                        <span className="text-sm font-bold">Start Journey</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
