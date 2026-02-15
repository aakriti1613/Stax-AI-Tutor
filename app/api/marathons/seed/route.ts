import { NextRequest, NextResponse } from 'next/server'
import { getMarathons, createMarathon } from '@/lib/database/marathons'

export async function GET(request: NextRequest) {
  try {
    // Check if marathons already exist
    const existingMarathons = await getMarathons()
    
    if (existingMarathons.length >= 3) {
      return NextResponse.json({
        success: true,
        message: `Already have ${existingMarathons.length} marathons`,
        marathons: existingMarathons.map(m => ({ id: m.id, title: m.title }))
      })
    }

    const marathons = []

    // Marathon 1: 24-Hour Challenge
    const marathon1Id = await createMarathon({
      title: '24-Hour Coding Marathon',
      description: 'Code for 24 hours straight and earn massive XP! Push your limits and show your dedication.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      duration: 24,
      xpMultiplier: 3.0
    })

    if (marathon1Id) {
      marathons.push({ id: marathon1Id, title: '24-Hour Coding Marathon' })
    }

    // Marathon 2: Weekend Warrior
    const marathon2Id = await createMarathon({
      title: 'Weekend Warrior',
      description: '48-hour weekend coding challenge. Perfect for those who love coding on weekends!',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Starts in 2 days
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Ends in 4 days
      duration: 48,
      xpMultiplier: 2.5
    })

    if (marathon2Id) {
      marathons.push({ id: marathon2Id, title: 'Weekend Warrior' })
    }

    // Marathon 3: Weekly Challenge
    const marathon3Id = await createMarathon({
      title: 'Weekly Coding Challenge',
      description: 'A week-long coding marathon. Solve problems throughout the week and climb the leaderboard!',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Starts in 7 days
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Ends in 14 days
      duration: 168, // 7 days = 168 hours
      xpMultiplier: 2.0
    })

    if (marathon3Id) {
      marathons.push({ id: marathon3Id, title: 'Weekly Coding Challenge' })
    }

    return NextResponse.json({
      success: true,
      message: `Created ${marathons.length} marathons`,
      marathons
    })
  } catch (error: any) {
    console.error('Error seeding marathons:', error)
    return NextResponse.json(
      { error: 'Failed to seed marathons', details: error.message },
      { status: 500 }
    )
  }
}


