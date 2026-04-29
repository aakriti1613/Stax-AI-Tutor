import { NextRequest, NextResponse } from 'next/server'
import { createInterviewArticle, getInterviewArticleById } from '@/lib/database/interviews'
import { CreateInterviewPost } from '@/lib/types/interviews'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const article = await getInterviewArticleById(id)
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      return NextResponse.json({ article })
    }

    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  } catch (error: any) {
    console.error('Error getting interview article:', error)
    return NextResponse.json({ error: 'Failed to get article' }, { status: 500 })
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
      category: postData.category || 'general',
      excerpt: postData.excerpt || postData.content.substring(0, 200)
    }

    const articleId = await createInterviewArticle(authorId, post)

    if (!articleId) {
      return NextResponse.json(
        { error: 'Failed to create article. Check Supabase connection.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ articleId })
  } catch (error: any) {
    console.error('Error creating interview article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}



