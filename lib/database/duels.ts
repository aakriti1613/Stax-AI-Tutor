// Database utilities for duels
import { supabase, isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase'
import { Duel, DuelStatus, ContestProblem } from '@/lib/types/contests'

export interface DuelDB {
  id: string
  challenger_id: string
  opponent_id: string
  status: string
  problem_id: string
  problem_title: string
  problem_description: string
  challenger_solution: string | null
  opponent_solution: string | null
  challenger_score: number
  opponent_score: number
  winner_id: string | null
  xp_reward: number
  started_at: string | null
  ended_at: string | null
  created_at: string
}

/**
 * Find available opponent for duel
 */
export async function findOpponent(userId: string, minLevel?: number, maxLevel?: number): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    // Get user stats to match skill level
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('level, total_xp')
      .eq('user_id', userId)
      .single()

    if (!userStats) {
      // If no stats, try to find any user
      const { data: anyUser } = await supabase
        .from('users')
        .select('id')
        .neq('id', userId)
        .limit(1)
        .single()
      
      return anyUser?.id || null
    }

    const userLevel = userStats.level || 1
    const levelRange = 3 // Match within 3 levels

    // Find users looking for duels or available users
    const { data: availableUsers } = await supabase
      .from('user_stats')
      .select('user_id, level')
      .neq('user_id', userId)
      .gte('level', Math.max(1, userLevel - levelRange))
      .lte('level', userLevel + levelRange)
      .order('level', { ascending: true })
      .limit(50)

    if (!availableUsers || availableUsers.length === 0) {
      // Fallback: find any user from users table
      const { data: anyUser } = await supabase
        .from('users')
        .select('id')
        .neq('id', userId)
        .limit(1)
        .single()
      
      return anyUser?.id || null
    }

    // Randomly select an opponent
    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    return availableUsers[randomIndex].user_id
  } catch (error) {
    console.error('Error finding opponent:', error)
    // Fallback: return null (will create a bot opponent or wait)
    return null
  }
}

/**
 * Create a new duel
 */
export async function createDuel(
  challengerId: string,
  opponentId: string,
  problem: ContestProblem,
  xpReward: number = 50
): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('duels')
      .insert({
        challenger_id: challengerId,
        opponent_id: opponentId,
        status: 'pending',
        problem_id: problem.id,
        problem_title: problem.title,
        problem_description: JSON.stringify(problem),
        xp_reward: xpReward,
        challenger_score: 0,
        opponent_score: 0
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error creating duel:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error creating duel:', error)
    return null
  }
}

/**
 * Start a duel
 */
export async function startDuel(duelId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from('duels')
      .update({
        status: 'active',
        started_at: new Date().toISOString()
      })
      .eq('id', duelId)

    if (error) {
      console.error('Error starting duel:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error starting duel:', error)
    return false
  }
}

/**
 * Submit solution to duel
 */
export async function submitDuelSolution(
  duelId: string,
  userId: string,
  solution: string,
  score: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { data: duel } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single()

    if (!duel) return false

    const isChallenger = duel.challenger_id === userId
    const updateData: any = {}

    if (isChallenger) {
      updateData.challenger_solution = solution
      updateData.challenger_score = score
    } else {
      updateData.opponent_solution = solution
      updateData.opponent_score = score
    }

    const { error } = await supabase
      .from('duels')
      .update(updateData)
      .eq('id', duelId)

    if (error) {
      console.error('Error submitting solution:', error)
      return false
    }

    // Check if both solutions are submitted and determine winner
    const { data: updatedDuel } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single()

    if (updatedDuel && updatedDuel.challenger_solution && updatedDuel.opponent_solution) {
      await completeDuel(duelId)
    }

    return true
  } catch (error) {
    console.error('Error submitting solution:', error)
    return false
  }
}

/**
 * Complete a duel and determine winner
 */
