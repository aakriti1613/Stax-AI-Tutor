'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Clock, Zap, MapPin, Award } from 'lucide-react'
import { Contest, ContestLevel } from '@/lib/types/contests'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ContestLevel | 'all'>('all')

  useEffect(() => {
    loadContests()
    // Auto-seed if no contests exist
    const checkAndSeed = async () => {
      const response = await axios.get('/api/contests')
      if (response.data.contests.length === 0) {
        try {
          await axios.get('/api/contests/seed')
          loadContests()
        } catch (error) {
          console.error('Error seeding contests:', error)
        }
      }
    }
    checkAndSeed()
    // Polling disabled - replication is off
  }, [])

  const loadContests = async () => {
    try {
      const response = await axios.get('/api/contests')
      setContests(response.data.contests || [])
    } catch (error: any) {
      console.error('Error loading contests:', error)
      toast.error('Failed to load contests')
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: ContestLevel) => {
    switch (level) {
      case 'city':
        return 'text-neon-green'
      case 'state':
        return 'text-neon-cyan'
      case 'national':
        return 'text-neon-purple'
    }
  }

  const getLevelBg = (level: ContestLevel) => {
    switch (level) {
      case 'city':
        return 'bg-neon-green/20 border-neon-green'
      case 'state':
        return 'bg-neon-cyan/20 border-neon-cyan'
      case 'national':
        return 'bg-neon-purple/20 border-neon-purple'
    }
  }

  const filteredContests = filter === 'all' 
    ? contests 
    : contests.filter(c => c.level === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading contests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold neon-text mb-4">Contests</h1>
          <p className="text-xl text-gray-400">Compete and climb the leaderboards!</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-neon-cyan text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('city')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              filter === 'city'
                ? 'bg-neon-green text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            City
          </button>
          <button
            onClick={() => setFilter('state')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              filter === 'state'
                ? 'bg-neon-cyan text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            State
          </button>
          <button
            onClick={() => setFilter('national')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              filter === 'national'
                ? 'bg-neon-purple text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            National
          </button>
        </div>

        {/* Contests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest, idx) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelBg(contest.level)} ${getLevelColor(contest.level)}`}>
                  {contest.level.toUpperCase()}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  contest.status === 'active' ? 'bg-neon-green/20 text-neon-green' :
                  contest.status === 'upcoming' ? 'bg-neon-cyan/20 text-neon-cyan' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {contest.status.toUpperCase()}
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">{contest.title}</h2>
              <p className="text-gray-400 mb-4">{contest.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-neon-cyan" />
                  <span className="text-gray-300">{contest.participants} / {contest.maxParticipants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-neon-yellow" />
                  <span className="text-gray-300">{contest.xpMultiplier}x XP Multiplier</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-neon-purple" />
                  <span className="text-gray-300">
                    {contest.status === 'active' ? 'Ends in ' : 'Starts in '}
                    {Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>

              <Link href={`/contests/${contest.id}`}>
                <button className="btn-primary w-full">
                  {contest.status === 'active' ? 'Join Contest' : 'View Details'}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}










