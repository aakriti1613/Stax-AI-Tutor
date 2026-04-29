'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { CheckCircle2, Loader2, Code2, Lightbulb } from 'lucide-react'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import YouTubeVideos from './YouTubeVideos'
import { SUBJECTS, type Subject } from '@/lib/subjects'

interface TheoryData {
  title: string
  overview: string
  sections: Array<{
    heading: string
    content: string
    codeExample: string
    visualDescription: string
  }>
  keyTakeaways: string[]
}

interface ConceptLearningProps {
  subject: string
  unit: string
  subtopic?: string
  onComplete: () => void
  subjectId?: Subject
  unitId?: string
  subtopicId?: string
}

export default function ConceptLearning({ subject, unit, subtopic, onComplete, subjectId, unitId, subtopicId }: ConceptLearningProps) {
  const [theory, setTheory] = useState<TheoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    fetchTheory()
  }, [subject, unit, subtopic])

  const fetchTheory = async () => {
    try {
      setLoading(true)
      // Use subtopic prop if provided, otherwise default to 'intro'
      const subtopicName = subtopic || 'intro'
      
      console.log('📚 Fetching theory:', { subject, unit, subtopic: subtopicName })
      
      const response = await axios.post('/api/gemini/theory', {
        subject,
        unit,
        subtopic: subtopicName,
      })
      
      console.log('📚 Theory API Response:', {
        hasTheory: !!response.data?.theory,
        hasError: !!response.data?.error,
        title: response.data?.theory?.title
      })
      
      if (response.data) {
        // Handle both success and error responses
        if (response.data.theory) {
          console.log('✅ Theory loaded from database!')
          console.log('Title:', response.data.theory.title)
          console.log('Sections:', response.data.theory.sections?.length || 0)
          setTheory(response.data.theory)
          if (response.data.error) {
            toast(response.data.error, { icon: '⚠️' })
          }
        } else if (response.data.error) {
          // Show error message
          console.error('❌ Theory error:', response.data.error)
          toast.error(response.data.error)
          throw new Error(response.data.error || 'Failed to load theory')
        } else {
          throw new Error('Invalid response format')
        }
      } else {
        throw new Error('No response data')
      }
    } catch (error: any) {
      console.error('Error fetching theory:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load theory content'
      toast.error(errorMessage)
      
      // Don't set fallback - let user see the error and retry
      setTheory(null)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (theory && currentSection < theory.sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setCompleted(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-neon-cyan" />
        </motion.div>
      </div>
    )
  }

  if (!theory) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400">Failed to load theory content</p>
        <button onClick={fetchTheory} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  const section = theory.sections[currentSection]

  // Get YouTube videos from subtopic if available
  const youtubeVideos: string[] = []
  if (subjectId && unitId && subtopicId) {
    const subjectData = SUBJECTS[subjectId]
    const unitData = subjectData?.units.find(u => u.id === unitId)
    const subtopicData = unitData?.subtopics.find(s => s.id === subtopicId)
    if (subtopicData?.youtubeVideos) {
      youtubeVideos.push(...subtopicData.youtubeVideos)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold neon-text mb-4">{theory.title}</h1>
        <p className="text-xl text-gray-300">{theory.overview}</p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {theory.sections.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-12 rounded-full transition-all ${
              idx <= currentSection
                ? 'bg-neon-cyan'
                : 'bg-dark-card'
            }`}
          />
        ))}
      </div>

      {/* Current Section */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 50, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        exit={{ opacity: 0, x: -50, rotateY: 15 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="glass-card p-8 space-y-6 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-8 h-8 text-neon-cyan" />
          <h2 className="text-3xl font-bold">{section.heading}</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
        </div>

        {section.codeExample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-5 h-5 text-neon-cyan" />
              <span className="text-sm text-gray-400">Code Example</span>
            </div>
            <pre className="bg-dark-bg p-4 rounded-lg border border-neon-cyan/30 overflow-x-auto">
              <code className="text-sm text-neon-green">{section.codeExample}</code>
            </pre>
          </motion.div>
        )}

        {section.visualDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg"
          >
            <p className="text-sm text-gray-300 italic">
              💡 Visual: {section.visualDescription}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Key Takeaways (if last section) */}
      {currentSection === theory.sections.length - 1 && theory.keyTakeaways.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-neon-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {theory.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neon-cyan">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommended Videos - shown after theory content */}
      {youtubeVideos.length > 0 && (
        <YouTubeVideos videoIds={youtubeVideos} title="Recommended Video Lectures" />
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {completed ? (
          <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Proceed to MCQ Gate
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            {currentSection < theory.sections.length - 1 ? 'Next' : 'Complete'}
          </button>
        )}
      </div>
    </div>
  )
}


