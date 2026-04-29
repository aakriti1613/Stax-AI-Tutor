import { NextRequest, NextResponse } from 'next/server'
import { createInterviewExperience, getInterviewExperienceById } from '@/lib/database/interviews'
import { CreateInterviewPost } from '@/lib/types/interviews'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const experience = await getInterviewExperienceById(id)
      if (!experience) {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
      }
      return NextResponse.json({ experience })
    }

    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  } catch (error: any) {
    console.error('Error getting interview experience:', error)
    return NextResponse.json({ error: 'Failed to get experience' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { authorId, ...postData } = body

    if (!authorId || !postData.title || !postData.content || !postData.domain) {
      return NextResponse.json(
        { error: 'Missing required fields (authorId, title, content, domain)' },
        { status: 400 }
      )
    }

    const post: CreateInterviewPost = {
      ...postData,
      tags: postData.tags || [],
      tips: postData.tips || [],
      rounds: postData.rounds || []
    }

    const experienceId = await createInterviewExperience(authorId, post)

    if (!experienceId) {
      return NextResponse.json(
        { error: 'Failed to create experience. Check Supabase connection.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ experienceId })
  } catch (error: any) {
    console.error('Error creating interview experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}



