import { NextRequest, NextResponse } from 'next/server'
// import { generateCodingProblem } from '@/lib/gemini' // Disabled - using database only
import { getCodingProblem } from '@/lib/codingProblemDatabase'

export async function POST(request: NextRequest) {
  let subject = 'this subject'
  let unit = 'this unit'
  let subtopic = 'intro'
  let difficulty: 'Basic' | 'Medium' | 'Advanced' = 'Basic'
  
  try {
    const body = await request.json()
    subject = body.subject || subject
    unit = body.unit || unit
    subtopic = body.subtopic || 'intro'
    difficulty = body.difficulty || difficulty

    if (!body.subject || !body.unit || !body.difficulty) {
      return NextResponse.json(
        { error: 'Subject, unit, and difficulty are required' },
        { status: 400 }
      )
    }

    if (!['Basic', 'Medium', 'Advanced'].includes(body.difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be Basic, Medium, or Advanced' },
        { status: 400 }
      )
    }

    // Try database first (NO GEMINI)
    console.log('🔍 Checking coding problem database for:', subject, unit, subtopic, difficulty)
    const dbProblem = getCodingProblem(subject, unit, subtopic, difficulty)
    
    if (dbProblem) {
      console.log('✅ Found coding problem in database! Using DATABASE (NOT Gemini)')
      console.log('Problem title:', dbProblem.title)
      return NextResponse.json({ problem: dbProblem })
    }

    // If not in database, return error - NO GEMINI FALLBACK
    console.log('❌ Coding problem not found in database')
    return NextResponse.json(
      { 
        error: `Coding problem not available in database for "${subject}" - "${unit}" - "${subtopic}" - "${difficulty}". Database content is currently only available for Arrays theory problems.`,
        problem: null,
        note: 'Using database only - Gemini API is disabled'
      },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Error generating coding problem:', error)
    
    // Return error - component will handle fallback
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate coding problem. Please check your Gemini API key and try again.',
        problem: null
      },
      { status: 500 }
    )
  }
}


