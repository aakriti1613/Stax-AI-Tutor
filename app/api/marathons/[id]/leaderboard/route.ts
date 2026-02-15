import { NextRequest, NextResponse } from 'next/server'
import { getMarathonLeaderboard } from '@/lib/database/marathons'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaderboard = await getMarathonLeaderboard(params.id)
    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    console.error('Error getting leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}


