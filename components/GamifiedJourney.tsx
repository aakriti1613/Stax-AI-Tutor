'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SUBJECTS, type Subject, type SubTopic } from '@/lib/subjects'
import { Lock, CheckCircle2, Sparkles, BookOpen, FileQuestion, Code2, Trophy, Target } from 'lucide-react'

interface GamifiedJourneyProps {
  subjectId: Subject
  unitId: string
}

type JourneyPhase = 'theory' | 'mcq' | 'basic' | 'medium' | 'hard' | 'assignment'

export default function GamifiedJourney({ subjectId, unitId }: GamifiedJourneyProps) {
  const router = useRouter()
  const subject = SUBJECTS[subjectId]
  const unit = subject?.units.find(u => u.id === unitId)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })

  const [currentSubTopicIndex, setCurrentSubTopicIndex] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<JourneyPhase>('theory')
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set())

  if (!subject || !unit) {
    return <div>Unit not found</div>
  }

  const subtopics = unit.subtopics.sort((a, b) => a.order - b.order)
  const currentSubTopic = subtopics[currentSubTopicIndex]

  const phases: JourneyPhase[] = ['theory', 'mcq', 'basic', 'medium', 'hard', 'assignment']
  const phaseIcons = {
    theory: BookOpen,
    mcq: FileQuestion,
    basic: Code2,
    medium: Code2,
    hard: Code2,
    assignment: Target,
  }
  const phaseLabels = {
    theory: 'Theory',
    mcq: 'MCQ',
    basic: 'Basic',
    medium: 'Medium',
    hard: 'Hard',
    assignment: 'Assignment',
  }

  const handlePhaseClick = (phase: JourneyPhase, subtopicId: string) => {
    const phaseKey = `${subtopicId}-${phase}`
    const phaseIndex = phases.indexOf(phase)
    const isFirstUnit = unitId === subject.units[0]?.id
    const isFirstSubtopic = subtopicId === unit.subtopics[0]?.id
    
    // For first unit's first subtopic, unlock all phases
    if (isFirstUnit && isFirstSubtopic) {
      router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/${phase}`)
      return
    }
    
    if (completedPhases.has(phaseKey)) {
      // Navigate to that phase
      router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/${phase}`)
    } else {
      // Check if previous phase is completed
      if (phaseIndex === 0 || completedPhases.has(`${subtopicId}-${phases[phaseIndex - 1]}`)) {
        router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/${phase}`)
      }
    }
  }

  const handleSubTopicComplete = (subtopicId: string) => {
    // Mark all phases as completed for this subtopic
    phases.forEach(phase => {
      setCompletedPhases(prev => new Set(prev).add(`${subtopicId}-${phase}`))
    })
    
    // Move to next subtopic
    if (currentSubTopicIndex < subtopics.length - 1) {
      setCurrentSubTopicIndex(currentSubTopicIndex + 1)
      setCurrentPhase('theory')
    }
  }

  // Calculate path for snake-like line
  const getPathPoints = () => {
    const points: Array<{ x: number; y: number; subtopic: SubTopic; phase: JourneyPhase }> = []
    subtopics.forEach((subtopic, subIdx) => {
      phases.forEach((phase, phaseIdx) => {
        const x = 100 + phaseIdx * 150
        const y = 100 + subIdx * 200
        points.push({ x, y, subtopic, phase })
      })
    })
    return points
  }

  const pathPoints = getPathPoints()

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden relative bg-dark-bg">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-neon-cyan/10" />
          ))}
        </div>
      </div>

      {/* Snake-like Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <motion.path
          d={pathPoints.reduce((acc, point, idx) => {
            if (idx === 0) return `M ${point.x} ${point.y}`
            return `${acc} L ${point.x} ${point.y}`
          }, '')}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeDasharray="10 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#9d4edd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Journey Nodes */}
      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold neon-text mb-4">{unit.name}</h1>
          <p className="text-xl text-gray-400">Complete each phase to progress</p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {subtopics.map((subtopic, subIdx) => (
            <div key={subtopic.id} className="mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: subIdx * 0.2 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold text-neon-cyan mb-2">
                  {subIdx + 1}. {subtopic.name}
                </h2>
                <p className="text-gray-400">{subtopic.description}</p>
              </motion.div>

              {/* Phase Nodes */}
              <div className="flex items-center gap-4 flex-wrap">
                {phases.map((phase, phaseIdx) => {
                  const phaseKey = `${subtopic.id}-${phase}`
                  const isCompleted = completedPhases.has(phaseKey)
                  const isFirstUnit = unitId === subject.units[0]?.id
                  const isFirstSubtopic = subtopic.id === unit.subtopics[0]?.id
                  // Unlock all phases for first unit's first subtopic
                  const isLocked = !(isFirstUnit && isFirstSubtopic) && phaseIdx > 0 && !completedPhases.has(`${subtopic.id}-${phases[phaseIdx - 1]}`)
                  const Icon = phaseIcons[phase]

                  return (
                    <motion.div
                      key={phaseKey}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: subIdx * 0.1 + phaseIdx * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !isLocked && handlePhaseClick(phase, subtopic.id)}
                      className={`relative cursor-pointer ${
                        isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all ${
                          isCompleted
                            ? 'bg-neon-green/20 border-neon-green neon-glow'
                            : isLocked
                            ? 'bg-dark-card border-gray-600'
                            : 'bg-dark-card border-neon-cyan hover:border-neon-purple hover:scale-110'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-10 h-10 text-neon-green" />
                        ) : isLocked ? (
                          <Lock className="w-8 h-8 text-gray-600" />
                        ) : (
                          <Icon className={`w-8 h-8 text-neon-cyan`} />
                        )}
                      </div>

                      {/* Phase Label */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted
                              ? 'text-neon-green'
                              : isLocked
                              ? 'text-gray-600'
                              : 'text-neon-cyan'
                          }`}
                        >
                          {phaseLabels[phase]}
                        </span>
                      </div>

                      {/* XP Badge */}
                      {!isLocked && (
                        <div className="absolute -top-2 -right-2 bg-neon-purple text-white text-xs font-bold px-2 py-1 rounded-full">
                          +{Math.round(subtopic.xpReward / phases.length)}
                        </div>
                      )}
                    </motion.div>
                  )
                })}

                {/* Arrow to next subtopic */}
                {subIdx < subtopics.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex-1 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink mx-4"
                    style={{ minWidth: '100px' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 glass-card p-4"
        >
          <div className="flex items-center gap-4">
            <Trophy className="w-6 h-6 text-neon-cyan" />
            <div>
              <div className="text-sm text-gray-400">Progress</div>
              <div className="text-lg font-bold text-neon-cyan">
                {completedPhases.size} / {subtopics.length * phases.length} phases
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

