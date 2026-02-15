import { NextRequest, NextResponse } from 'next/server'
import { addContestProblem } from '@/lib/database/contests'
import { generateCodingProblem } from '@/lib/gemini'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { difficulty, subject, unit, generate } = body

    let problemData

    if (generate) {
      // Generate problem using Gemini
      const generated = await generateCodingProblem(
        subject || 'Computer Science',
        unit || 'Algorithms',
        difficulty || 'Medium'
      )

      problemData = {
        title: generated.title,
        description: generated.description,
        difficulty: difficulty || 'Medium',
        points: difficulty === 'Basic' ? 50 : difficulty === 'Medium' ? 100 : 200,
        testCases: {
          examples: generated.examples || [],
          constraints: generated.constraints || [],
          testCases: generated.testCases || []
        }
      }
    } else {
      // Use provided problem data
      const { title, description, points, testCases } = body
      problemData = {
        title,
        description,
        difficulty: difficulty || 'Medium',
        points: points || 100,
        testCases: testCases || []
      }
    }

    const problemId = await addContestProblem(params.id, problemData)

    if (!problemId) {
      return NextResponse.json(
        { error: 'Failed to add problem' },
        { status: 500 }
      )
    }

    return NextResponse.json({ problemId, problem: problemData })
  } catch (error: any) {
    console.error('Error adding problem:', error)
    return NextResponse.json(
      { error: 'Failed to add problem' },
      { status: 500 }
    )
  }
}

