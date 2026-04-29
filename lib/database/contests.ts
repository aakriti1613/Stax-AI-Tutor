// Database utilities for contests
import { supabase, isSupabaseConfigured, getSupabaseAdmin, logConnectionFailure } from '@/lib/supabase'
import { Contest, ContestProblem, ContestLeaderboardEntry, ContestLevel, ContestStatus } from '@/lib/types/contests'
import { Domain } from '@/lib/subjects'

export interface ContestDB {
  id: string
  title: string
  description: string
  level: ContestLevel
  status: ContestStatus
  domain: Domain
  start_date: string
  end_date: string
  xp_multiplier: number
  max_participants?: number
  created_at: string
  updated_at: string
}

export interface ContestProblemDB {
  id: string
  contest_id: string
  title: string
  description: string
  difficulty: string
  points: number
  test_cases: any
  created_at: string
}

export interface ContestParticipantDB {
  id: string
  contest_id: string
  user_id: string
  problems_solved: number
  total_score: number
  rank: number | null
  joined_at: string
}

export interface ContestSubmissionDB {
  id: string
  contest_id: string
  user_id: string
  problem_id: string
  code: string
  language: string
  status: string
  score: number
  submitted_at: string
}

/**
 * Get all contests
 * @param domain Optional domain filter
 */
export async function getContests(domain?: Domain): Promise<Contest[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    let query = supabase!
      .from('contests')
      .select('*')
    
    if (domain) {
      query = query.eq('domain', domain)
    }
    
    const { data, error } = await query.order('start_date', { ascending: false })

    if (error) {
      // Check if it's a network/DNS error
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Contests unavailable. Check SUPABASE_URL in .env file.')
        return []
      }
      console.error('Error getting contests:', error)
      return []
    }

    // Get participant counts
    const contestsWithParticipants = await Promise.all(
      (data || []).map(async (contest) => {
        try {
          const { count } = await supabase!
            .from('contest_participants')
            .select('*', { count: 'exact', head: true })
            .eq('contest_id', contest.id)

          return {
            ...contest,
            participants: count || 0
          }
        } catch (err) {
          // If participant count fails, just return contest with 0 participants
          return {
            ...contest,
            participants: 0
          }
        }
      })
    )

    return contestsWithParticipants.map(convertContestFromDB)
  } catch (error: any) {
    // Handle network/DNS errors gracefully
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND') || error?.code === 'ENOTFOUND') {
      logConnectionFailure('Supabase connection failed. Contests unavailable. Check SUPABASE_URL in .env file.')
      return []
    }
    console.error('Error getting contests:', error)
    return []
  }
}

/**
 * Get contest by ID
 */
export async function getContestById(contestId: string): Promise<Contest | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('id', contestId)
      .single()

    if (error || !data) {
      console.error('Error getting contest:', error)
      return null
    }

    // Get participant count
    const { count } = await supabase
      .from('contest_participants')
      .select('*', { count: 'exact', head: true })
      .eq('contest_id', contestId)

    // Get problems
    const { data: problems } = await supabase
      .from('contest_problems')
      .select('*')
      .eq('contest_id', contestId)

    // Get leaderboard
    const leaderboard = await getContestLeaderboard(contestId)

    return {
      ...convertContestFromDB({ ...data, participants: count || 0 }),
      problems: (problems || []).map(convertProblemFromDB),
      leaderboard
    }
  } catch (error) {
    console.error('Error getting contest:', error)
    return null
  }
}

/**
 * Join a contest
 */
export async function joinContest(contestId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    // Check if user is already a participant
    const { data: existing } = await supabase
      .from('contest_participants')
      .select('id')
      .eq('contest_id', contestId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // User already joined, return true
      return true
    }

    const { error } = await supabase
      .from('contest_participants')
      .insert({
        contest_id: contestId,
        user_id: userId,
        problems_solved: 0,
        total_score: 0
      })

    if (error) {
      // If it's a duplicate key error, user already joined
      if (error.code === '23505') {
        return true
      }
      console.error('Error joining contest:', error)
      return false
    }

    return true
  } catch (error: any) {
    // Handle duplicate key error gracefully
    if (error.code === '23505') {
      return true
    }
    console.error('Error joining contest:', error)
    return false
  }
}

/**
 * Submit solution to contest problem
 */
export async function submitContestSolution(
  contestId: string,
  problemId: string,
  userId: string,
  code: string,
  language: string,
  status: string,
  score: number
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from('contest_submissions')
      .insert({
        contest_id: contestId,
        problem_id: problemId,
        user_id: userId,
        code,
        language,
        status,
        score
      })

    if (error) {
      console.error('Error submitting solution:', error)
      return false
    }

    // Update participant stats
    await updateParticipantStats(contestId, userId)

    return true
  } catch (error) {
    console.error('Error submitting solution:', error)
    return false
  }
}

