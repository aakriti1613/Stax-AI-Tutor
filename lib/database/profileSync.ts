// Utility to sync profile data between localStorage and database
import { getUserStats } from './userStats'
import { getAllUserProgress } from './userProgress'
import type { UserProfile } from '@/lib/types/profile'
import type { UserStats as DBUserStats } from './userStats'

/**
 * Load profile from database and merge with localStorage
 */
export async function loadProfileFromDatabase(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    // Get stats from database
    const dbStats = await getUserStats(userId)
    if (!dbStats) return null

    // Get progress from database
    const progress = await getAllUserProgress(userId)

    // Convert database stats to profile stats format
    const profileStats = {
      problemsSolved: dbStats.problems_solved,
      contestsWon: dbStats.contests_won,
      duelsWon: dbStats.duels_won,
      duelsLost: dbStats.duels_lost,
      marathonsCompleted: dbStats.marathons_completed,
      averageTime: dbStats.average_time_per_problem,
      longestStreak: dbStats.longest_streak,
      currentStreak: dbStats.current_streak,
      totalTimeSpent: Math.floor(progress.reduce((sum, p) => sum + p.time_spent, 0) / 60) // Convert seconds to minutes
    }

    // Calculate mastery from progress
    const mastery = calculateMasteryFromProgress(progress)

    return {
      totalXP: dbStats.total_xp,
      level: dbStats.level,
      rank: dbStats.rank,
      stats: profileStats,
      mastery,
      lastActive: dbStats.last_activity_date ? new Date(dbStats.last_activity_date) : new Date()
    }
  } catch (error) {
    console.error('Error loading profile from database:', error)
    return null
  }
}

/**
 * Calculate mastery levels from progress data
 */
function calculateMasteryFromProgress(progress: any[]): any[] {
  const masteryMap = new Map<string, { solved: number; total: number }>()

  progress.forEach(p => {
    const key = `${p.subject_id}-${p.unit_id}`
    if (!masteryMap.has(key)) {
      masteryMap.set(key, { solved: 0, total: 0 })
    }
    const entry = masteryMap.get(key)!
    if (p.completed) {
      entry.solved++
    }
    entry.total++
  })

  return Array.from(masteryMap.entries()).map(([topic, data]) => ({
    topic,
    masteryLevel: data.total > 0 ? data.solved / data.total : 0,
    problemsSolved: data.solved,
    lastPracticed: new Date()
  }))
}

/**
 * Sync profile data - merge database data with localStorage
 */
export async function syncProfileWithDatabase(userId: string, localProfile: UserProfile): Promise<UserProfile> {
  const dbData = await loadProfileFromDatabase(userId)
  
  if (!dbData) {
    // Database not available or no data, return local profile
    return localProfile
  }

  // Merge database data with local profile
  return {
    ...localProfile,
    totalXP: dbData.totalXP ?? localProfile.totalXP,
    level: dbData.level ?? localProfile.level,
    rank: dbData.rank ?? localProfile.rank,
    stats: dbData.stats ?? localProfile.stats,
    mastery: dbData.mastery ?? localProfile.mastery,
    lastActive: dbData.lastActive ?? localProfile.lastActive
  }
}



