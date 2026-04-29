import { NextRequest, NextResponse } from 'next/server'
import { generateReinforcementMCQ } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { concept, subject } = await request.json()

    if (!concept || !subject) {
      return NextResponse.json(
        { error: 'Concept and subject are required' },
        { status: 400 }
      )
    }

    const mcq = await generateReinforcementMCQ(concept, subject)

    return NextResponse.json({ mcq })
  } catch (error: any) {
    console.error('Error generating reinforcement MCQ:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate reinforcement MCQ' },
      { status: 500 }
    )
  }
}


















