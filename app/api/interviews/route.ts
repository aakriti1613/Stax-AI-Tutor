import { NextRequest, NextResponse } from 'next/server'
import { getInterviewExperiences, getInterviewArticles } from '@/lib/database/interviews'
import { Domain } from '@/lib/subjects'
import { InterviewType } from '@/lib/types/interviews'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'experiences' | 'articles' | null
    const domain = searchParams.get('domain') as Domain | null
    const category = searchParams.get('category')
    const interviewType = searchParams.get('interviewType') as InterviewType | null

    if (type === 'experiences') {
      const experiences = await getInterviewExperiences(domain || undefined, interviewType || undefined)
      return NextResponse.json({ experiences })
    } else if (type === 'articles') {
      const articles = await getInterviewArticles(domain || undefined, category || undefined)
      return NextResponse.json({ articles })
    } else {
      // Return both
      const [experiences, articles] = await Promise.all([
        getInterviewExperiences(domain || undefined, interviewType || undefined),
        getInterviewArticles(domain || undefined, category || undefined)
      ])
      return NextResponse.json({ experiences, articles })
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    if (!errorMessage.includes('ENOTFOUND') && !errorMessage.includes('fetch failed')) {
      console.error('Error getting interviews:', errorMessage)
    }
    return NextResponse.json({ experiences: [], articles: [] })
  }
}



