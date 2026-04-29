import { NextRequest, NextResponse } from 'next/server'
import { getDuelById } from '@/lib/database/duels'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const duel = await getDuelById(params.id)

    if (!duel) {
      return NextResponse.json(
        { error: 'Duel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ duel })
  } catch (error: any) {
    console.error('Error getting duel:', error)
    return NextResponse.json(
      { error: 'Failed to get duel' },
      { status: 500 }
    )
  }
}




