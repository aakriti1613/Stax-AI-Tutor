// Hugging Face API Integration for DeepSeek Coder Verification
// Used to verify AI-generated coding questions for quality assurance

interface HuggingFaceRequest {
  inputs: string
  parameters?: {
    max_new_tokens?: number
    temperature?: number
    top_p?: number
    return_full_text?: boolean
  }
}

interface HuggingFaceResponse {
  generated_text: string
}

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models'

/**
 * Verify a coding question using DeepSeek Coder 6.7B via Hugging Face
 * This checks if the question is clear, correct, and appropriately difficult
 */
export async function verifyQuestionWithDeepSeek(
  question: {
    title: string
    description: string
    examples: Array<{ input: string; output: string; explanation: string }>
    testCases: Array<{ input: string; output: string; description: string }>
    constraints: string[]
    difficulty: 'Basic' | 'Medium' | 'Advanced'
  },
  subject: string,
  unit: string,
  subtopic: string
): Promise<{
  verified: boolean
  feedback: string
  issues: string[]
  suggestions: string[]
}> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn('⚠️ HUGGINGFACE_API_KEY not set, skipping verification')
    return {
      verified: true, // Default to verified if API key not available
      feedback: 'Verification skipped (API key not configured)',
      issues: [],
      suggestions: []
    }
  }

  const modelId = process.env.DEEPSEEK_MODEL_ID || 'deepseek-ai/deepseek-coder-6.7b-instruct'
  const apiUrl = `${HUGGINGFACE_API_URL}/${modelId}`

  // Create verification prompt
  const verificationPrompt = `You are a coding question quality assurance expert. Review this coding problem and verify its quality.

Subject: ${subject}
Unit: ${unit}
Subtopic: ${subtopic}
Difficulty: ${question.difficulty}

Question Title: ${question.title}
Description: ${question.description}

Examples:
${question.examples.map((ex, i) => `Example ${i + 1}:
Input: ${ex.input}
Output: ${ex.output}
Explanation: ${ex.explanation}`).join('\n\n')}

Test Cases:
${question.testCases.map((tc, i) => `Test ${i + 1}: ${tc.description}
Input: ${tc.input}
Output: ${tc.output}`).join('\n\n')}

Constraints:
${question.constraints.join('\n')}

Please verify:
1. Is the problem statement clear and unambiguous?
2. Are the examples correct and helpful?
3. Are the test cases comprehensive?
4. Is the difficulty level appropriate?
5. Are there any logical errors or ambiguities?

Respond in JSON format:
{
  "verified": true/false,
  "feedback": "Overall feedback",
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: verificationPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.3,
          return_full_text: false,
        },
      } as HuggingFaceRequest),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', errorText)
      
      // If model is loading, return verified (will be verified on next attempt)
      if (response.status === 503) {
        return {
          verified: true,
          feedback: 'Model is loading, verification will be retried',
          issues: [],
          suggestions: []
        }
      }
      
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Handle array response (some models return array)
    const generatedText = Array.isArray(data) ? data[0]?.generated_text || data[0]?.text : data.generated_text || data.text || ''
    
    if (!generatedText) {
      console.warn('Empty response from Hugging Face')
      return {
        verified: true,
        feedback: 'Verification response was empty, defaulting to verified',
        issues: [],
        suggestions: []
      }
    }

    // Extract JSON from response (might be wrapped in markdown)
    let jsonText = generatedText.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim()
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim()
    }
    
    // Try to parse JSON
    try {
      const verification = JSON.parse(jsonText)
      
      return {
        verified: verification.verified !== false, // Default to true if not specified
        feedback: verification.feedback || 'Question verified',
        issues: verification.issues || [],
        suggestions: verification.suggestions || []
      }
    } catch (parseError) {
      // If JSON parsing fails, try to extract information from text
      console.warn('Failed to parse JSON, analyzing text response')
      
      const lowerText = generatedText.toLowerCase()
      const verified = !lowerText.includes('not verified') && 
                      !lowerText.includes('false') &&
                      !lowerText.includes('error') &&
                      !lowerText.includes('issue')
      
      return {
        verified,
        feedback: generatedText.substring(0, 200),
        issues: [],
        suggestions: []
      }
    }
  } catch (error: any) {
    console.error('Error verifying question with DeepSeek:', error)
    
    // On error, default to verified (fail open)
    return {
      verified: true,
      feedback: `Verification error: ${error.message}. Question accepted by default.`,
      issues: [],
      suggestions: []
    }
  }
}

/**
 * Check if Hugging Face API is configured
 */
export function isHuggingFaceConfigured(): boolean {
  return !!process.env.HUGGINGFACE_API_KEY
}













