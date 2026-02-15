// React hook for database operations
import { useState, useEffect, useCallback } from 'react'
import { getUserStats, updateUserStats, addXP } from '@/lib/database/userStats'
import { saveUserProgress, getUserProgress } from '@/lib/database/userProgress'
import { subscribeToUserStats, unsubscribe } from '@/lib/database/realtime'
import type { UserStats } from '@/lib/database/userStats'
import type { UserProgress } from '@/lib/database/userProgress'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    if (!userId) {
      setStats(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getUserStats(userId)
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load stats')
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadStats()

    // Subscribe to real-time updates (falls back to polling if not available)
    let channel: RealtimeChannel | null = null
    let pollInterval: NodeJS.Timeout | null = null

    if (userId) {
      // Try real-time subscription
      channel = subscribeToUserStats(userId, (payload) => {
        if (payload.new) {
          setStats(payload.new as UserStats)
        }
      })

      // Fallback to polling if Realtime not available (every 5 seconds)
      if (!channel || channel.state !== 'joined') {
        pollInterval = setInterval(() => {
          loadStats()
        }, 5000) // Poll every 5 seconds
      }

      return () => {
        if (channel) unsubscribe(channel)
        if (pollInterval) clearInterval(pollInterval)
      }
    }
  }, [userId, loadStats])

  const updateStats = useCallback(async (updates: Partial<UserStats>) => {
    if (!userId) return null

    try {
      const updated = await updateUserStats(userId, updates)
      setStats(updated)
      return updated
    } catch (err: any) {
      setError(err.message || 'Failed to update stats')
      console.error('Error updating stats:', err)
      return null
    }
  }, [userId])

  const addXPToUser = useCallback(async (xpAmount: number) => {
    if (!userId) return null

    try {
      const updated = await addXP(userId, xpAmount)
      setStats(updated)
      return updated
    } catch (err: any) {
      setError(err.message || 'Failed to add XP')
      console.error('Error adding XP:', err)
      return null
    }
  }, [userId])

  return {
    stats,
    loading,
    error,
    updateStats,
    addXP: addXPToUser,
    refresh: loadStats
  }
}

export function useUserProgress(userId: string | null) {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProgress = useCallback(async () => {
    if (!userId) {
      setProgress([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { getAllUserProgress } = await import('@/lib/database/userProgress')
      const data = await getAllUserProgress(userId)
      setProgress(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load progress')
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadProgress()
  }, [userId, loadProgress])

  const saveProgress = useCallback(async (progressData: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return null

    try {
      const { saveUserProgress } = await import('@/lib/database/userProgress')
      const saved = await saveUserProgress(progressData)
      await loadProgress() // Refresh list
      return saved
    } catch (err: any) {
      setError(err.message || 'Failed to save progress')
      console.error('Error saving progress:', err)
      return null
    }
  }, [userId, loadProgress])

  return {
    progress,
    loading,
    error,
    saveProgress,
    refresh: loadProgress
  }
}

