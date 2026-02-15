import { NextRequest, NextResponse } from 'next/server'
// import { generateTheory } from '@/lib/gemini' // Disabled - using database only
import { getTheoryForSubtopic } from '@/lib/theoryDatabase'

export async function POST(request: NextRequest) {
  let subject = 'this subject'
  let unit = 'this topic'
  let subtopic = 'intro'
  
  try {
    const body = await request.json()
    subject = body.subject || subject
    unit = body.unit || unit
    subtopic = body.subtopic || 'intro'

    if (!body.subject || !body.unit) {
      return NextResponse.json(
        { error: 'Subject and unit are required' },
        { status: 400 }
      )
    }

    // Try database first (for arrays theory) - NO GEMINI
    console.log('🔍 Checking theory database for:', subject, unit, subtopic)
    const dbTheory = getTheoryForSubtopic(subject, unit, subtopic)
    
    if (dbTheory) {
      console.log('✅ Found theory in database! Using DATABASE (NOT Gemini)')
      console.log('Theory title:', dbTheory.title)
      console.log('Sections count:', dbTheory.sections?.length || 0)
      return NextResponse.json({ theory: dbTheory })
    }

    // If not in database, return error - NO GEMINI FALLBACK
    console.log('❌ Theory not found in database')
    console.log('Searched for:', { subject, unit, subtopic })
    console.log('Available keys:', Object.keys(require('@/lib/theoryDatabase').theoryDatabase || {}))
    
    return NextResponse.json(
      { 
        error: `Theory not available in database for "${subject}" - "${unit}" - "${subtopic}". Database content is currently only available for Arrays theory (intro subtopic).`,
        theory: null,
        note: 'Using database only - Gemini API is disabled'
      },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('❌ Error generating theory:', error)
    console.error('Error message:', error.message)
    
    // If database lookup failed, return null theory (component will handle it)
    // If Gemini API failed, return error
    const errorMessage = error.message || 'Failed to generate theory'
    
    // Check for model not found errors
    if (errorMessage.includes('No working Gemini model found') || 
        errorMessage.includes('404') || 
        errorMessage.includes('not found')) {
      return NextResponse.json(
        { 
          error: `API key issue: ${errorMessage}. Please verify your GEMINI_API_KEY in .env.local and check https://aistudio.google.com/ to see available models.`,
          theory: null,
          suggestion: 'Visit /api/gemini/list-models to see which models your API key supports'
        },
        { status: 500 }
      )
    }
    
    if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return NextResponse.json(
        { 
          error: `API key issue: ${errorMessage}. Please verify your GEMINI_API_KEY in .env.local`,
          theory: null
        },
        { status: 500 }
      )
    }
    
    // Return error with helpful message
    return NextResponse.json(
      { 
        error: errorMessage,
        theory: null,
        suggestion: 'Visit /api/gemini/list-models to test your API key'
      },
      { status: 500 }
    )
  }
}


