// Database utilities for marathons
import { supabase, isSupabaseConfigured, getSupabaseAdmin, logConnectionFailure } from '@/lib/supabase'
import { Marathon, MarathonStatus, ContestLeaderboardEntry } from '@/lib/types/contests'
import { Domain } from '@/lib/subjects'

export interface MarathonDB {
  id: string
  title: string
  description: string
  status: string
  domain: Domain
  start_date: string
  end_date: string
  duration: number
  xp_multiplier: number
  created_at: string
  updated_at: string
}

export interface MarathonParticipantDB {
  id: string
  marathon_id: string
  user_id: string
  problems_solved: number
  total_xp: number
  rank: number | null
  joined_at: string
}

/**
 * Get all marathons
 * @param domain Optional domain filter
 */
export async function getMarathons(domain?: Domain): Promise<Marathon[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    let query = supabase!
      .from('marathons')
      .select('*')
    
    if (domain) {
      query = query.eq('domain', domain)
    }
    
    const { data, error } = await query.order('start_date', { ascending: false })

    if (error) {
      // Check if it's a network/DNS error
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Marathons unavailable. Check SUPABASE_URL in .env file.')
        return []
      }
      console.error('Error getting marathons:', error)
      return []
    }

    // Get participant counts
    const marathonsWithParticipants = await Promise.all(
      (data || []).map(async (marathon) => {
        try {
          const { count } = await supabase!
            .from('marathon_participants')
            .select('*', { count: 'exact', head: true })
            .eq('marathon_id', marathon.id)

          return {
            ...marathon,
            participants: count || 0
          }
        } catch (err) {
          // If participant count fails, just return marathon with 0 participants
          return {
            ...marathon,
            participants: 0
          }
        }
      })
    )

    return marathonsWithParticipants.map(convertMarathonFromDB)
  } catch (error: any) {
    // Handle network/DNS errors gracefully
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND') || error?.code === 'ENOTFOUND') {
      logConnectionFailure('Supabase connection failed. Marathons unavailable. Check SUPABASE_URL in .env file.')
      return []
    }
    console.error('Error getting marathons:', error)
    return []
  }
}

/**
 * Get marathon by ID
 */
export async function getMarathonById(marathonId: string): Promise<Marathon | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('marathons')
      .select('*')
      .eq('id', marathonId)
      .single()

    if (error || !data) {
      console.error('Error getting marathon:', error)
      return null
    }

    // Get participant count
    const { count } = await supabase
      .from('marathon_participants')
      .select('*', { count: 'exact', head: true })
      .eq('marathon_id', marathonId)

    // Get leaderboard
    const leaderboard = await getMarathonLeaderboard(marathonId)

    return {
      ...convertMarathonFromDB({ ...data, participants: count || 0 }),
      leaderboard
    }
  } catch (error) {
    console.error('Error getting marathon:', error)
    return null
  }
}

/**
 * Join a marathon
 */
export async function joinMarathon(marathonId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    // Check if user is already a participant
    const { data: existing } = await supabase
      .from('marathon_participants')
      .select('id')
      .eq('marathon_id', marathonId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // User already joined, return true
      return true
    }

    const { error } = await supabase
      .from('marathon_participants')
      .insert({
        marathon_id: marathonId,
        user_id: userId,
        problems_solved: 0,
        total_xp: 0
      })

    if (error) {
      // If it's a duplicate key error, user already joined
      if (error.code === '23505') {
        return true
      }
      console.error('Error joining marathon:', error)
      return false
    }

    return true
  } catch (error: any) {
    // Handle duplicate key error gracefully
    if (error.code === '23505') {
      return true
    }
    console.error('Error joining marathon:', error)
    return false
  }
}

/**
 * Update marathon participant progress
 */
