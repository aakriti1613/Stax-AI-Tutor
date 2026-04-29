import { NextRequest, NextResponse } from 'next/server'
import { getTheoryForSubtopic } from '@/lib/theoryDatabase'

function createFallbackTheory(subject: string, unit: string, subtopic: string) {
  const title = `${subtopic} - ${unit}`
  const overview = `Quick overview of ${subtopic} in ${unit} for ${subject}.`

  return {
    title,
    overview,
    sections: [
      {
        heading: `Understanding ${subtopic}`,
        content: `This section introduces the core idea of ${subtopic} within ${unit} for ${subject}. Focus on what the concept means, why it is used, and where it appears in real problems.`,
        codeExample: '',
        visualDescription: `Visualise ${subtopic} as part of the journey through ${unit} in ${subject}.`,
      },
      {
        heading: 'Common pitfalls',
        content:
          'Learners often get stuck on edge cases and off‑by‑one issues. Start with simple examples, then gradually move to more complex scenarios.',
        codeExample: '',
        visualDescription: 'Think of a small example and gradually scale it up.',
      },
    ],
    keyTakeaways: [
      `You know what ${subtopic} means in the context of ${unit}.`,
      'You can explain the concept in your own words.',
      'You can recognise where this concept shows up in interview questions.',
    ],
  }
}

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

    // Use static database (which generates theory on-the-fly if not found)
    const theory = getTheoryForSubtopic(subject, unit, subtopic)

    if (theory) {
      return NextResponse.json({ theory })
    }

    // This should never happen as getTheoryForSubtopic now always returns content
    const fallback = createFallbackTheory(subject, unit, subtopic)
    return NextResponse.json({
      theory: fallback,
      error: 'Using fallback theory (unexpected error).',
    })
  } catch (error: any) {
    console.error('Error generating theory:', error)
    const fallback = createFallbackTheory(subject, unit, subtopic)
    return NextResponse.json(
      {
        theory: fallback,
        error: error?.message || 'Failed to generate theory, using fallback content.',
      },
      { status: 200 }
    )
  }
}