/**
 * Get contest leaderboard
 */
export async function getContestLeaderboard(contestId: string): Promise<ContestLeaderboardEntry[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('contest_participants')
      .select(`
        *,
        users:user_id (
          id,
          username,
          display_name
        )
      `)
      .eq('contest_id', contestId)
      .order('total_score', { ascending: false })
      .order('problems_solved', { ascending: false })
      .limit(100)

    if (error || !data) {
      console.error('Error getting leaderboard:', error)
      return []
    }

    return data.map((entry: any, index: number) => ({
      rank: index + 1,
      userId: entry.user_id,
      username: entry.users?.username || entry.users?.display_name || 'Anonymous',
      xp: entry.total_score,
      problemsSolved: entry.problems_solved,
      totalTime: 0, // Not stored in database
      badge: getRankBadge(index + 1)
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

/**
 * Create a new contest (admin function)
 */
export async function createContest(contest: {
  title: string
  description: string
  level: ContestLevel
  domain: Domain
  startDate: Date
  endDate: Date
  xpMultiplier: number
  maxParticipants?: number
}): Promise<string | null> {
  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return null
    }

    const { data, error } = await admin
      .from('contests')
      .insert({
        title: contest.title,
        description: contest.description,
        level: contest.level,
        domain: contest.domain,
        status: 'upcoming',
        start_date: contest.startDate.toISOString(),
        end_date: contest.endDate.toISOString(),
        xp_multiplier: contest.xpMultiplier,
        max_participants: contest.maxParticipants
      })
      .select('id')
      .single()

    if (error || !data) {
      // Check if it's a network/DNS error
      if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Cannot create contest. Check SUPABASE_URL in .env file.')
        return null
      }
      console.error('Error creating contest:', error)
      return null
    }

    return data.id
  } catch (error: any) {
    // Handle network/DNS errors gracefully
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND') || error?.code === 'ENOTFOUND') {
      logConnectionFailure('Supabase connection failed. Cannot create contest. Check SUPABASE_URL in .env file.')
      return null
    }
    console.error('Error creating contest:', error)
    return null
  }
}

/**
 * Add problem to contest
 */
export async function addContestProblem(
  contestId: string,
  problem: {
    title: string
    description: string
    difficulty: string
    points: number
    testCases: any
  }
): Promise<string | null> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return null
  }

  try {
    const { data, error } = await admin
      .from('contest_problems')
      .insert({
        contest_id: contestId,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        points: problem.points,
        test_cases: problem.testCases
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error adding problem:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error adding problem:', error)
    return null
  }
}

// Helper functions
function convertContestFromDB(db: any): Contest {
  const now = new Date()
  const startDate = new Date(db.start_date)
  const endDate = new Date(db.end_date)

  let status: ContestStatus = 'upcoming'
  if (now >= startDate && now <= endDate) {
    status = 'active'
  } else if (now > endDate) {
    status = 'ended'
  }

  return {
    id: db.id,
    title: db.title,
    description: db.description,
    level: db.level,
    status,
    domain: db.domain || 'placement', // Default to placement if not set
    startDate,
    endDate,
    xpMultiplier: db.xp_multiplier,
    participants: db.participants || 0,
    maxParticipants: db.max_participants,
    problems: [],
    leaderboard: []
  }
}

function convertProblemFromDB(db: any): ContestProblem {
  return {
    id: db.id,
    title: db.title,
    difficulty: db.difficulty as 'Basic' | 'Medium' | 'Advanced',
    points: db.points,
    solvedBy: 0 // Will be calculated separately
  }
}

function getRankBadge(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '🏅'
}

async function updateParticipantStats(contestId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return

  try {
    // Get all accepted submissions for this user in this contest
    const { data: submissions } = await supabase
      .from('contest_submissions')
      .select('problem_id, score, submitted_at')
      .eq('contest_id', contestId)
      .eq('user_id', userId)
      .eq('status', 'accepted')

    if (!submissions || submissions.length === 0) return

    const uniqueProblems = new Set(submissions.map(s => s.problem_id))
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0)

    await supabase
      .from('contest_participants')
      .update({
        problems_solved: uniqueProblems.size,
        total_score: totalScore
      })
      .eq('contest_id', contestId)
      .eq('user_id', userId)
  } catch (error) {
    console.error('Error updating participant stats:', error)
  }
}

