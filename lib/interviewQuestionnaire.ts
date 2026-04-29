// Interview Questionnaire Database
// Structured questions with rubrics for Stax AI Interviewer

export type InterviewTemplate = 'sde-placement' | 'frontend-sde' | 'backend-sde' | 'aiml-engineer'
export type QuestionSection = 'intro' | 'resume' | 'dsa' | 'cs-fundamentals' | 'system-design' | 'closing'
export type QuestionLevel = 'easy' | 'medium' | 'hard'
export type AnswerQuality = 'weak' | 'ok' | 'strong'

export interface QuestionRubric {
  expectedPoints: string[] // Key points that should be mentioned
  redFlags: string[] // Concerning phrases or behaviors
  goodIndicators: string[] // Positive signals
  minPointsForStrong: number // Minimum expected points needed for "strong"
}

export interface Question {
  id: string
  section: QuestionSection
  topic: string
  prompt: string // What Stax asks
  rubric: QuestionRubric
  level: QuestionLevel
  nextQuestionIfGood?: string // ID of next question if answer is strong
  nextQuestionIfWeak?: string // ID of next question if answer is weak
  nextQuestionIfOk?: string // ID of next question if answer is ok
  drillDownQuestions?: string[] // IDs of deeper follow-up questions
  isCoding?: boolean // Is this a coding challenge?
  codingChallenge?: {
    problem: string
    constraints: string[]
    expectedApproach?: string[]
    commonPitfalls?: string[]
    testCases?: Array<{ input: string; output: string }>
  }
}

export interface InterviewTemplateConfig {
  id: InterviewTemplate
  name: string
  domain: 'placement' | 'frontend' | 'backend' | 'aiml'
  description: string
  questions: Question[]
  startQuestionId: string // First question to ask
}

// Response Evaluation Result
export interface AnswerEvaluation {
  quality: AnswerQuality
  score: number // 0-3 (weak=0-1, ok=2, strong=3)
  matchedPoints: string[] // Expected points that were covered
  missingPoints: string[] // Expected points not covered
  redFlagsFound: string[] // Red flags detected
  feedback: string // Brief feedback on the answer
}

// ============ QUESTIONNAIRE DATABASE ============

