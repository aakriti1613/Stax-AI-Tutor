// AI Helper for intelligent follow-ups and cross-questioning
import { generateGeminiResponse } from './gemini'
import { Question, AnswerEvaluation } from './interviewQuestionnaire'

export interface AIFollowUpRequest {
  question: Question
  userAnswer: string
  evaluation: AnswerEvaluation
  conversationHistory: Array<{ role: 'stax' | 'user'; content: string }>
}

export interface AIFollowUpResponse {
  followUpQuestion?: string
  crossQuestion?: string
  feedback?: string
  shouldDrillDown: boolean
}

/**
 * Generate intelligent follow-up questions using AI
 * Only used when we need deeper probing beyond the questionnaire
 */
export async function generateAIFollowUp(request: AIFollowUpRequest): Promise<AIFollowUpResponse> {
  const { question, userAnswer, evaluation, conversationHistory } = request

  try {
    // Build context
    const context = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map((msg) => `${msg.role === 'stax' ? 'Stax' : 'Candidate'}: ${msg.content}`)
      .join('\n')

    let prompt = ''

    // Different prompts based on evaluation quality
    if (evaluation.quality === 'strong') {
      // Strong answer - ask deeper cross-question
      prompt = `You are Stax, a technical interviewer. The candidate gave a strong answer to this question:

Question: ${question.prompt}
Topic: ${question.topic}
Expected Points: ${question.rubric.expectedPoints.join(', ')}

Candidate's Answer: "${userAnswer}"

They covered: ${evaluation.matchedPoints.join(', ')}

Generate ONE deeper follow-up question that:
1. Probes deeper into the topic (trade-offs, edge cases, real-world scenarios)
2. Tests advanced understanding
3. Is conversational and natural
4. Maximum 2 sentences

Context from conversation:
${context}

Return ONLY the question, no explanations.`
    } else if (evaluation.quality === 'weak') {
      // Weak answer - provide clarification and simpler follow-up
      prompt = `You are Stax, a technical interviewer. The candidate struggled with this question:

Question: ${question.prompt}
Topic: ${question.topic}
Expected Points: ${question.rubric.expectedPoints.join(', ')}

Candidate's Answer: "${userAnswer}"
Missing Points: ${evaluation.missingPoints.join(', ')}

Generate ONE clarifying follow-up question that:
1. Helps them understand better
2. Is simpler and more guided
3. Encourages them to elaborate
4. Maximum 2 sentences

Context from conversation:
${context}

Return ONLY the question, no explanations.`
    } else {
      // OK answer - ask for elaboration
      prompt = `You are Stax, a technical interviewer. The candidate gave an okay answer:

Question: ${question.prompt}
Topic: ${question.topic}

Candidate's Answer: "${userAnswer}"

Generate ONE follow-up question that:
1. Asks them to elaborate on specific points
2. Tests deeper understanding
3. Is conversational
4. Maximum 2 sentences

Context from conversation:
${context}

Return ONLY the question, no explanations.`
    }

    const aiResponse = await generateGeminiResponse(prompt)

    // Determine if we should drill down
    const shouldDrillDown = Boolean(
      evaluation.quality === 'strong' &&
      question.drillDownQuestions &&
      question.drillDownQuestions.length > 0 &&
      Math.random() > 0.5 // 50% chance to use drill-down from DB instead
    )

    return {
      followUpQuestion: aiResponse || undefined,
      shouldDrillDown,
      feedback: evaluation.feedback,
    }
  } catch (error: any) {
    console.error('Error generating AI follow-up:', error)
    return {
      shouldDrillDown: false,
      feedback: evaluation.feedback,
    }
  }
}

/**
 * Generate cross-questioning based on previous answers
 */
export async function generateCrossQuestion(
  topic: string,
  previousAnswers: string[],
  conversationHistory: Array<{ role: 'stax' | 'user'; content: string }>
): Promise<string | null> {
  try {
    const context = conversationHistory
      .slice(-8)
      .map((msg) => `${msg.role === 'stax' ? 'Stax' : 'Candidate'}: ${msg.content}`)
      .join('\n')

    const prompt = `You are Stax, a technical interviewer conducting cross-questioning.

Topic: ${topic}
Previous answers from candidate:
${previousAnswers.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Conversation context:
${context}

Generate ONE cross-question that:
1. Connects their previous answers
2. Tests consistency and deeper understanding
3. Probes for contradictions or gaps
4. Is natural and conversational
5. Maximum 2 sentences

Return ONLY the question, no explanations.`

    const question = await generateGeminiResponse(prompt)
    return question || null
  } catch (error: any) {
    console.error('Error generating cross-question:', error)
    return null
  }
}

/**
 * Generate code review feedback using AI
 */
export async function generateCodeFeedback(
  problem: string,
  code: string,
  executionResult: any,
  rubric: Question['rubric']
): Promise<string> {
  try {
    const prompt = `You are Stax, a technical interviewer reviewing code.

Problem: ${problem}
Expected Approach: ${rubric.expectedPoints.join(', ')}

Candidate's Code:
\`\`\`${code}\`\`\`

Execution Result: ${JSON.stringify(executionResult)}

Provide constructive feedback:
1. What they did well
2. Issues or improvements needed
3. Ask a follow-up question about their approach
4. Be encouraging but honest
5. Maximum 4-5 sentences, conversational tone

Return ONLY the feedback, no code blocks or markdown.`

    const feedback = await generateGeminiResponse(prompt)
    return feedback || 'Thank you for submitting your code. Let me review it.'
  } catch (error: any) {
    console.error('Error generating code feedback:', error)
    return 'Thank you for submitting your code. Let me review it and provide feedback.'
  }
}

