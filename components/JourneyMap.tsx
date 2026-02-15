'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SUBJECTS, type Subject } from '@/lib/subjects'
import { Lock, CheckCircle2, Sparkles } from 'lucide-react'

export default function JourneyMap() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })

  const handleSubjectClick = (subjectId: Subject) => {
    router.push(`/subject/${subjectId}`)
  }

  return (
    <div ref={containerRef} className="space-y-8 overflow-y-auto max-h-screen">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center neon-text mb-8"
      >
        Choose Your Learning Path
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(SUBJECTS) as Subject[]).map((subjectId, idx) => {
          const subject = SUBJECTS[subjectId]
          return (
            <motion.div
              key={subjectId}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{
                delay: idx * 0.1,
                duration: 0.5,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ scale: 1.05, y: -5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card p-6 cursor-pointer relative overflow-hidden group"
              onClick={() => handleSubjectClick(subjectId)}
            >
              {/* Background glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br from-${subject.color}/20 to-transparent`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="text-6xl mb-4"
                >
                  {subject.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-neon-cyan">{subject.name}</h3>
                <p className="text-gray-400 mb-4">
                  {subject.units.length} units to master
                </p>

                {/* Progress indicator */}
                <div className="space-y-2">
                  {subject.units.slice(0, 3).map((unit, unitIdx) => (
                    <motion.div
                      key={unit.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: unitIdx * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      {unit.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-neon-green" />
                      ) : unit.locked ? (
                        <Lock className="w-4 h-4 text-gray-600" />
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="w-4 h-4 text-neon-cyan" />
                        </motion.div>
                      )}
                      <span className={unit.completed ? 'text-neon-green' : unit.locked ? 'text-gray-600' : 'text-white'}>
                        {unit.name}
                      </span>
                    </motion.div>
                  ))}
                  {subject.units.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-xs text-gray-500"
                    >
                      +{subject.units.length - 3} more units
                    </motion.div>
                  )}
                </div>

                {/* XP indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-4 pt-4 border-t border-neon-cyan/20"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total XP</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.3 }}
                      className="text-neon-cyan font-bold"
                    >
                      {subject.units.reduce((sum, u) => sum + u.xpReward, 0)}
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
