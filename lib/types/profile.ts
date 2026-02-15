// Profile and User Types (without authentication)

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  totalXP: number
  level: number
  rank: number
  badges: Badge[]
  stats: UserStats
  mastery: TopicMastery[]
  achievements: Achievement[]
  createdAt: Date
  lastActive: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserStats {
  problemsSolved: number
  contestsWon: number
  duelsWon: number
  duelsLost: number
  marathonsCompleted: number
  averageTime: number
  longestStreak: number
  currentStreak: number
  totalTimeSpent: number // in minutes
}

export interface TopicMastery {
  topic: string
  masteryLevel: number // 0.0 to 1.0
  problemsSolved: number
  lastPracticed: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  progress: number
  maxProgress: number
}


