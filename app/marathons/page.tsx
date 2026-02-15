'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, Users, Zap, Trophy } from 'lucide-react'
import { Marathon } from '@/lib/types/contests'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function MarathonsPage() {
  const [marathons, setMarathons] = useState<Marathon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarathons()
    // Auto-seed if no marathons exist
    const checkAndSeed = async () => {
      const response = await axios.get('/api/marathons')
      if (response.data.marathons.length === 0) {
        try {
          await axios.get('/api/marathons/seed')
          loadMarathons()
        } catch (error) {
          console.error('Error seeding marathons:', error)
        }
      }
    }
    checkAndSeed()
    // Polling disabled - replication is off
  }, [])

  const loadMarathons = async () => {
    try {
      const response = await axios.get('/api/marathons')
      setMarathons(response.data.marathons || [])
    } catch (error: any) {
      console.error('Error loading marathons:', error)
      toast.error('Failed to load marathons')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading marathons...</p>
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
          <h1 className="text-5xl font-bold neon-text mb-4 flex items-center gap-3">
            <Flame className="w-12 h-12 text-neon-orange" />
            Coding Marathons
          </h1>
          <p className="text-xl text-gray-400">Extended coding sessions with massive XP multipliers!</p>
        </motion.div>

        {/* Marathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marathons.map((marathon, idx) => (
            <motion.div
              key={marathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  marathon.status === 'active' ? 'bg-neon-green/20 text-neon-green' :
                  marathon.status === 'upcoming' ? 'bg-neon-cyan/20 text-neon-cyan' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {marathon.status.toUpperCase()}
                </div>
                <div className="flex items-center gap-2 text-neon-orange">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">{marathon.xpMultiplier}x XP</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">{marathon.title}</h2>
              <p className="text-gray-400 mb-4">{marathon.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-neon-purple" />
                  <span className="text-gray-300">{marathon.duration} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-neon-cyan" />
                  <span className="text-gray-300">{marathon.participants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-neon-yellow" />
                  <span className="text-gray-300">{marathon.xpMultiplier}x XP Multiplier</span>
                </div>
              </div>

              <Link href={`/marathons/${marathon.id}`}>
                <button className="btn-primary w-full">
                  {marathon.status === 'active' ? 'Join Marathon' : 'View Details'}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}