export async function updateMarathonProgress(
  marathonId: string,
  userId: string,
  xpEarned: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { data: participant } = await supabase
      .from('marathon_participants')
      .select('*')
      .eq('marathon_id', marathonId)
      .eq('user_id', userId)
      .single()

    if (!participant) return false

    await supabase
      .from('marathon_participants')
      .update({
        total_xp: (participant.total_xp || 0) + xpEarned,
        problems_solved: (participant.problems_solved || 0) + 1
      })
      .eq('marathon_id', marathonId)
      .eq('user_id', userId)

    // Update ranks
    await updateMarathonRanks(marathonId)

    return true
  } catch (error) {
    console.error('Error updating marathon progress:', error)
    return false
  }
}

/**
 * Get marathon leaderboard
 */
export async function getMarathonLeaderboard(marathonId: string): Promise<ContestLeaderboardEntry[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('marathon_participants')
      .select(`
        *,
        users:user_id (
          id,
          username,
          display_name
        )
      `)
      .eq('marathon_id', marathonId)
      .order('total_xp', { ascending: false })
      .limit(100)

    if (error || !data) {
      console.error('Error getting leaderboard:', error)
      return []
    }

    return data.map((entry: any, index: number) => ({
      rank: index + 1,
      userId: entry.user_id,
      username: entry.users?.username || entry.users?.display_name || 'Anonymous',
      xp: entry.total_xp,
      problemsSolved: entry.problems_solved,
      totalTime: 0,
      badge: getRankBadge(index + 1)
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

/**
 * Create a new marathon (admin function)
 */
export async function createMarathon(marathon: {
  title: string
  description: string
  domain: Domain
  startDate: Date
  endDate: Date
  duration: number
  xpMultiplier: number
}): Promise<string | null> {
  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return null
    }

    const { data, error } = await admin
      .from('marathons')
      .insert({
        title: marathon.title,
        description: marathon.description,
        domain: marathon.domain,
        status: 'upcoming',
        start_date: marathon.startDate.toISOString(),
        end_date: marathon.endDate.toISOString(),
        duration: marathon.duration,
        xp_multiplier: marathon.xpMultiplier
      })
      .select('id')
      .single()

    if (error || !data) {
      // Check if it's a network/DNS error
      if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Cannot create marathon. Check SUPABASE_URL in .env file.')
        return null
      }
      console.error('Error creating marathon:', error)
      return null
    }

    return data.id
  } catch (error: any) {
    // Handle network/DNS errors gracefully
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND') || error?.code === 'ENOTFOUND') {
      logConnectionFailure('Supabase connection failed. Cannot create marathon. Check SUPABASE_URL in .env file.')
      return null
    }
    console.error('Error creating marathon:', error)
    return null
  }
}

/**
 * Update marathon ranks
 */
async function updateMarathonRanks(marathonId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    const { data } = await supabase
      .from('marathon_participants')
      .select('id, total_xp')
      .eq('marathon_id', marathonId)
      .order('total_xp', { ascending: false })

    if (!data) return

    // Update ranks
    for (let i = 0; i < data.length; i++) {
      await supabase
        .from('marathon_participants')
        .update({ rank: i + 1 })
        .eq('id', data[i].id)
    }
  } catch (error) {
    console.error('Error updating marathon ranks:', error)
  }
}

// Helper functions
function convertMarathonFromDB(db: any): Marathon {
  const now = new Date()
  const startDate = new Date(db.start_date)
  const endDate = new Date(db.end_date)

  let status: MarathonStatus = 'upcoming'
  if (now >= startDate && now <= endDate) {
    status = 'active'
  } else if (now > endDate) {
    status = 'ended'
  }

  return {
    id: db.id,
    title: db.title,
    description: db.description,
    status,
    domain: db.domain || 'placement', // Default to placement if not set
    startDate,
    endDate,
    xpMultiplier: db.xp_multiplier,
    duration: db.duration,
    participants: db.participants || 0,
    problems: [],
    leaderboard: []
  }
}

function getRankBadge(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '🏅'
}

