// Database utilities for standoffs (3v3 team battles)
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Standoff, DuelStatus, ContestProblem } from '@/lib/types/contests'
import { Domain } from '@/lib/subjects'

export interface StandoffDB {
  id: string
  team1_leader: string
  team1_member2: string | null
  team1_member3: string | null
  team2_leader: string
  team2_member2: string | null
  team2_member3: string | null
  status: string
  domain: Domain
  problem_id: string
  problem_title: string
  team1_score: number
  team2_score: number
  winner_team: number | null
  xp_reward: number
  started_at: string | null
  ended_at: string | null
  created_at: string
}

/**
 * Create a new standoff team (user creates team and waits for match)
 */
export async function createStandoffTeam(leaderId: string, domain: Domain): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    // Create a pending standoff with only team1 leader
    const { data, error } = await supabase
      .from('standoffs')
      .insert({
        team1_leader: leaderId,
        team1_member2: null,
        team1_member3: null,
        team2_leader: null,
        team2_member2: null,
        team2_member3: null,
        domain: domain,
        status: 'pending',
        problem_id: '',
        problem_title: '',
        team1_score: 0,
        team2_score: 0,
        xp_reward: 100
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error creating standoff team:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error creating standoff team:', error)
    return null
  }
}

/**
 * Join a standoff team
 */
export async function joinStandoffTeam(standoffId: string, userId: string, teamNumber: 1 | 2): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { data: standoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (!standoff) return false

    const updateData: any = {}
    if (teamNumber === 1) {
      if (!standoff.team1_member2) {
        updateData.team1_member2 = userId
      } else if (!standoff.team1_member3) {
        updateData.team1_member3 = userId
      } else {
        return false // Team is full
      }
    } else {
      if (!standoff.team2_member2) {
        updateData.team2_member2 = userId
      } else if (!standoff.team2_member3) {
        updateData.team2_member3 = userId
      } else {
        return false // Team is full
      }
    }

    const { error } = await supabase
      .from('standoffs')
      .update(updateData)
      .eq('id', standoffId)

    if (error) {
      console.error('Error joining standoff team:', error)
      return false
    }

    // Check if both teams are full and start the standoff
    const { data: updatedStandoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (updatedStandoff &&
        updatedStandoff.team1_member2 && updatedStandoff.team1_member3 &&
        updatedStandoff.team2_leader && updatedStandoff.team2_member2 && updatedStandoff.team2_member3) {
      // Both teams are full, but we need a problem first
      // This will be handled when problem is assigned
    }

    return true
  } catch (error) {
    console.error('Error joining standoff team:', error)
    return false
  }
}

/**
 * Find a match for a standoff team
 */
export async function findStandoffMatch(standoffId: string): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data: currentStandoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (!currentStandoff || !currentStandoff.team1_member2 || !currentStandoff.team1_member3) {
      return null // Team 1 is not complete
    }

    // Find another pending standoff with complete team
    const { data: matches } = await supabase
      .from('standoffs')
      .select('*')
      .eq('status', 'pending')
      .neq('id', standoffId)
      .not('team1_leader', 'is', null)
      .not('team1_member2', 'is', null)
      .not('team1_member3', 'is', null)
      .limit(1)

    if (!matches || matches.length === 0) {
      return null // No match found
    }

    const match = matches[0]

    // Merge the two standoffs
    await supabase
      .from('standoffs')
      .update({
        team2_leader: match.team1_leader,
        team2_member2: match.team1_member2,
        team2_member3: match.team1_member3,
        status: 'pending' // Will be set to active when problem is assigned
      })
      .eq('id', standoffId)

    // Delete the matched standoff
    await supabase
      .from('standoffs')
      .delete()
      .eq('id', match.id)

    return standoffId
  } catch (error) {
    console.error('Error finding standoff match:', error)
    return null
  }
}

/**
 * Start a standoff with a problem
 */
export async function startStandoff(standoffId: string, problem: ContestProblem): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from('standoffs')
      .update({
        status: 'active',
        problem_id: problem.id,
        problem_title: problem.title,
        started_at: new Date().toISOString()
      })
      .eq('id', standoffId)

    if (error) {
      console.error('Error starting standoff:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error starting standoff:', error)
    return false
  }
}

/**
 * Submit solution for a team member
 */
