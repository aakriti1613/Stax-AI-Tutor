'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SUBJECTS, DOMAINS, type Subject, type Domain } from '@/lib/subjects'
import { Lock, CheckCircle2, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'

export default function JourneyMap() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const [expandedDomains, setExpandedDomains] = useState<Set<Domain>>(new Set())

  const handleSubjectClick = (subjectId: Subject) => {
    router.push(`/subject/${subjectId}`)
  }

  const toggleDomain = (domainId: Domain) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev)
      if (newSet.has(domainId)) {
        newSet.delete(domainId)
      } else {
        newSet.add(domainId)
      }
      return newSet
    })
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

      {/* Domains */}
      <div className="space-y-6">
        {(Object.keys(DOMAINS) as Domain[]).map((domainId, domainIdx) => {
          const domain = DOMAINS[domainId]
          const isExpanded = expandedDomains.has(domainId)
          const domainSubjects = domain.subjects.map(id => SUBJECTS[id]).filter(Boolean)

          return (
            <motion.div
              key={domainId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: domainIdx * 0.1 }}
              className="glass-card p-6"
            >
              {/* Domain Header */}
              <div
                onClick={() => {
                  // Special handling for stax-interview - navigate directly
                  if (domainId === 'stax-interview') {
                    router.push('/stax-interview')
                    return
                  }
                  toggleDomain(domainId)
                }}
                className="flex items-center justify-between cursor-pointer mb-4"
              >
                <div className="flex items-center gap-4">
                  {domainId !== 'stax-interview' && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-neon-cyan" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-neon-cyan" />
                      )}
                    </motion.div>
                  )}
                  {domainId === 'stax-interview' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-neon-purple" />
                    </motion.div>
                  )}
                  <span className="text-4xl">{domain.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-neon-cyan">{domain.name}</h3>
                    <p className="text-gray-400 text-sm">{domain.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {domainId === 'stax-interview' ? (
                    <>
                      <div className="text-neon-purple font-bold">AI Interviewer</div>
                      <div className="text-gray-400 text-sm">Click to start</div>
                    </>
                  ) : (
                    <>
                      <div className="text-neon-cyan font-bold">{domainSubjects.length} Subjects</div>
                      <div className="text-gray-400 text-sm">Click to expand</div>
                    </>
                  )}
                </div>
              </div>

              {/* Subjects Grid */}
              {isExpanded && domainId !== 'stax-interview' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
                >
                  {domainSubjects.map((subject, subjectIdx) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: subjectIdx * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card p-4 cursor-pointer relative overflow-hidden group border border-gray-700 hover:border-neon-cyan transition-all"
                      onClick={() => handleSubjectClick(subject.id)}
                    >
                      <div className="relative z-10">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="text-4xl mb-2"
                        >
                          {subject.icon}
                        </motion.div>
                        <h4 className="text-lg font-bold mb-1 text-neon-cyan">{subject.name}</h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {subject.units.length} units
                        </p>

                        {/* Progress indicator */}
                        <div className="space-y-1 mb-3">
                          {subject.units.slice(0, 2).map((unit) => (
                            <div key={unit.id} className="flex items-center gap-2 text-xs">
                              {unit.completed ? (
                                <CheckCircle2 className="w-3 h-3 text-neon-green" />
                              ) : unit.locked ? (
                                <Lock className="w-3 h-3 text-gray-600" />
                              ) : (
                                <Sparkles className="w-3 h-3 text-neon-cyan" />
                              )}
                              <span className={unit.completed ? 'text-neon-green' : unit.locked ? 'text-gray-600' : 'text-white'}>
                                {unit.name}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* XP indicator */}
                        <div className="flex justify-between text-xs pt-2 border-t border-gray-700">
                          <span className="text-gray-400">Total XP</span>
                          <span className="text-neon-cyan font-bold">
                            {subject.units.reduce((sum, u) => sum + u.xpReward, 0)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
