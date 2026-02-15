'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SUBJECTS, type Subject } from '@/lib/subjects'
import ConceptLearning from '@/components/ConceptLearning'
import MCQGate from '@/components/MCQGate'
import CodingChallenge from '@/components/CodingChallenge'
import SQLChallenge from '@/components/SQLChallenge'
import BadgeUnlock from '@/components/BadgeUnlock'
import PersonalizedAssignment from '@/components/PersonalizedAssignment'
import { ArrowLeft, Loader2 } from 'lucide-react'

type Phase = 'theory' | 'mcq' | 'basic' | 'medium' | 'hard' | 'assignment'

export default function SubtopicPhasePage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as Subject
  const unitId = params.unitId as string
  const subtopicId = params.subtopicId as string
  const phase = params.phase as Phase

  const subject = SUBJECTS[subjectId]
  const unit = subject?.units.find(u => u.id === unitId)
  const subtopic = unit?.subtopics.find(s => s.id === subtopicId)

  const [completed, setCompleted] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  if (!subject || !unit || !subtopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Not Found</h1>
          <button onClick={() => router.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const markPhaseComplete = (phaseName: string) => {
    const phaseKey = `${subtopicId}-${phaseName}`
    const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '{}')
    completedPhases[phaseKey] = true
    localStorage.setItem('completedPhases', JSON.stringify(completedPhases))
  }

  const handleTheoryComplete = () => {
    // Mark theory as completed
    markPhaseComplete('theory')
    // Theory completed, can proceed to MCQ
    router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/mcq`)
  }

  const handleMCQComplete = () => {
    // Mark MCQ as completed
    markPhaseComplete('mcq')
    // MCQ completed, can proceed to Basic
    router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/basic`)
  }

  const handleBasicComplete = () => {
    // Mark basic as completed
    markPhaseComplete('basic')
    // Basic completed - show badge!
    setShowBadge(true)
  }

  const handleBadgeClose = () => {
    setShowBadge(false)
    // Navigate to medium or back to journey
    router.push(`/subject/${subjectId}/unit/${unitId}/journey`)
  }

  const handleCodingComplete = () => {
    // Mark current phase as completed
    markPhaseComplete(phase)
    
    // Medium or Hard completed
    if (phase === 'medium') {
      router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/hard`)
    } else if (phase === 'hard') {
      // After hard, go to personalized assignment
      router.push(`/subject/${subjectId}/unit/${unitId}/subtopic/${subtopicId}/assignment`)
    }
  }

  const handleAssignmentComplete = () => {
    // Mark this phase as completed in localStorage
    const phaseKey = `${subtopicId}-${phase}`
    const completedPhases = JSON.parse(localStorage.getItem('completedPhases') || '{}')
    completedPhases[phaseKey] = true
    localStorage.setItem('completedPhases', JSON.stringify(completedPhases))
    
    // Check if all phases for this subtopic are completed
    const allPhases = ['theory', 'mcq', 'basic', 'medium', 'hard', 'assignment']
    const allCompleted = allPhases.every(p => completedPhases[`${subtopicId}-${p}`])
    
    if (allCompleted) {
      // Mark subtopic as fully completed
      const completedSubtopics = JSON.parse(localStorage.getItem('completedSubtopics') || '{}')
      completedSubtopics[subtopicId] = true
      localStorage.setItem('completedSubtopics', JSON.stringify(completedSubtopics))
      
      // Check if Arrays unit is fully completed
      if (subjectId === 'dsa' && unitId === 'arrays') {
        const arraysUnit = subject.units.find(u => u.id === 'arrays')
        if (arraysUnit) {
          const allSubtopicsCompleted = arraysUnit.subtopics.every(st => 
            completedSubtopics[st.id]
          )
          if (allSubtopicsCompleted) {
            // Arrays unit completed! Badge will be added on next profile load
            console.log('🎉 Arrays unit completed! Badge will be added to profile.')
          }
        }
      }
    }
    
    // Assignment completed, go back to journey
    router.push(`/subject/${subjectId}/unit/${unitId}/journey`)
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(0, 255, 255, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(157, 78, 221, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(0, 255, 255, 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push(`/subject/${subjectId}/unit/${unitId}/journey`)}
          className="btn-secondary mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Journey
        </motion.button>

        {/* Phase Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <h1 className="text-4xl font-bold neon-text mb-2">
            {subtopic.name}
          </h1>
          <p className="text-xl text-gray-400 mb-4">{subtopic.description}</p>
          <div className="inline-block px-4 py-2 bg-neon-cyan/20 border border-neon-cyan rounded-full">
            <span className="text-neon-cyan font-bold capitalize">{phase} Level</span>
          </div>
        </motion.div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {phase === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <ConceptLearning
                subject={subject.name}
                unit={unit.name}
                subtopic={subtopic.name}
                onComplete={handleTheoryComplete}
              />
            </motion.div>
          )}

          {phase === 'mcq' && (
            <motion.div
              key="mcq"
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <MCQGate
                subject={subject.name}
                unit={`${unit.name} - ${subtopic.name}`}
                onPass={handleMCQComplete}
                isFirstUnit={unitId === subject.units[0]?.id}
              />
            </motion.div>
          )}

          {(phase === 'basic' || phase === 'medium' || phase === 'hard') && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 50, rotateZ: -5 }}
              animate={{ opacity: 1, y: 0, rotateZ: 0 }}
              exit={{ opacity: 0, y: -50, rotateZ: 5 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {subjectId === 'dbms' ? (
                <SQLChallenge
                  subject={subject.name}
                  unit={unit.name}
                  subtopic={subtopic.name}
                  difficulty={phase === 'basic' ? 'Basic' : phase === 'medium' ? 'Medium' : 'Advanced'}
                  onComplete={phase === 'basic' ? handleBasicComplete : handleCodingComplete}
                />
              ) : (
                <CodingChallenge
                  subject={subject.name}
                  unit={unit.name}
                  subtopic={subtopic.name}
                  difficulty={phase === 'basic' ? 'Basic' : phase === 'medium' ? 'Medium' : 'Advanced'}
                  onComplete={phase === 'basic' ? handleBasicComplete : handleCodingComplete}
                />
              )}
            </motion.div>
          )}

          {phase === 'assignment' && (
            <motion.div
              key="assignment"
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <PersonalizedAssignment
                subject={subject.name}
                unit={unit.name}
                subtopic={subtopic.name}
                onComplete={handleAssignmentComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge Unlock Modal */}
      <AnimatePresence>
        {showBadge && (
          <BadgeUnlock
            subtopicName={subtopic.name}
            onClose={handleBadgeClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


