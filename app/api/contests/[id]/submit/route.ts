import { NextRequest, NextResponse } from 'next/server'
import { submitContestSolution } from '@/lib/database/contests'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { problemId, userId, code, language, status, score } = body

    if (!problemId || !userId || !code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure user exists in database and get proper UUID
    const { getOrCreateUser } = await import('@/lib/database/userManagement')
    const dbUserId = await getOrCreateUser(userId)

    const success = await submitContestSolution(
      params.id,
      problemId,
      dbUserId,
      code,
      language,
      status || 'pending',
      score || 0
    )

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit solution' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error submitting solution:', error)
    return NextResponse.json(
      { error: 'Failed to submit solution' },
      { status: 500 }
    )
  }
}

