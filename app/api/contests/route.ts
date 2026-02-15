import { NextRequest, NextResponse } from 'next/server'
import { getContests, createContest } from '@/lib/database/contests'
import { ContestLevel } from '@/lib/types/contests'

export async function GET(request: NextRequest) {
  try {
    const contests = await getContests()
    return NextResponse.json({ contests })
  } catch (error: any) {
    console.error('Error getting contests:', error)
    return NextResponse.json(
      { error: 'Failed to get contests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      level,
      startDate,
      endDate,
      xpMultiplier,
      maxParticipants
    } = body

    if (!title || !description || !level || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const contestId = await createContest({
      title,
      description,
      level: level as ContestLevel,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      xpMultiplier: xpMultiplier || 1.5,
      maxParticipants
    })

    if (!contestId) {
      return NextResponse.json(
        { error: 'Failed to create contest' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contestId })
  } catch (error: any) {
    console.error('Error creating contest:', error)
    return NextResponse.json(
      { error: 'Failed to create contest' },
      { status: 500 }
    )
  }
}


