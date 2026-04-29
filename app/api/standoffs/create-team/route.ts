import { NextRequest, NextResponse } from 'next/server'
import { createStandoffTeam } from '@/lib/database/standoffs'
import { Domain } from '@/lib/subjects'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, domain } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const standoffId = await createStandoffTeam(userId, (domain || 'placement') as Domain)

    if (!standoffId) {
      return NextResponse.json(
        { error: 'Failed to create standoff team' },
        { status: 500 }
      )
    }

    return NextResponse.json({ standoffId })
  } catch (error: any) {
    console.error('Error creating standoff team:', error)
    return NextResponse.json(
      { error: 'Failed to create standoff team' },
      { status: 500 }
    )
  }
}




