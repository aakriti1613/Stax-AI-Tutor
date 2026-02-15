import { NextRequest, NextResponse } from 'next/server'
import { getContestById } from '@/lib/database/contests'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await getContestById(params.id)
    
    if (!contest) {
      return NextResponse.json(
        { error: 'Contest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ contest })
  } catch (error: any) {
    console.error('Error getting contest:', error)
    return NextResponse.json(
      { error: 'Failed to get contest' },
      { status: 500 }
    )
  }
}


