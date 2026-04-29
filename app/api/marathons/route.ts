import { NextRequest, NextResponse } from 'next/server'
import { getMarathons, createMarathon } from '@/lib/database/marathons'
import { Domain } from '@/lib/subjects'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain') as Domain | null
    const marathons = await getMarathons(domain || undefined)
    return NextResponse.json({ marathons })
  } catch (error: any) {
    // Log error but don't expose details to client
    const errorMessage = error?.message || 'Unknown error'
    if (!errorMessage.includes('ENOTFOUND') && !errorMessage.includes('fetch failed')) {
      console.error('Error getting marathons:', errorMessage)
    }
    // Return empty array instead of error to prevent UI breakage
    return NextResponse.json({ marathons: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, domain, startDate, endDate, duration, xpMultiplier } = body

    if (!title || !description || !domain || !startDate || !endDate || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields (title, description, domain, startDate, endDate, duration)' },
        { status: 400 }
      )
    }

    const marathonId = await createMarathon({
      title,
      description,
      domain: domain as Domain,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      xpMultiplier: xpMultiplier || 2.0
    })

    if (!marathonId) {
      return NextResponse.json(
        { error: 'Failed to create marathon. Check Supabase connection.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ marathonId })
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    if (!errorMessage.includes('ENOTFOUND') && !errorMessage.includes('fetch failed')) {
      console.error('Error creating marathon:', errorMessage)
    }
    return NextResponse.json(
      { error: 'Failed to create marathon. Check Supabase connection.' },
      { status: 500 }
    )
  }
}




