import { NextRequest, NextResponse } from 'next/server'
import { getMarathonById } from '@/lib/database/marathons'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marathon = await getMarathonById(params.id)

    if (!marathon) {
      return NextResponse.json(
        { error: 'Marathon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ marathon })
  } catch (error: any) {
    console.error('Error getting marathon:', error)
    return NextResponse.json(
      { error: 'Failed to get marathon' },
      { status: 500 }
    )
  }
}




