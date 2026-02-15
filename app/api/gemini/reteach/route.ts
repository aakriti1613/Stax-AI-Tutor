import { NextRequest, NextResponse } from 'next/server'
import { reTeachConcept } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { concept, subject, previousExplanation } = await request.json()

    if (!concept || !subject) {
      return NextResponse.json(
        { error: 'Concept and subject are required' },
        { status: 400 }
      )
    }

    const reTeach = await reTeachConcept(concept, subject, previousExplanation || '')

    return NextResponse.json({ reTeach })
  } catch (error: any) {
    console.error('Error re-teaching concept:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to re-teach concept' },
      { status: 500 }
    )
  }
}
















