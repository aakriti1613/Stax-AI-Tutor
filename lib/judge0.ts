interface Judge0Submission {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
}

interface Judge0Response {
  token: string
}

interface Judge0Result {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  status: {
    id: number
    description: string
  }
  time: string | null
  memory: number | null
}

// Language IDs for Judge0
export const JUDGE0_LANGUAGES = {
  python: 92,      // Python 3
  cpp: 54,         // C++ (GCC 9.2.0)
  java: 91,        // Java (OpenJDK 13.0.1)
} as const

export type Judge0Language = keyof typeof JUDGE0_LANGUAGES

// Judge0 API endpoints
const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY
const JUDGE0_RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com'

/**
 * Submit code to Judge0 for execution
 */
export async function submitCode(
  code: string,
  language: Judge0Language,
  stdin?: string,
  expectedOutput?: string
): Promise<string> {
  const languageId = JUDGE0_LANGUAGES[language]

  const submission: Judge0Submission = {
    source_code: Buffer.from(code).toString('base64'),
    language_id: languageId,
  }

  if (stdin) {
    submission.stdin = Buffer.from(stdin).toString('base64')
  }

  if (expectedOutput) {
    submission.expected_output = Buffer.from(expectedOutput).toString('base64')
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Use RapidAPI if key is provided, otherwise use public endpoint
    if (JUDGE0_RAPIDAPI_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_RAPIDAPI_KEY
      headers['X-RapidAPI-Host'] = JUDGE0_RAPIDAPI_HOST
    }

    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`)
    }

    const data: Judge0Response = await response.json()
    return data.token
  } catch (error: any) {
    console.error('Error submitting code to Judge0:', error)
    throw new Error(`Failed to submit code: ${error.message}`)
  }
}

/**
 * Get execution result from Judge0
 */
export async function getSubmissionResult(token: string): Promise<Judge0Result> {
  try {
    const headers: Record<string, string> = {}

    // Use RapidAPI if key is provided
    if (JUDGE0_RAPIDAPI_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_RAPIDAPI_KEY
      headers['X-RapidAPI-Host'] = JUDGE0_RAPIDAPI_HOST
    }

    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`,
      {
        headers,
      }
    )

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`)
    }

    const data: Judge0Result = await response.json()
    return data
  } catch (error: any) {
    console.error('Error getting Judge0 result:', error)
    throw new Error(`Failed to get result: ${error.message}`)
  }
}

/**
 * Poll for result until ready (with timeout)
 */
export async function waitForResult(
  token: string,
  maxWaitTime: number = 30000,
  pollInterval: number = 1000
): Promise<Judge0Result> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    const result = await getSubmissionResult(token)

    // Status 1 = In Queue, Status 2 = Processing
    // Status 3 = Accepted (completed)
    if (result.status.id !== 1 && result.status.id !== 2) {
      return result
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error('Execution timeout')
}

/**
 * Decode base64 string
 */
function decodeBase64(str: string | null): string {
  if (!str) return ''
  try {
    return Buffer.from(str, 'base64').toString('utf-8')
  } catch {
    return str
  }
}

/**
 * Execute code and get result
 */
export async function executeCode(
  code: string,
  language: Judge0Language,
  stdin?: string,
  expectedOutput?: string
): Promise<{
  stdout: string
  stderr: string
  compileOutput: string
  status: string
  time: string | null
  memory: number | null
  passed: boolean
}> {
  const token = await submitCode(code, language, stdin, expectedOutput)
  const result = await waitForResult(token)

  const stdout = decodeBase64(result.stdout)
  const stderr = decodeBase64(result.stderr)
  const compileOutput = decodeBase64(result.compile_output)
  const message = decodeBase64(result.message)

  const passed = result.status.id === 3 && (!expectedOutput || stdout.trim() === expectedOutput.trim())

  return {
    stdout,
    stderr,
    compileOutput,
    status: result.status.description,
    time: result.time,
    memory: result.memory,
    passed,
  }
}

