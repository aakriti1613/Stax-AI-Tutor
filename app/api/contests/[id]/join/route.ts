import { NextRequest, NextResponse } from 'next/server'
import { joinContest } from '@/lib/database/contests'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Ensure user exists in database and get proper UUID
    const { getOrCreateUser } = await import('@/lib/database/userManagement')
    const dbUserId = await getOrCreateUser(userId)

    const success = await joinContest(params.id, dbUserId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to join contest' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error joining contest:', error)
    return NextResponse.json(
      { error: 'Failed to join contest' },
      { status: 500 }
    )
  }
}

