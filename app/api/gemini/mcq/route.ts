import { NextRequest, NextResponse } from 'next/server'
import { generateMCQs } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  let concept = 'this concept'
  let unit = 'this unit'
  
  try {
    const body = await request.json()
    const subject = body.subject
    unit = body.unit || unit
    concept = body.concept || concept

    if (!subject || !body.unit || !body.concept) {
      return NextResponse.json(
        { error: 'Subject, unit, and concept are required' },
        { status: 400 }
      )
    }

    const mcqs = await generateMCQs(subject, unit, concept)

    return NextResponse.json({ mcqs })
  } catch (error: any) {
    console.error('Error generating MCQs:', error)
    
    // Return error - component will handle fallback
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate MCQs. Please check your Gemini API key and try again.',
        mcqs: []
      },
      { status: 500 }
    )
  }
}