export async function submitStandoffSolution(
  standoffId: string,
  userId: string,
  solution: string,
  score: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { data: standoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (!standoff) return false

    // Determine which team the user belongs to
    const team1Members = [
      standoff.team1_leader,
      standoff.team1_member2,
      standoff.team1_member3
    ].filter(Boolean)

    const isTeam1 = team1Members.includes(userId)
    const isTeam2 = !isTeam1 && [
      standoff.team2_leader,
      standoff.team2_member2,
      standoff.team2_member3
    ].filter(Boolean).includes(userId)

    if (!isTeam1 && !isTeam2) return false

    // Update team score (use best score from team)
    const updateData: any = {}
    if (isTeam1) {
      updateData.team1_score = Math.max(standoff.team1_score || 0, score)
    } else {
      updateData.team2_score = Math.max(standoff.team2_score || 0, score)
    }

    await supabase
      .from('standoffs')
      .update(updateData)
      .eq('id', standoffId)

    // Check if standoff should be completed (both teams have submitted)
    const { data: updatedStandoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (updatedStandoff && updatedStandoff.team1_score > 0 && updatedStandoff.team2_score > 0) {
      await completeStandoff(standoffId)
    }

    return true
  } catch (error) {
    console.error('Error submitting standoff solution:', error)
    return false
  }
}

/**
 * Complete a standoff and determine winner
 */
async function completeStandoff(standoffId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    const { data: standoff } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (!standoff) return

    let winnerTeam: number | null = null
    if (standoff.team1_score > standoff.team2_score) {
      winnerTeam = 1
    } else if (standoff.team2_score > standoff.team1_score) {
      winnerTeam = 2
    }
    // If tie, no winner

    await supabase
      .from('standoffs')
      .update({
        status: 'completed',
        winner_team: winnerTeam,
        ended_at: new Date().toISOString()
      })
      .eq('id', standoffId)
  } catch (error) {
    console.error('Error completing standoff:', error)
  }
}

/**
 * Get standoff by ID
 */
export async function getStandoffById(standoffId: string): Promise<Standoff | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('standoffs')
      .select('*')
      .eq('id', standoffId)
      .single()

    if (error || !data) {
      console.error('Error getting standoff:', error)
      return null
    }

    return convertStandoffFromDB(data)
  } catch (error) {
    console.error('Error getting standoff:', error)
    return null
  }
}

/**
 * Get active standoffs for a user
 */
export async function getActiveStandoffs(userId: string): Promise<Standoff[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('standoffs')
      .select('*')
      .or(`team1_leader.eq.${userId},team1_member2.eq.${userId},team1_member3.eq.${userId},team2_leader.eq.${userId},team2_member2.eq.${userId},team2_member3.eq.${userId}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error getting active standoffs:', error)
      return []
    }

    return data.map(convertStandoffFromDB)
  } catch (error) {
    console.error('Error getting active standoffs:', error)
    return []
  }
}

/**
 * Get standoff history for a user
 */
export async function getStandoffHistory(userId: string): Promise<Standoff[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('standoffs')
      .select('*')
      .or(`team1_leader.eq.${userId},team1_member2.eq.${userId},team1_member3.eq.${userId},team2_leader.eq.${userId},team2_member2.eq.${userId},team2_member3.eq.${userId}`)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) {
      console.error('Error getting standoff history:', error)
      return []
    }

    return data.map(convertStandoffFromDB)
  } catch (error) {
    console.error('Error getting standoff history:', error)
    return []
  }
}

// Helper functions
function convertStandoffFromDB(db: any): Standoff {
  const team1 = [
    db.team1_leader,
    db.team1_member2,
    db.team1_member3
  ].filter(Boolean)

  const team2 = [
    db.team2_leader,
    db.team2_member2,
    db.team2_member3
  ].filter(Boolean)

  const problem: ContestProblem = {
    id: db.problem_id || '',
    title: db.problem_title || 'Standoff Problem',
    difficulty: 'Medium',
    points: 100,
    solvedBy: 0
  }

  return {
    id: db.id,
    team1,
    team2,
    team3: [], // Not used in current schema
    status: db.status as DuelStatus,
    domain: db.domain || 'placement', // Default to placement if not set
    problem,
    team1Solutions: {},
    team2Solutions: {},
    team3Solutions: {},
    winnerTeam: db.winner_team || undefined,
    startTime: db.started_at ? new Date(db.started_at) : new Date(),
    endTime: db.ended_at ? new Date(db.ended_at) : undefined,
    xpReward: db.xp_reward || 100
  }
}




