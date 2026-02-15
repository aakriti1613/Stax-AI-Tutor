import { NextRequest, NextResponse } from 'next/server'
import { getActiveDuels, getDuelHistory } from '@/lib/database/duels'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'active'

    let duels
    if (type === 'history') {
      duels = await getDuelHistory(params.userId)
    } else {
      duels = await getActiveDuels(params.userId)
    }

    return NextResponse.json({ duels })
  } catch (error: any) {
    console.error('Error getting duels:', error)
    return NextResponse.json(
      { error: 'Failed to get duels' },
      { status: 500 }
    )
  }
}


