import { NextRequest, NextResponse } from 'next/server'
import { createDuel, startDuel } from '@/lib/database/duels'
import { generateCodingProblem } from '@/lib/gemini'
import { ContestProblem } from '@/lib/types/contests'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { challengerId, opponentId, difficulty, subject, unit } = body

    if (!challengerId || !opponentId) {
      return NextResponse.json(
        { error: 'Challenger ID and Opponent ID required' },
        { status: 400 }
      )
    }

    // Generate a problem using Gemini
    const generatedProblem = await generateCodingProblem(
      subject || 'Computer Science',
      unit || 'Algorithms',
      difficulty || 'Medium'
    )

    const problem: ContestProblem = {
      id: `problem-${Date.now()}`,
      title: generatedProblem.title,
      difficulty: difficulty || 'Medium',
      points: 100,
      solvedBy: 0
    }

    // Create the duel
    const duelId = await createDuel(challengerId, opponentId, problem, 50)

    if (!duelId) {
      return NextResponse.json(
        { error: 'Failed to create duel' },
        { status: 500 }
      )
    }

    // Start the duel
    await startDuel(duelId)

    return NextResponse.json({
      duelId,
      problem: {
        ...problem,
        description: generatedProblem.description,
        examples: generatedProblem.examples,
        testCases: generatedProblem.testCases,
        constraints: generatedProblem.constraints,
        hints: generatedProblem.hints
      }
    })
  } catch (error: any) {
    console.error('Error creating duel:', error)
    return NextResponse.json(
      { error: 'Failed to create duel' },
      { status: 500 }
    )
  }
}


