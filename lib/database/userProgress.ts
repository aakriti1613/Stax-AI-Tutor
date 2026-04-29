// Database utilities for user progress tracking
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface UserProgress {
  id?: string
  user_id: string
  subject_id: string
  unit_id: string
  subtopic_id: string
  phase: 'theory' | 'mcq' | 'basic' | 'medium' | 'hard' | 'assignment'
  completed: boolean
  score: number
  time_spent: number
  attempts: number
  completed_at?: string
  created_at?: string
  updated_at?: string
}

/**
 * Save or update user progress
 */
export async function saveUserProgress(progress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>): Promise<UserProgress | null> {
  if (!isSupabaseConfigured() || !supabase) {
    // Fallback to localStorage if Supabase not configured
    return saveProgressToLocalStorage(progress)
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: progress.user_id,
        subject_id: progress.subject_id,
        unit_id: progress.unit_id,
        subtopic_id: progress.subtopic_id,
        phase: progress.phase,
        completed: progress.completed,
        score: progress.score,
        time_spent: progress.time_spent,
        attempts: progress.attempts,
        completed_at: progress.completed_at || (progress.completed ? new Date().toISOString() : null),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,subject_id,unit_id,subtopic_id,phase'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving user progress:', error)
      return saveProgressToLocalStorage(progress)
    }

    return data as UserProgress
  } catch (error) {
    console.error('Error saving user progress:', error)
    return saveProgressToLocalStorage(progress)
  }
}

/**
 * Get user progress for a specific phase
 */
export async function getUserProgress(
  userId: string,
  subjectId: string,
  unitId: string,
  subtopicId: string,
  phase: UserProgress['phase']
): Promise<UserProgress | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return getProgressFromLocalStorage(userId, subjectId, unitId, subtopicId, phase)
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .eq('unit_id', unitId)
      .eq('subtopic_id', subtopicId)
      .eq('phase', phase)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting user progress:', error)
      return getProgressFromLocalStorage(userId, subjectId, unitId, subtopicId, phase)
    }

    return data as UserProgress | null
  } catch (error) {
    console.error('Error getting user progress:', error)
    return getProgressFromLocalStorage(userId, subjectId, unitId, subtopicId, phase)
  }
}

/**
 * Get all progress for a user
 */
export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getAllProgressFromLocalStorage(userId)
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error getting all user progress:', error)
      return getAllProgressFromLocalStorage(userId)
    }

    return (data || []) as UserProgress[]
  } catch (error) {
    console.error('Error getting all user progress:', error)
    return getAllProgressFromLocalStorage(userId)
  }
}

// LocalStorage fallback functions
function saveProgressToLocalStorage(progress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>): UserProgress | null {
  try {
    const key = `progress_${progress.user_id}_${progress.subject_id}_${progress.unit_id}_${progress.subtopic_id}_${progress.phase}`
    const progressData: UserProgress = {
      ...progress,
      id: key,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    localStorage.setItem(key, JSON.stringify(progressData))
    return progressData
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return null
  }
}

function getProgressFromLocalStorage(
  userId: string,
  subjectId: string,
  unitId: string,
  subtopicId: string,
  phase: UserProgress['phase']
): UserProgress | null {
  try {
    const key = `progress_${userId}_${subjectId}_${unitId}_${subtopicId}_${phase}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting from localStorage:', error)
    return null
  }
}

function getAllProgressFromLocalStorage(userId: string): UserProgress[] {
  try {
    const progress: UserProgress[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`progress_${userId}_`)) {
        const data = localStorage.getItem(key)
        if (data) {
          progress.push(JSON.parse(data))
        }
      }
    }
    return progress
  } catch (error) {
    console.error('Error getting all from localStorage:', error)
    return []
  }
}





