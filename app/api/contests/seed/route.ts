import { NextRequest, NextResponse } from 'next/server'
import { getContests, createContest, addContestProblem } from '@/lib/database/contests'
import { CONTEST_PROBLEMS } from '@/lib/contestProblems'
import { Domain } from '@/lib/subjects'

export async function GET(request: NextRequest) {
  try {
    // Check if contests already exist
    const existingContests = await getContests()
    
    if (existingContests.length >= 3) {
      return NextResponse.json({
        success: true,
        message: `Already have ${existingContests.length} contests`,
        contests: existingContests.map(c => ({ id: c.id, title: c.title }))
      })
    }

    const contests = []

    // Contest 1: Placement (City)
    const contest1Id = await createContest({
      title: 'City Coding Championship',
      description: 'Compete with coders in your city! Show your skills and climb the leaderboard.',
      level: 'city',
      domain: 'placement' as Domain,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      xpMultiplier: 1.5,
      maxParticipants: 500
    })

    if (contest1Id) {
      try {
        // Add the 2 static problems
        for (const problem of CONTEST_PROBLEMS) {
          await addContestProblem(contest1Id, {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            points: problem.points,
            testCases: problem.testCases
          })
        }
      } catch (error) {
        console.error('Error adding problems to contest 1:', error)
      }
      contests.push({ id: contest1Id, title: 'City Coding Championship' })
    }

    // Contest 2: Frontend (State)
    const contest2Id = await createContest({
      title: 'State Level Challenge',
      description: 'Frontend-focused state-wide coding competition. Show your React/JS skills!',
      level: 'state',
      domain: 'frontend' as Domain,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Starts in 3 days
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
      xpMultiplier: 2.0,
      maxParticipants: 1000
    })

    if (contest2Id) {
      try {
        // Add the 2 static problems
        for (const problem of CONTEST_PROBLEMS) {
          await addContestProblem(contest2Id, {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            points: problem.points,
            testCases: problem.testCases
          })
        }
      } catch (error) {
        console.error('Error adding problems to contest 2:', error)
      }
      contests.push({ id: contest2Id, title: 'State Level Challenge' })
    }

    // Contest 3: Backend (National)
    const contest3Id = await createContest({
      title: 'National Coding Olympiad',
      description: 'The ultimate backend challenge! Compete with the best coders nationwide.',
      level: 'national',
      domain: 'backend' as Domain,
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Starts in 30 days
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // Ends in 37 days
      xpMultiplier: 3.0,
      maxParticipants: 5000
    })

    if (contest3Id) {
      try {
        // Add the 2 static problems
        for (const problem of CONTEST_PROBLEMS) {
          await addContestProblem(contest3Id, {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            points: problem.points,
            testCases: problem.testCases
          })
        }
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

