// Database utilities for user statistics
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface UserStats {
  id?: string
  user_id: string
  total_xp: number
  level: number
  rank: number
  problems_solved: number
  contests_won: number
  duels_won: number
  duels_lost: number
  marathons_completed: number
  current_streak: number
  longest_streak: number
  last_activity_date?: string
  average_time_per_problem: number
  updated_at?: string
}

/**
 * Get or create user stats
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return getStatsFromLocalStorage(userId)
  }

  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user stats:', error)
      return getStatsFromLocalStorage(userId)
    }

    if (!data) {
      // Create default stats
      return await createDefaultStats(userId)
    }

    return data as UserStats
  } catch (error) {
    console.error('Error getting user stats:', error)
    return getStatsFromLocalStorage(userId)
  }
}

/**
 * Update user stats
 */
export async function updateUserStats(
  userId: string,
  updates: Partial<Omit<UserStats, 'id' | 'user_id' | 'updated_at'>>
): Promise<UserStats | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return updateStatsInLocalStorage(userId, updates)
  }

  try {
    // Calculate level from XP (100 XP per level)
    const currentStats = await getUserStats(userId)
    const newXP = updates.total_xp !== undefined ? updates.total_xp : (currentStats?.total_xp || 0)
    const newLevel = Math.floor(newXP / 100) + 1

    const { data, error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        ...updates,
        level: newLevel,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating user stats:', error)
      return updateStatsInLocalStorage(userId, updates)
    }

    // Update global rank
    await updateGlobalRank(userId)

    return data as UserStats
  } catch (error) {
    console.error('Error updating user stats:', error)
    return updateStatsInLocalStorage(userId, updates)
  }
}

/**
 * Update global rank for all users
 */
async function updateGlobalRank(userId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    // Get all users ordered by total_xp
    const { data, error } = await supabase
      .from('user_stats')
      .select('user_id, total_xp')
      .order('total_xp', { ascending: false })

    if (error || !data) return

    // Update ranks
    const updates = data.map((stat, index) => ({
      user_id: stat.user_id,
      rank: index + 1
    }))

    // Batch update ranks (Supabase doesn't support bulk updates easily, so we'll do it in chunks)
    for (const update of updates) {
      await supabase
        .from('user_stats')
        .update({ rank: update.rank })
        .eq('user_id', update.user_id)
    }
  } catch (error) {
    console.error('Error updating global rank:', error)
  }
}

/**
 * Add XP to user
 */
export async function addXP(userId: string, xpAmount: number): Promise<UserStats | null> {
  const currentStats = await getUserStats(userId)
  const newXP = (currentStats?.total_xp || 0) + xpAmount

  return updateUserStats(userId, {
    total_xp: newXP
  })
}

/**
 * Increment problems solved
 */
export async function incrementProblemsSolved(userId: string): Promise<UserStats | null> {
  const currentStats = await getUserStats(userId)
  const newCount = (currentStats?.problems_solved || 0) + 1

  return updateUserStats(userId, {
    problems_solved: newCount
  })
}

/**
 * Create default stats for a user
 */
async function createDefaultStats(userId: string): Promise<UserStats | null> {
  const defaultStats: Omit<UserStats, 'id' | 'updated_at'> = {
    user_id: userId,
    total_xp: 0,
    level: 1,
    rank: 999999,
    problems_solved: 0,
    contests_won: 0,
    duels_won: 0,
    duels_lost: 0,
    marathons_completed: 0,
    current_streak: 0,
    longest_streak: 0,
    average_time_per_problem: 0
  }

  return updateUserStats(userId, defaultStats)
}

// LocalStorage fallback functions
function getStatsFromLocalStorage(userId: string): UserStats | null {
  try {
    const key = `stats_${userId}`
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
    // Create default
    const defaultStats: UserStats = {
      user_id: userId,
      total_xp: 0,
      level: 1,
      rank: 999999,
      problems_solved: 0,
      contests_won: 0,
      duels_won: 0,
      duels_lost: 0,
      marathons_completed: 0,
      current_streak: 0,
      longest_streak: 0,
      average_time_per_problem: 0
    }
    localStorage.setItem(key, JSON.stringify(defaultStats))
    return defaultStats
  } catch (error) {
    console.error('Error getting stats from localStorage:', error)
    return null
  }
}

function updateStatsInLocalStorage(
  userId: string,
  updates: Partial<Omit<UserStats, 'id' | 'user_id' | 'updated_at'>>
): UserStats | null {
  try {
    const currentStats = getStatsFromLocalStorage(userId)
    if (!currentStats) return null

    const newXP = updates.total_xp !== undefined ? updates.total_xp : currentStats.total_xp
    const newLevel = Math.floor(newXP / 100) + 1

    const updatedStats: UserStats = {
      ...currentStats,
      ...updates,
      level: newLevel,
      updated_at: new Date().toISOString()
    }

    const key = `stats_${userId}`
    localStorage.setItem(key, JSON.stringify(updatedStats))
    return updatedStats
  } catch (error) {
    console.error('Error updating stats in localStorage:', error)
    return null
  }
}





