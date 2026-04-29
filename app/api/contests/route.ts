import { NextRequest, NextResponse } from 'next/server'
import { getContests, createContest } from '@/lib/database/contests'
import { ContestLevel } from '@/lib/types/contests'
import { Domain } from '@/lib/subjects'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain') as Domain | null
    const contests = await getContests(domain || undefined)
    return NextResponse.json({ contests })
  } catch (error: any) {
    // Log error but don't expose details to client
    const errorMessage = error?.message || 'Unknown error'
    if (!errorMessage.includes('ENOTFOUND') && !errorMessage.includes('fetch failed')) {
      console.error('Error getting contests:', errorMessage)
    }
    // Return empty array instead of error to prevent UI breakage
    return NextResponse.json({ contests: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      level,
      domain,
      startDate,
      endDate,
      xpMultiplier,
      maxParticipants
    } = body

    if (!title || !description || !level || !domain || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields (title, description, level, domain, startDate, endDate)' },
        { status: 400 }
      )
    }

    const contestId = await createContest({
      title,
      description,
      level: level as ContestLevel,
      domain: domain as Domain,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      xpMultiplier: xpMultiplier || 1.5,
      maxParticipants
    })

    if (!contestId) {
      return NextResponse.json(
        { error: 'Failed to create contest. Check Supabase connection.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contestId })
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    if (!errorMessage.includes('ENOTFOUND') && !errorMessage.includes('fetch failed')) {
      console.error('Error creating contest:', errorMessage)
    }
    return NextResponse.json(
      { error: 'Failed to create contest. Check Supabase connection.' },
      { status: 500 }
    )
  }
}




