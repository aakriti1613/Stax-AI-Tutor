import { NextRequest, NextResponse } from 'next/server'
import { joinStandoffTeam, findStandoffMatch, startStandoff } from '@/lib/database/standoffs'
import { generateCodingProblem } from '@/lib/gemini'
import { ContestProblem } from '@/lib/types/contests'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, teamNumber } = body

    if (!userId || !teamNumber) {
      return NextResponse.json(
        { error: 'User ID and team number required' },
        { status: 400 }
      )
    }

    const success = await joinStandoffTeam(params.id, userId, teamNumber as 1 | 2)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to join team' },
        { status: 500 }
      )
    }

    // Try to find a match if team is complete
    const matchId = await findStandoffMatch(params.id)

    if (matchId) {
      // Generate problem and start standoff
      const generatedProblem = await generateCodingProblem(
        'Computer Science',
        'Algorithms',
        'Medium'
      )

      const problem: ContestProblem = {
        id: `problem-${Date.now()}`,
        title: generatedProblem.title,
        difficulty: 'Medium',
        points: 100,
        solvedBy: 0
      }

      await startStandoff(matchId, problem)
    }

    return NextResponse.json({ success: true, matchId: matchId || null })
  } catch (error: any) {
    console.error('Error joining standoff team:', error)
    return NextResponse.json(
      { error: 'Failed to join team' },
      { status: 500 }
    )
  }
}


