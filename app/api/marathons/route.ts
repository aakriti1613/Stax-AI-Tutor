import { NextRequest, NextResponse } from 'next/server'
import { getMarathons, createMarathon } from '@/lib/database/marathons'

export async function GET(request: NextRequest) {
  try {
    const marathons = await getMarathons()
    return NextResponse.json({ marathons })
  } catch (error: any) {
    console.error('Error getting marathons:', error)
    return NextResponse.json(
      { error: 'Failed to get marathons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, startDate, endDate, duration, xpMultiplier } = body

    if (!title || !description || !startDate || !endDate || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const marathonId = await createMarathon({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      xpMultiplier: xpMultiplier || 2.0
    })

    if (!marathonId) {
      return NextResponse.json(
        { error: 'Failed to create marathon' },
        { status: 500 }
      )
    }

    return NextResponse.json({ marathonId })
  } catch (error: any) {
    console.error('Error creating marathon:', error)
    return NextResponse.json(
      { error: 'Failed to create marathon' },
      { status: 500 }
    )
  }
}


