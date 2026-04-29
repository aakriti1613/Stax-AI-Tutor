// Contest and Competition Types
import { Domain } from '@/lib/subjects'

export type ContestLevel = 'city' | 'state' | 'national'
export type ContestStatus = 'upcoming' | 'active' | 'ended'
export type DuelStatus = 'pending' | 'active' | 'completed'
export type MarathonStatus = 'upcoming' | 'active' | 'ended'

export interface Contest {
  id: string
  title: string
  description: string
  level: ContestLevel
  status: ContestStatus
  domain: Domain // Domain-specific contest
  startDate: Date
  endDate: Date
  xpMultiplier: number
  participants: number
  maxParticipants?: number
  problems: ContestProblem[]
  leaderboard: ContestLeaderboardEntry[]
}

export interface ContestProblem {
  id: string
  title: string
  difficulty: 'Basic' | 'Medium' | 'Advanced'
  points: number
  solvedBy: number
}

export interface ContestLeaderboardEntry {
  rank: number
  userId: string
  username: string
  xp: number
  problemsSolved: number
  totalTime: number
  badge: string
}

export interface Duel {
  id: string
  challengerId: string
  challengerName: string
  opponentId: string
  opponentName: string
  status: DuelStatus
  domain: Domain // Domain-specific duel
  problem: ContestProblem
  challengerSolution?: string
  opponentSolution?: string
  winnerId?: string
  startTime: Date
  endTime?: Date
  xpReward: number
}

export interface Standoff {
  id: string
  team1: string[]
  team2: string[]
  team3: string[]
  status: DuelStatus
  domain: Domain // Domain-specific standoff
  problem: ContestProblem
  team1Solutions: Record<string, string>
  team2Solutions: Record<string, string>
  team3Solutions: Record<string, string>
  winnerTeam?: number
  startTime: Date
  endTime?: Date
  xpReward: number
}

export interface Marathon {
  id: string
  title: string
  description: string
  status: MarathonStatus
  domain: Domain // Domain-specific marathon
  startDate: Date
  endDate: Date
  xpMultiplier: number
  duration: number // in hours
  problems: ContestProblem[]
  participants: number
  leaderboard: ContestLeaderboardEntry[]
}