// SDE Placement Interview Template
export const SDE_PLACEMENT_TEMPLATE: InterviewTemplateConfig = {
  id: 'sde-placement',
  name: 'SDE Placement Interview',
  domain: 'placement',
  description: 'Complete placement preparation interview covering DSA, CS fundamentals, and system design',
  startQuestionId: 'intro-1',
  questions: [
    // ============ INTRO SECTION ============
    {
      id: 'intro-1',
      section: 'intro',
      topic: 'self-introduction',
      prompt: "Hello! I'm Stax, your AI interviewer. Let's start with a brief introduction. Can you tell me about yourself? Please cover your background, education, and what interests you about software engineering.",
      rubric: {
        expectedPoints: [
          'education background',
          'relevant experience or projects',
          'interest in software engineering',
          'key skills or technologies',
        ],
        redFlags: ['no clear direction', 'unprepared', 'rambling without structure'],
        goodIndicators: ['clear structure', 'relevant experience', 'passion for coding'],
        minPointsForStrong: 3,
      },
      level: 'easy',
      nextQuestionIfGood: 'intro-2',
      nextQuestionIfWeak: 'intro-1-followup',
      nextQuestionIfOk: 'intro-2',
    },
    {
      id: 'intro-1-followup',
      section: 'intro',
      topic: 'self-introduction-clarification',
      prompt: "I'd like to understand better. Can you tell me about one project or experience that got you interested in software development?",
      rubric: {
        expectedPoints: ['specific project or experience', 'what they learned', 'why it interested them'],
        redFlags: ['vague', 'no real experience'],
        goodIndicators: ['concrete example', 'clear learning'],
        minPointsForStrong: 2,
      },
      level: 'easy',
      nextQuestionIfGood: 'intro-2',
      nextQuestionIfWeak: 'intro-2',
      nextQuestionIfOk: 'intro-2',
    },
    {
      id: 'intro-2',
      section: 'intro',
      topic: 'why-this-role',
      prompt: "Why are you interested in software engineering roles, and what kind of problems do you enjoy solving?",
      rubric: {
        expectedPoints: [
          'motivation for software engineering',
          'types of problems they enjoy',
          'alignment with role expectations',
        ],
        redFlags: ['generic answers', 'no clear motivation'],
        goodIndicators: ['specific interests', 'problem-solving mindset'],
        minPointsForStrong: 2,
      },
      level: 'easy',
      nextQuestionIfGood: 'resume-1',
      nextQuestionIfWeak: 'resume-1',
      nextQuestionIfOk: 'resume-1',
    },

    // ============ RESUME DEEP DIVE SECTION ============
    {
      id: 'resume-1',
      section: 'resume',
      topic: 'project-overview',
      prompt: "I'd like to dive into your projects. Can you walk me through one of your most significant projects? Please explain the problem it solved, your role, technologies used, and the impact.",
      rubric: {
        expectedPoints: [
          'problem statement',
          'their role and contributions',
          'technologies and tools used',
          'challenges faced',
          'impact or results',
        ],
        redFlags: ['unclear role', 'no technical details', 'exaggerated claims'],
        goodIndicators: ['clear technical depth', 'specific contributions', 'real challenges'],
        minPointsForStrong: 4,
      },
      level: 'medium',
      nextQuestionIfGood: 'resume-2',
      nextQuestionIfWeak: 'resume-1-followup',
      nextQuestionIfOk: 'resume-2',
      drillDownQuestions: ['resume-1-tech', 'resume-1-challenge'],
    },
    {
      id: 'resume-1-followup',
      section: 'resume',
      topic: 'project-clarification',
      prompt: "Let me understand better. What was your specific contribution to this project? Can you give me a technical example of something you implemented?",
      rubric: {
        expectedPoints: ['specific technical contribution', 'implementation details'],
        redFlags: ['vague', 'no technical depth'],
        goodIndicators: ['concrete technical example'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'resume-2',
      nextQuestionIfWeak: 'resume-2',
      nextQuestionIfOk: 'resume-2',
    },
    {
      id: 'resume-1-tech',
      section: 'resume',
      topic: 'technical-deep-dive',
      prompt: "You mentioned using [TECHNOLOGY]. Can you explain why you chose this technology and what alternatives you considered?",
      rubric: {
        expectedPoints: ['reasoning for technology choice', 'alternatives considered', 'trade-offs'],
        redFlags: ['no reasoning', 'did not consider alternatives'],
        goodIndicators: ['thoughtful decision-making', 'awareness of trade-offs'],
        minPointsForStrong: 2,
      },
      level: 'hard',
      nextQuestionIfGood: 'resume-2',
      nextQuestionIfWeak: 'resume-2',
      nextQuestionIfOk: 'resume-2',
    },
    {
      id: 'resume-1-challenge',
      section: 'resume',
      topic: 'challenges-overcome',
      prompt: "What was the biggest challenge you faced in this project, and how did you overcome it?",
      rubric: {
        expectedPoints: ['specific challenge', 'approach to solving', 'learning outcome'],
        redFlags: ['no real challenges', 'gave up easily'],
        goodIndicators: ['problem-solving approach', 'persistence', 'learning'],
        minPointsForStrong: 2,
      },
      level: 'medium',
      nextQuestionIfGood: 'resume-2',
      nextQuestionIfWeak: 'resume-2',
      nextQuestionIfOk: 'resume-2',
    },
    {
      id: 'resume-2',
      section: 'resume',
      topic: 'experience-discussion',
      prompt: "Tell me about your internship/work experience. What did you learn, and how did it contribute to your growth as a developer?",
      rubric: {
        expectedPoints: [
          'key learnings',
          'technical skills gained',
          'professional growth',
          'specific contributions',
        ],
        redFlags: ['no learning', 'passive role'],
        goodIndicators: ['active learning', 'meaningful contributions'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'dsa-1',
      nextQuestionIfWeak: 'dsa-1',
      nextQuestionIfOk: 'dsa-1',
    },

    // ============ DSA SECTION ============
    {
      id: 'dsa-1',
      section: 'dsa',
      topic: 'arrays-two-sum',
      prompt: "Let's move to some coding. Given an array of integers and a target sum, find two numbers that add up to the target. Can you explain your approach first, then we'll code it together.",
      rubric: {
        expectedPoints: [
          'brute force approach',
          'optimized approach (hash map)',
          'time complexity analysis',
          'space complexity analysis',
        ],
        redFlags: ['no approach', 'incorrect complexity', 'no optimization'],
        goodIndicators: ['clear approach', 'correct complexity', 'optimization'],
        minPointsForStrong: 3,
      },
      level: 'easy',
      isCoding: true,
      codingChallenge: {
        problem: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        constraints: [
          'You may assume that each input would have exactly one solution',
          'You may not use the same element twice',
          'Can you return the answer in any order?',
        ],
        expectedApproach: [
          'Brute force: O(n²) - check all pairs',
          'Optimized: Use hash map to store complements - O(n) time, O(n) space',
        ],
        commonPitfalls: [
          'Using same element twice',
          'Not handling edge cases (empty array, no solution)',
          'Returning values instead of indices',
        ],
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
      },
      nextQuestionIfGood: 'dsa-2',
      nextQuestionIfWeak: 'dsa-1-followup',
      nextQuestionIfOk: 'dsa-2',
    },
    {
      id: 'dsa-1-followup',
      section: 'dsa',
      topic: 'arrays-hint',
      prompt: "Let me give you a hint. Think about using a data structure that allows O(1) lookup. Can you revise your approach?",
      rubric: {
        expectedPoints: ['hash map or dictionary', 'O(1) lookup concept'],
        redFlags: ['still no approach'],
        goodIndicators: ['understands hint', 'revises approach'],
        minPointsForStrong: 1,
      },
      level: 'easy',
      nextQuestionIfGood: 'dsa-2',
      nextQuestionIfWeak: 'dsa-2',
      nextQuestionIfOk: 'dsa-2',
    },
    {
      id: 'dsa-2',
      section: 'dsa',
      topic: 'linked-list-reverse',
      prompt: "Good! Now, can you reverse a singly linked list? Explain your approach and the time/space complexity.",
      rubric: {
        expectedPoints: [
          'iterative approach',
          'pointer manipulation',
          'O(n) time complexity',
          'O(1) space complexity (iterative) or O(n) recursive',
        ],
        redFlags: ['no approach', 'incorrect complexity'],
        goodIndicators: ['clear pointer manipulation', 'correct complexity'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      isCoding: true,
      codingChallenge: {
        problem: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        constraints: [
          'The number of nodes in the list is in the range [0, 5000]',
          '-5000 <= Node.val <= 5000',
        ],
        expectedApproach: [
          'Iterative: Use three pointers (prev, curr, next)',
          'Recursive: Reverse rest, then adjust head',
        ],
        commonPitfalls: [
          'Losing reference to next node',
          'Not handling empty list',
          'Incorrect pointer updates',
        ],
        testCases: [
          { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: '[1,2]', output: '[2,1]' },
        ],
      },
      nextQuestionIfGood: 'dsa-3',
      nextQuestionIfWeak: 'dsa-2-followup',
      nextQuestionIfOk: 'dsa-3',
    },
    {
      id: 'dsa-2-followup',
      section: 'dsa',
      topic: 'linked-list-hint',
      prompt: "Think about using multiple pointers. You need to keep track of the previous node, current node, and next node. Can you explain how you'd traverse and reverse?",
      rubric: {
        expectedPoints: ['multiple pointers', 'traversal concept'],
        redFlags: ['still confused'],
        goodIndicators: ['understands pointers'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'dsa-3',
      nextQuestionIfWeak: 'cs-1',
      nextQuestionIfOk: 'dsa-3',
    },
    {
      id: 'dsa-3',
      section: 'dsa',
      topic: 'binary-tree-traversal',
      prompt: "Let's discuss binary trees. Can you explain the difference between BFS and DFS? When would you use each?",
      rubric: {
        expectedPoints: [
          'BFS uses queue, level-order traversal',
          'DFS uses stack/recursion, pre/in/post order',
          'BFS for shortest path, level-order',
          'DFS for deep exploration, tree structure',
        ],
        redFlags: ['confused between BFS/DFS', 'no use cases'],
        goodIndicators: ['clear understanding', 'correct use cases'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-1',
      nextQuestionIfWeak: 'cs-1',
      nextQuestionIfOk: 'cs-1',
      drillDownQuestions: ['dsa-3-implementation'],
    },
    {
      id: 'dsa-3-implementation',
      section: 'dsa',
      topic: 'dfs-implementation',
      prompt: "Can you write code for DFS traversal? Show me both recursive and iterative approaches.",
      rubric: {
        expectedPoints: ['recursive DFS', 'iterative DFS with stack', 'correct traversal'],
        redFlags: ['incorrect implementation', 'missing edge cases'],
        goodIndicators: ['both approaches', 'correct code'],
        minPointsForStrong: 2,
      },
      level: 'hard',
      isCoding: true,
      codingChallenge: {
        problem: 'Implement DFS traversal of a binary tree (preorder, inorder, postorder)',
        constraints: ['Handle null nodes', 'Return list of values'],
        expectedApproach: [
          'Recursive: Base case null, visit node, recurse left/right',
          'Iterative: Use stack, push/pop nodes',
        ],
        commonPitfalls: ['Forgetting null checks', 'Incorrect order'],
        testCases: [
          { input: '[1,2,3,4,5]', output: 'Preorder: [1,2,4,5,3]' },
        ],
      },
      nextQuestionIfGood: 'cs-1',
      nextQuestionIfWeak: 'cs-1',
      nextQuestionIfOk: 'cs-1',
    },

    // ============ CS FUNDAMENTALS SECTION ============
    {
      id: 'cs-1',
      section: 'cs-fundamentals',
      topic: 'operating-systems-processes-threads',
      prompt: "Let's discuss operating systems. What's the difference between a process and a thread? When would you use multithreading?",
      rubric: {
        expectedPoints: [
          'process has separate memory space',
          'threads share memory within process',
          'process isolation vs thread communication',
          'multithreading for parallelism, I/O operations',
        ],
        redFlags: ['confused concepts', 'no practical understanding'],
        goodIndicators: ['clear distinction', 'practical use cases'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-2',
      nextQuestionIfWeak: 'cs-1-followup',
      nextQuestionIfOk: 'cs-2',
      drillDownQuestions: ['cs-1-deadlock'],
    },
    {
      id: 'cs-1-followup',
      section: 'cs-fundamentals',
      topic: 'process-thread-clarification',
      prompt: "Let me clarify. A process is like a separate program running, while threads are like workers within that program sharing resources. Can you give me an example of when you'd use multiple threads?",
      rubric: {
        expectedPoints: ['example use case', 'understanding of shared resources'],
        redFlags: ['still confused'],
        goodIndicators: ['concrete example'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-2',
      nextQuestionIfWeak: 'cs-2',
      nextQuestionIfOk: 'cs-2',
    },
    {
      id: 'cs-1-deadlock',
      section: 'cs-fundamentals',
      topic: 'deadlock',
      prompt: "Good! Now, what is a deadlock? Can you explain the conditions for deadlock and how to prevent it?",
      rubric: {
        expectedPoints: [
          'mutual exclusion',
          'hold and wait',
          'no preemption',
          'circular wait',
          'prevention strategies',
        ],
        redFlags: ['no understanding', 'incorrect conditions'],
        goodIndicators: ['all four conditions', 'prevention methods'],
        minPointsForStrong: 4,
      },
      level: 'hard',
      nextQuestionIfGood: 'cs-2',
      nextQuestionIfWeak: 'cs-2',
      nextQuestionIfOk: 'cs-2',
    },
    {
      id: 'cs-2',
      section: 'cs-fundamentals',
      topic: 'database-acid',
      prompt: "Let's talk about databases. What does ACID stand for, and why is it important?",
      rubric: {
        expectedPoints: [
          'Atomicity - all or nothing',
          'Consistency - valid state',
          'Isolation - concurrent transactions',
          'Durability - committed data persists',
        ],
        redFlags: ['incorrect definitions', 'no understanding'],
        goodIndicators: ['all four properties', 'clear explanations'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-3',
      nextQuestionIfWeak: 'cs-2-followup',
      nextQuestionIfOk: 'cs-3',
    },
    {
      id: 'cs-2-followup',
      section: 'cs-fundamentals',
      topic: 'acid-clarification',
      prompt: "ACID ensures database transactions are reliable. Atomicity means the transaction either completes fully or not at all. Can you explain what happens if a transaction fails halfway?",
      rubric: {
        expectedPoints: ['rollback concept', 'data integrity'],
        redFlags: ['no understanding'],
        goodIndicators: ['rollback understanding'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-3',
      nextQuestionIfWeak: 'cs-3',
      nextQuestionIfOk: 'cs-3',
    },
    {
      id: 'cs-3',
      section: 'cs-fundamentals',
      topic: 'networking-tcp-udp',
      prompt: "Let's discuss networking. What's the difference between TCP and UDP? When would you use each?",
      rubric: {
        expectedPoints: [
          'TCP is reliable, connection-oriented',
          'UDP is unreliable, connectionless',
          'TCP for reliability (HTTP, FTP)',
          'UDP for speed (gaming, streaming)',
        ],
        redFlags: ['confused', 'no use cases'],
        goodIndicators: ['clear differences', 'correct use cases'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-4',
      nextQuestionIfWeak: 'cs-3-followup',
      nextQuestionIfOk: 'cs-4',
    },
    {
      id: 'cs-3-followup',
      section: 'cs-fundamentals',
      topic: 'tcp-udp-clarification',
      prompt: "TCP guarantees delivery and order, but is slower. UDP is faster but may lose packets. Can you give me an example where you'd choose UDP over TCP?",
      rubric: {
        expectedPoints: ['real-time application', 'speed over reliability'],
        redFlags: ['wrong example'],
        goodIndicators: ['correct example'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'cs-4',
      nextQuestionIfWeak: 'cs-4',
      nextQuestionIfOk: 'cs-4',
    },
    {
      id: 'cs-4',
      section: 'cs-fundamentals',
      topic: 'oops-polymorphism',
      prompt: "Let's discuss OOP. What is polymorphism? Can you explain compile-time vs runtime polymorphism with examples?",
      rubric: {
        expectedPoints: [
          'polymorphism definition',
          'compile-time (method overloading)',
          'runtime (method overriding)',
          'examples',
        ],
        redFlags: ['confused', 'no examples'],
        goodIndicators: ['both types', 'clear examples'],
        minPointsForStrong: 3,
      },
      level: 'medium',
      nextQuestionIfGood: 'closing-1',
      nextQuestionIfWeak: 'cs-4-followup',
      nextQuestionIfOk: 'closing-1',
    },
    {
      id: 'cs-4-followup',
      section: 'cs-fundamentals',
      topic: 'polymorphism-clarification',
      prompt: "Polymorphism means one interface, multiple implementations. Method overloading is compile-time (same method name, different parameters). Method overriding is runtime (subclass overrides parent). Can you give me an example?",
      rubric: {
        expectedPoints: ['example of polymorphism'],
        redFlags: ['no example'],
        goodIndicators: ['concrete example'],
        minPointsForStrong: 1,
      },
      level: 'medium',
      nextQuestionIfGood: 'closing-1',
      nextQuestionIfWeak: 'closing-1',
      nextQuestionIfOk: 'closing-1',
    },

    // ============ CLOSING SECTION ============
    {
      id: 'closing-1',
      section: 'closing',
      topic: 'questions-for-interviewer',
      prompt: "Great! We've covered a lot. Do you have any questions for me about the role, company, or team?",
      rubric: {
        expectedPoints: ['thoughtful questions', 'shows interest'],
        redFlags: ['no questions', 'generic questions'],
        goodIndicators: ['specific, thoughtful questions'],
        minPointsForStrong: 1,
      },
      level: 'easy',
      nextQuestionIfGood: 'closing-2',
      nextQuestionIfWeak: 'closing-2',
      nextQuestionIfOk: 'closing-2',
    },
    {
      id: 'closing-2',
      section: 'closing',
      topic: 'final-thoughts',
      prompt: "Thank you for the interview! You've demonstrated strong technical knowledge and problem-solving skills. Is there anything else you'd like to add or clarify?",
      rubric: {
        expectedPoints: ['professional closing'],
        redFlags: [],
        goodIndicators: ['professional'],
        minPointsForStrong: 0,
      },
      level: 'easy',
    },
  ],
}

// Frontend SDE Template (simplified - can be expanded)
export const FRONTEND_SDE_TEMPLATE: InterviewTemplateConfig = {
  id: 'frontend-sde',
  name: 'Frontend SDE Interview',
  domain: 'frontend',
  description: 'Frontend-focused interview covering React, JavaScript, and web fundamentals',
  startQuestionId: 'intro-1',
  questions: [
    {
      id: 'intro-1',
      section: 'intro',
      topic: 'self-introduction',
      prompt: "Hello! I'm Stax. Can you tell me about yourself and your experience with frontend development?",
      rubric: {
        expectedPoints: ['frontend experience', 'technologies used', 'projects'],
        redFlags: [],
        goodIndicators: ['specific frontend projects'],
        minPointsForStrong: 2,
      },
      level: 'easy',
      nextQuestionIfGood: 'frontend-1',
      nextQuestionIfWeak: 'frontend-1',
      nextQuestionIfOk: 'frontend-1',
    },
    {
      id: 'frontend-1',
      section: 'cs-fundamentals',
      topic: 'javascript-closure',
      prompt: "Let's start with JavaScript fundamentals. What is a closure? Can you explain with an example?",
      rubric: {
        expectedPoints: ['closure definition', 'lexical scoping', 'example'],
        redFlags: ['no understanding'],
        goodIndicators: ['clear explanation', 'good example'],
        minPointsForStrong: 2,
      },
      level: 'medium',
      nextQuestionIfGood: 'frontend-2',
      nextQuestionIfWeak: 'frontend-2',
      nextQuestionIfOk: 'frontend-2',
    },
    {
      id: 'frontend-2',
      section: 'cs-fundamentals',
      topic: 'react-hooks',
      prompt: "Let's discuss React. Explain the difference between useState and useEffect hooks. When would you use each?",
      rubric: {
        expectedPoints: ['useState for state', 'useEffect for side effects', 'use cases'],
        redFlags: ['confused'],
        goodIndicators: ['clear understanding'],
        minPointsForStrong: 2,
      },
      level: 'medium',
      nextQuestionIfGood: 'closing-1',
      nextQuestionIfWeak: 'closing-1',
      nextQuestionIfOk: 'closing-1',
    },
    {
      id: 'closing-1',
      section: 'closing',
      topic: 'final-thoughts',
      prompt: "Thank you for the interview!",
      rubric: {
        expectedPoints: [],
        redFlags: [],
        goodIndicators: [],
        minPointsForStrong: 0,
      },
      level: 'easy',
    },
  ],
}

// Template Registry
export const INTERVIEW_TEMPLATES: Record<InterviewTemplate, InterviewTemplateConfig> = {
  'sde-placement': SDE_PLACEMENT_TEMPLATE,
  'frontend-sde': FRONTEND_SDE_TEMPLATE,
  'backend-sde': FRONTEND_SDE_TEMPLATE, // Placeholder - can be expanded
  'aiml-engineer': FRONTEND_SDE_TEMPLATE, // Placeholder - can be expanded
}

// Helper function to get template by domain
export function getTemplateByDomain(domain: 'placement' | 'frontend' | 'backend' | 'aiml'): InterviewTemplateConfig {
  const templateMap: Record<string, InterviewTemplate> = {
    placement: 'sde-placement',
    frontend: 'frontend-sde',
    backend: 'backend-sde',
    aiml: 'aiml-engineer',
  }
  return INTERVIEW_TEMPLATES[templateMap[domain] || 'sde-placement']
}

// Helper function to get question by ID
export function getQuestionById(template: InterviewTemplateConfig, questionId: string): Question | undefined {
  return template.questions.find((q) => q.id === questionId)
}

