'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Trophy, Award, Target, TrendingUp, Clock, Flame, Star } from 'lucide-react'
import { UserProfile, UserStats } from '@/lib/types/profile'
import { checkAndAddArraysBadge } from '@/lib/badges'
import { useUserStats } from '@/lib/hooks/useDatabase'
import { syncProfileWithDatabase } from '@/lib/database/profileSync'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Get userId from localStorage or generate one (client-side only)
  useEffect(() => {
    const getUserId = async () => {
      if (typeof window === 'undefined') return
      
      const saved = localStorage.getItem('userId')
      const localUserId = saved || `user-${Date.now()}`
      
      if (!saved) {
        localStorage.setItem('userId', localUserId)
      }
      
      // Ensure user exists in database
      try {
        const { ensureUserExists } = await import('@/lib/database/userManagement')
        const dbUserId = await ensureUserExists()
        setUserId(dbUserId)
      } catch (error) {
        console.error('Error ensuring user exists:', error)
        setUserId(localUserId)
      }
    }
    
    getUserId()
  }, [])

  const { stats: dbStats, loading: statsLoading } = useUserStats(userId)

  useEffect(() => {
    if (!userId) return
    // Load profile from localStorage and sync with database
    loadProfile()
  }, [dbStats, userId])

  // Check for new badges periodically
  useEffect(() => {
    if (!profile) return
    
    const interval = setInterval(() => {
      const updatedProfile = checkAndAddArraysBadge(profile)
      if (updatedProfile.badges.length !== profile.badges.length) {
        // New badge added, update profile
        setProfile(updatedProfile)
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      }
    }, 3000) // Check every 3 seconds
    
    return () => clearInterval(interval)
  }, [profile])

  const loadProfile = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      
      // Load badges from database
      const { getUserBadgesFromDatabase, syncBadgesToDatabase } = await import('@/lib/database/badges')
      const dbBadges = await getUserBadgesFromDatabase(userId)
      
      // Try to load from localStorage first
      const savedProfile = localStorage.getItem('userProfile')
      let profileData: UserProfile
      
      if (savedProfile) {
        profileData = JSON.parse(savedProfile)
        // Merge database badges with local badges
        const badgeMap = new Map(dbBadges.map(b => [b.id, b]))
        profileData.badges.forEach(b => badgeMap.set(b.id, b))
        profileData.badges = Array.from(badgeMap.values())
      } else {
        // Create default profile
        profileData = {
          id: userId,
          username: 'Coder',
          displayName: 'Code Master',
          totalXP: 0,
          level: 1,
          rank: 999,
          badges: dbBadges,
          stats: {
            problemsSolved: 0,
            contestsWon: 0,
            duelsWon: 0,
            duelsLost: 0,
            marathonsCompleted: 0,
            averageTime: 0,
            longestStreak: 0,
            currentStreak: 0,
            totalTimeSpent: 0,
          },
          mastery: [],
          achievements: [],
          createdAt: new Date(),
          lastActive: new Date(),
        }
      }

      // Sync badges to database
      await syncBadgesToDatabase(userId, profileData.badges)

      // Sync with database if available
      try {
        profileData = await syncProfileWithDatabase(userId, profileData)
      } catch (error) {
        console.warn('Database sync failed, using local data:', error)
      }

      // Update with real-time database stats if available
      if (dbStats) {
        profileData.totalXP = dbStats.total_xp
        profileData.level = dbStats.level
        profileData.rank = dbStats.rank
        profileData.stats = {
          problemsSolved: dbStats.problems_solved,
          contestsWon: dbStats.contests_won,
          duelsWon: dbStats.duels_won,
          duelsLost: dbStats.duels_lost,
          marathonsCompleted: dbStats.marathons_completed,
          averageTime: dbStats.average_time_per_problem,
          longestStreak: dbStats.longest_streak,
          currentStreak: dbStats.current_streak,
          totalTimeSpent: profileData.stats.totalTimeSpent, // Keep from sync
        }
        if (dbStats.last_activity_date) {
          profileData.lastActive = new Date(dbStats.last_activity_date)
        }
      }

      // Set fake data for demo
      profileData.stats.problemsSolved = 10
      profileData.stats.currentStreak = 5
      profileData.stats.averageTime = 14
      profileData.stats.contestsWon = 1
      
      // Add Arrays badge if not already present
      const hasArraysBadge = profileData.badges.some((b: any) => b.id === 'arrays-master')
      if (!hasArraysBadge) {
        profileData.badges.push({
          id: 'arrays-master',
          name: 'Arrays Master',
          description: 'Completed all phases of the Arrays unit',
          icon: '🔢',
          earnedAt: new Date(),
          rarity: 'epic'
        })
      }

      // Check and add Arrays badge if unit is completed
      profileData = checkAndAddArraysBadge(profileData)
      
      // Sync new badges to database
      if (profileData.badges.length > (savedProfile ? JSON.parse(savedProfile).badges?.length || 0 : 0)) {
        await syncBadgesToDatabase(userId, profileData.badges)
      }
      
      // Save updated profile
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      setProfile(profileData)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || statsLoading || !profile || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  const levelProgress = (profile.totalXP % 1000) / 10 // Assuming 1000 XP per level
  const nextLevelXP = 1000 - (profile.totalXP % 1000)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-6xl font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-neon-green rounded-full p-2 border-4 border-dark-bg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold neon-text mb-2">{profile.displayName}</h1>
              <p className="text-gray-400 mb-4">@{profile.username}</p>
              {profile.bio && <p className="text-gray-300">{profile.bio}</p>}
              
              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Level {profile.level}</span>
                  <span className="text-sm text-neon-cyan">{nextLevelXP} XP to Level {profile.level + 1}</span>
                </div>
                <div className="w-full bg-dark-card rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-neon-cyan mb-2">{profile.totalXP}</div>
              <div className="text-gray-400">Total XP</div>
              <div className="mt-4 text-2xl font-bold text-neon-purple">#{profile.rank}</div>
              <div className="text-gray-400">Global Rank</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon-green/20 rounded-lg">
                <Target className="w-8 h-8 text-neon-green" />
              </div>
              <div>
                <div className="text-3xl font-bold text-neon-green">{profile.stats.problemsSolved}</div>
                <div className="text-sm text-gray-400">Problems Solved</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon-purple/20 rounded-lg">
                <Trophy className="w-8 h-8 text-neon-purple" />
              </div>
              <div>
                <div className="text-3xl font-bold text-neon-purple">{profile.stats.contestsWon}</div>
                <div className="text-sm text-gray-400">Contests Won</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon-cyan/20 rounded-lg">
                <Flame className="w-8 h-8 text-neon-cyan" />
              </div>
              <div>
                <div className="text-3xl font-bold text-neon-cyan">{profile.stats.currentStreak}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-neon-pink/20 rounded-lg">
                <Clock className="w-8 h-8 text-neon-pink" />
              </div>
              <div>
                <div className="text-3xl font-bold text-neon-pink">{Math.round(profile.stats.averageTime)}</div>
                <div className="text-sm text-gray-400">Avg Time (min)</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-neon-yellow" />
            Badges
            {profile.badges.length > 0 && (
              <span className="text-sm text-gray-400 ml-2">({profile.badges.length})</span>
            )}
          </h2>
          {profile.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {profile.badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.1 }}
                  className="text-center p-4 bg-dark-card rounded-lg border border-gray-700 hover:border-neon-cyan transition-colors relative"
                >
                  {badge.rarity === 'epic' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-purple rounded-full animate-pulse" />
                  )}
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-sm font-bold">{badge.name}</div>
                  <div className={`text-xs mt-1 ${
                    badge.rarity === 'epic' ? 'text-neon-purple' :
                    badge.rarity === 'rare' ? 'text-neon-cyan' :
                    badge.rarity === 'legendary' ? 'text-neon-yellow' :
                    'text-gray-400'
                  }`}>
                    {badge.rarity}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No badges earned yet. Complete units to earn badges!</p>
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        {profile.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-neon-green" />
              Achievements
            </h2>
            <div className="space-y-3">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold">{achievement.name}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                    <div className="mt-2 w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="bg-neon-cyan h-2 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {achievement.progress} / {achievement.maxProgress}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

