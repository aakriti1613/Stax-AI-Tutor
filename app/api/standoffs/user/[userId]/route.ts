import { NextRequest, NextResponse } from 'next/server'
import { getActiveStandoffs, getStandoffHistory } from '@/lib/database/standoffs'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'active'

    let standoffs
    if (type === 'history') {
      standoffs = await getStandoffHistory(params.userId)
    } else {
      standoffs = await getActiveStandoffs(params.userId)
    }

    return NextResponse.json({ standoffs })
  } catch (error: any) {
    console.error('Error getting standoffs:', error)
    return NextResponse.json(
      { error: 'Failed to get standoffs' },
      { status: 500 }
    )
  }
}




