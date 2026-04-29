import { NextRequest, NextResponse } from 'next/server'
import { createContest, addContestProblem } from '@/lib/database/contests'
import { generateCodingProblem } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const contests = []

    // Contest 1: City Level
    const contest1Id = await createContest({
      title: 'City Coding Championship',
      description: 'Compete with coders in your city! Show your skills and climb the leaderboard.',
      level: 'city',
      domain: 'placement',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      xpMultiplier: 1.5,
      maxParticipants: 500
    })

    if (contest1Id) {
      // Add problems
      try {
        const problem1 = await generateCodingProblem('Computer Science', 'Algorithms', 'Basic')
        await addContestProblem(contest1Id, {
          title: problem1.title,
          description: problem1.description,
          difficulty: 'Basic',
          points: 50,
          testCases: problem1.testCases
        })

        const problem2 = await generateCodingProblem('Computer Science', 'Algorithms', 'Medium')
        await addContestProblem(contest1Id, {
          title: problem2.title,
          description: problem2.description,
          difficulty: 'Medium',
          points: 100,
          testCases: problem2.testCases
        })
      } catch (error) {
        console.error('Error adding problems to contest 1:', error)
      }
      contests.push({ id: contest1Id, title: 'City Coding Championship' })
    }

    // Contest 2: State Level
    const contest2Id = await createContest({
      title: 'State Level Challenge',
      description: 'State-wide coding competition. Prove you are the best coder in your state!',
      level: 'state',
      domain: 'placement',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Starts in 3 days
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
      xpMultiplier: 2.0,
      maxParticipants: 1000
    })

    if (contest2Id) {
      try {
        const problem1 = await generateCodingProblem('Computer Science', 'Data Structures', 'Medium')
        await addContestProblem(contest2Id, {
          title: problem1.title,
          description: problem1.description,
          difficulty: 'Medium',
          points: 100,
          testCases: problem1.testCases
        })

        const problem2 = await generateCodingProblem('Computer Science', 'Algorithms', 'Advanced')
        await addContestProblem(contest2Id, {
          title: problem2.title,
          description: problem2.description,
          difficulty: 'Advanced',
          points: 200,
          testCases: problem2.testCases
        })
      } catch (error) {
        console.error('Error adding problems to contest 2:', error)
      }
      contests.push({ id: contest2Id, title: 'State Level Challenge' })
    }

    // Contest 3: National Level
    const contest3Id = await createContest({
      title: 'National Coding Olympiad',
      description: 'The ultimate coding challenge! Compete with the best coders nationwide.',
      level: 'national',
      domain: 'placement',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Starts in 30 days
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // Ends in 37 days
      xpMultiplier: 3.0,
      maxParticipants: 5000
    })

    if (contest3Id) {
      try {
        const problem1 = await generateCodingProblem('Computer Science', 'Algorithms', 'Advanced')
        await addContestProblem(contest3Id, {
          title: problem1.title,
          description: problem1.description,
          difficulty: 'Advanced',
          points: 200,
          testCases: problem1.testCases
        })
      } catch (error) {
        console.error('Error adding problems to contest 3:', error)
      }
      contests.push({ id: contest3Id, title: 'National Coding Olympiad' })
    }

    return NextResponse.json({
      success: true,
      message: `Created ${contests.length} contests`,
      contests
    })
  } catch (error: any) {
    console.error('Error seeding contests:', error)
    return NextResponse.json(
      { error: 'Failed to seed contests', details: error.message },
      { status: 500 }
    )
  }
}




