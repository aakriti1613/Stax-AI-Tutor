import { NextRequest, NextResponse } from 'next/server'
import { getQuestionsForTopic, getRandomQuestion, type Difficulty } from '@/lib/frontendBackendQuestions'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get('subject')
    const unit = searchParams.get('unit')
    const subtopic = searchParams.get('subtopic')
    const difficulty = searchParams.get('difficulty') as Difficulty | null
    const random = searchParams.get('random') === 'true'

    if (!subject || !unit || !subtopic) {
      return NextResponse.json(
        { error: 'Subject, unit, and subtopic are required' },
        { status: 400 }
      )
    }

    if (random && difficulty) {
      const question = getRandomQuestion(subject, unit, subtopic, difficulty)
      if (!question) {
        return NextResponse.json(
          { error: `No ${difficulty} question found for ${subject} - ${unit} - ${subtopic}` },
          { status: 404 }
        )
      }
      return NextResponse.json({ question })
    }

    const questions = getQuestionsForTopic(subject, unit, subtopic, difficulty || undefined)
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: `No questions found for ${subject} - ${unit} - ${subtopic}${difficulty ? ` (${difficulty})` : ''}` },
        { status: 404 }
      )
    }

    return NextResponse.json({ questions })
  } catch (error: any) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}



