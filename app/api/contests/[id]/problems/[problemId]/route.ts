import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; problemId: string } }
) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('contest_problems')
      .select('*')
      .eq('id', params.problemId)
      .eq('contest_id', params.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    const testCases = data.test_cases || {}
    
    return NextResponse.json({
      problem: {
        id: data.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        points: data.points,
        examples: testCases.examples || [],
        constraints: testCases.constraints || [],
        testCases: testCases.testCases || testCases.examples || [] // Use examples as test cases if testCases not available
      }
    })
  } catch (error: any) {
    console.error('Error getting problem:', error)
    return NextResponse.json(
      { error: 'Failed to get problem' },
      { status: 500 }
    )
  }
}

