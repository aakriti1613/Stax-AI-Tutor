export type Subject = 'cpp' | 'java' | 'python' | 'dsa' | 'oops' | 'dbms'

export type Difficulty = 'Basic' | 'Medium' | 'Advanced'

export type Phase = 'learning' | 'mcq' | 'unlock' | 'coding'

export interface UserProgress {
  userId: string
  subject: Subject
  unitId: string
  phase: Phase
  xp: number
  completed: boolean
  mcqScore?: number
  codingProblemsSolved?: number
  lastAccessed: Date
}

export interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  badge: string
  isCurrentUser?: boolean
}







