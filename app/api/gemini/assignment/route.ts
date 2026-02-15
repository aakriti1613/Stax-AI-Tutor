import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalizedAssignment } from '@/lib/gemini'
import { verifyQuestionWithDeepSeek } from '@/lib/huggingface'

export async function POST(request: NextRequest) {
  let subject = 'this subject'
  let unit = 'this unit'
  let subtopic = 'intro'
  let masteryLevel = 0.5
  let performanceMetrics = {
    basicSolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    averageTime: 10,
    codeQuality: 'medium' as 'low' | 'medium' | 'high'
  }
  
  try {
    const body = await request.json()
    subject = body.subject || subject
    unit = body.unit || unit
    subtopic = body.subtopic || 'intro'
    masteryLevel = body.masteryLevel ?? masteryLevel
    performanceMetrics = body.performanceMetrics || performanceMetrics

    if (!body.subject || !body.unit) {
      return NextResponse.json(
        { error: 'Subject and unit are required' },
        { status: 400 }
      )
    }

    // Validate mastery level
    if (masteryLevel < 0 || masteryLevel > 1) {
      return NextResponse.json(
        { error: 'Mastery level must be between 0 and 1' },
        { status: 400 }
      )
    }

    console.log('📝 Generating personalized assignment...')
    console.log('Subject:', subject, 'Unit:', unit, 'Subtopic:', subtopic)
    console.log('Mastery:', masteryLevel, 'Metrics:', performanceMetrics)
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'GEMINI_API_KEY is not configured. Please add it to your .env.local file.',
          assignment: null,
          verification: null
        },
        { status: 500 }
      )
    }

    // Step 1: Generate assignment using Gemini
    let assignment
    try {
      assignment = await generatePersonalizedAssignment(
        subject,
        unit,
        subtopic,
        masteryLevel,
        performanceMetrics
      )
    } catch (geminiError: any) {
      console.error('❌ Gemini API error:', geminiError)
      
      // Check for specific API key errors
      if (geminiError.message?.includes('API key') || 
          geminiError.message?.includes('GEMINI_API_KEY') ||
          geminiError.message?.includes('401') ||
          geminiError.message?.includes('403')) {
        return NextResponse.json(
          { 
            error: `Gemini API Key Error: ${geminiError.message}. Please verify your GEMINI_API_KEY in .env.local and ensure it's valid.`,
            assignment: null,
            verification: null,
            suggestion: 'Visit https://aistudio.google.com/app/apikey to get or verify your API key'
          },
          { status: 500 }
        )
      }
      
      // Re-throw other errors
      throw geminiError
    }

    console.log('✅ Assignment generated, title:', assignment.title)

    // Step 2: Verify assignment using DeepSeek (via Hugging Face)
    console.log('🔍 Verifying assignment quality with DeepSeek...')
    const verification = await verifyQuestionWithDeepSeek(
      {
        title: assignment.title,
        description: assignment.description,
        examples: assignment.examples || [],
        testCases: assignment.testCases || [],
        constraints: assignment.constraints || [],
        difficulty: assignment.targetDifficulty || 'Medium'
      },
      subject,
      unit,
      subtopic
    )

    console.log('✅ Verification complete:', {
      verified: verification.verified,
      issues: verification.issues.length,
      suggestions: verification.suggestions.length
    })

    // Return assignment with verification results
    return NextResponse.json({
      assignment: {
        ...assignment,
        verified: verification.verified,
        verificationFeedback: verification.feedback,
        verificationIssues: verification.issues,
        verificationSuggestions: verification.suggestions
      },
      verification: verification
    })
  } catch (error: any) {
    console.error('❌ Error generating/verifying assignment:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate personalized assignment. Please check your API keys and try again.',
        assignment: null,
        verification: null
      },
      { status: 500 }
    )
  }
}