async function completeDuel(duelId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    const { data: duel } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single()

    if (!duel) return

    let winnerId: string | null = null
    if (duel.challenger_score > duel.opponent_score) {
      winnerId = duel.challenger_id
    } else if (duel.opponent_score > duel.challenger_score) {
      winnerId = duel.opponent_id
    }
    // If tie, no winner

    await supabase
      .from('duels')
      .update({
        status: 'completed',
        winner_id: winnerId,
        ended_at: new Date().toISOString()
      })
      .eq('id', duelId)

    // Update user stats
    if (winnerId) {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('duels_won, duels_lost')
        .eq('user_id', winnerId)
        .single()

      if (stats) {
        await supabase
          .from('user_stats')
          .update({ duels_won: (stats.duels_won || 0) + 1 })
          .eq('user_id', winnerId)
      }

      const loserId = winnerId === duel.challenger_id ? duel.opponent_id : duel.challenger_id
      const { data: loserStats } = await supabase
        .from('user_stats')
        .select('duels_lost')
        .eq('user_id', loserId)
        .single()

      if (loserStats) {
        await supabase
          .from('user_stats')
          .update({ duels_lost: (loserStats.duels_lost || 0) + 1 })
          .eq('user_id', loserId)
      }
    }
  } catch (error) {
    console.error('Error completing duel:', error)
  }
}

/**
 * Get duel by ID
 */
export async function getDuelById(duelId: string): Promise<Duel | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('duels')
      .select(`
        *,
        challenger:challenger_id (
          id,
          username,
          display_name
        ),
        opponent:opponent_id (
          id,
          username,
          display_name
        )
      `)
      .eq('id', duelId)
      .single()

    if (error || !data) {
      console.error('Error getting duel:', error)
      return null
    }

    return convertDuelFromDB(data)
  } catch (error) {
    console.error('Error getting duel:', error)
    return null
  }
}

/**
 * Get active duels for a user
 */
export async function getActiveDuels(userId: string): Promise<Duel[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('duels')
      .select(`
        *,
        challenger:challenger_id (
          id,
          username,
          display_name
        ),
        opponent:opponent_id (
          id,
          username,
          display_name
        )
      `)
      .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error getting active duels:', error)
      return []
    }

    return data.map(convertDuelFromDB)
  } catch (error) {
    console.error('Error getting active duels:', error)
    return []
  }
}

/**
 * Get duel history for a user
 */
export async function getDuelHistory(userId: string): Promise<Duel[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('duels')
      .select(`
        *,
        challenger:challenger_id (
          id,
          username,
          display_name
        ),
        opponent:opponent_id (
          id,
          username,
          display_name
        )
      `)
      .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) {
      console.error('Error getting duel history:', error)
      return []
    }

    return data.map(convertDuelFromDB)
  } catch (error) {
    console.error('Error getting duel history:', error)
    return []
  }
}

// Helper functions
function convertDuelFromDB(db: any): Duel {
  let problem: ContestProblem
  try {
    const problemData = typeof db.problem_description === 'string'
      ? JSON.parse(db.problem_description)
      : db.problem_description
    problem = {
      id: db.problem_id,
      title: db.problem_title || problemData?.title || 'Duel Problem',
      difficulty: problemData?.difficulty || 'Medium',
      points: problemData?.points || 100,
      solvedBy: 0
    }
  } catch {
    problem = {
      id: db.problem_id,
      title: db.problem_title || 'Duel Problem',
      difficulty: 'Medium',
      points: 100,
      solvedBy: 0
    }
  }

  return {
    id: db.id,
    challengerId: db.challenger_id,
    challengerName: db.challenger?.username || db.challenger?.display_name || 'Challenger',
    opponentId: db.opponent_id,
    opponentName: db.opponent?.username || db.opponent?.display_name || 'Opponent',
    status: db.status as DuelStatus,
    problem,
    challengerSolution: db.challenger_solution || undefined,
    opponentSolution: db.opponent_solution || undefined,
    winnerId: db.winner_id || undefined,
    startTime: db.started_at ? new Date(db.started_at) : new Date(),
    endTime: db.ended_at ? new Date(db.ended_at) : undefined,
    xpReward: db.xp_reward || 50
  }
}

