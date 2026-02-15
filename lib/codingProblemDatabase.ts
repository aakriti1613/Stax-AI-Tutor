// Coding Problem Database - Static content for testing
// This provides reliable coding problems without depending on Gemini API

export interface CodingProblem {
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  testCases: Array<{
    input: string
    output: string
    description: string
  }>
  constraints: string[]
  hints: string[]
}

type ProblemKey = `${string}-${string}-${string}-${string}` // subject-unit-subtopic-difficulty

const codingProblemDatabase: Record<string, CodingProblem> = {
  // Generic problems that work for all subjects (except DBMS)
  // These will be used as fallback for any subject/unit/subtopic combination
  
  // Basic Level Problems
  'basic-find-maximum': {
    title: 'Basic Problem: Find Maximum Element',
    description: 'Write a function to find the maximum element in an array. Given an array of integers, return the largest value.',
    examples: [
      {
        input: '[1, 5, 3, 9, 2]',
        output: '9',
        explanation: 'The maximum element in [1, 5, 3, 9, 2] is 9.'
      },
      {
        input: '[-10, -5, -20, -1]',
        output: '-1',
        explanation: 'The maximum element in [-10, -5, -20, -1] is -1.'
      }
    ],
    testCases: [
      {
        input: '[1, 5, 3, 9, 2]',
        output: '9',
        description: 'Basic test case with positive numbers'
      },
      {
        input: '[-10, -5, -20, -1]',
        output: '-1',
        description: 'Test case with negative numbers'
      },
      {
        input: '[42]',
        output: '42',
        description: 'Test case with single element'
      }
    ],
    constraints: [
      '1 <= array.length <= 100',
      '-1000 <= array[i] <= 1000'
    ],
    hints: [
      'Think about iterating through the array',
      'Keep track of the maximum value seen so far',
      'Compare each element with the current maximum'
    ]
  },

  'basic-count-elements': {
    title: 'Basic Problem: Count Even Numbers',
    description: 'Given an array of integers, count and return how many even numbers are in the array.',
    examples: [
      {
        input: '[1, 2, 3, 4, 5, 6]',
        output: '3',
        explanation: 'There are 3 even numbers: 2, 4, and 6.'
      },
      {
        input: '[1, 3, 5, 7]',
        output: '0',
        explanation: 'There are no even numbers in this array.'
      }
    ],
    testCases: [
      {
        input: '[1, 2, 3, 4, 5, 6]',
        output: '3',
        description: 'Mixed array with even and odd numbers'
      },
      {
        input: '[1, 3, 5, 7]',
        output: '0',
        description: 'Array with only odd numbers'
      },
      {
        input: '[2, 4, 6, 8]',
        output: '4',
        description: 'Array with only even numbers'
      }
    ],
    constraints: [
      '1 <= array.length <= 100',
      '-1000 <= array[i] <= 1000'
    ],
    hints: [
      'Use modulo operator (%) to check if a number is even',
      'A number is even if number % 2 == 0',
      'Iterate through the array and count even numbers'
    ]
  },

  // Medium Level Problems
  'medium-two-sum': {
    title: 'Medium Problem: Two Sum',
    description: 'Given an array of integers and a target sum, find two numbers that add up to the target. Return the indices of these two numbers as an array.',
    examples: [
      {
        input: '[2, 7, 11, 15]\n9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].'
      },
      {
        input: '[3, 2, 4]\n6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2].'
      }
    ],
    testCases: [
      {
        input: '[2, 7, 11, 15]\n9',
        output: '[0, 1]',
        description: 'Standard two sum problem'
      },
      {
        input: '[3, 2, 4]\n6',
        output: '[1, 2]',
        description: 'Different indices'
      },
      {
        input: '[3, 3]\n6',
        output: '[0, 1]',
        description: 'Same numbers at different indices'
      }
    ],
    constraints: [
      '2 <= array.length <= 10000',
      '-1000 <= array[i] <= 1000',
      '-1000 <= target <= 1000'
    ],
    hints: [
      'Consider using a hash map or dictionary',
      'Think about what complement you need for each number',
      'You can solve this in O(n) time complexity'
    ]
  },

  'medium-reverse-array': {
    title: 'Medium Problem: Reverse Array',
    description: 'Given an array of integers, reverse the array in-place and return it. Do not use extra space.',
    examples: [
      {
        input: '[1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'The array is reversed in-place.'
      },
      {
        input: '[10, 20, 30]',
        output: '[30, 20, 10]',
        explanation: 'Reverse of [10, 20, 30] is [30, 20, 10].'
      }
    ],
    testCases: [
      {
        input: '[1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        description: 'Reverse array with 5 elements'
      },
      {
        input: '[10, 20, 30]',
        output: '[30, 20, 10]',
        description: 'Reverse array with 3 elements'
      },
      {
        input: '[1, 2]',
        output: '[2, 1]',
        description: 'Reverse array with 2 elements'
      }
    ],
    constraints: [
      '1 <= array.length <= 1000',
      '-1000 <= array[i] <= 1000'
    ],
    hints: [
      'Use two pointers approach',
      'Swap elements from start and end',
      'Move pointers towards the center'
    ]
  },

  // Hard Level Problems
  'hard-maximum-subarray': {
    title: 'Hard Problem: Maximum Subarray Sum',
    description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. This is also known as Kadane\'s Algorithm.',
    examples: [
      {
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6.'
      },
      {
        input: '[1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum = 1.'
      }
    ],
    testCases: [
      {
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        description: 'Standard maximum subarray problem'
      },
      {
        input: '[1]',
        output: '1',
        description: 'Single element array'
      },
      {
        input: '[5, 4, -1, 7, 8]',
        output: '23',
        description: 'All positive numbers'
      }
    ],
    constraints: [
      '1 <= array.length <= 100000',
      '-10000 <= array[i] <= 10000'
    ],
    hints: [
      'Think about dynamic programming approach',
      'Consider what happens when you extend a subarray',
      'You can solve this in O(n) time with O(1) space'
    ]
  },

  'hard-find-duplicate': {
    title: 'Hard Problem: Find Duplicate Number',
    description: 'Given an array of integers containing n+1 integers where each integer is in the range [1, n] inclusive, find the duplicate number. There is only one duplicate number.',
    examples: [
      {
        input: '[1, 3, 4, 2, 2]',
        output: '2',
        explanation: 'The duplicate number is 2.'
      },
      {
        input: '[3, 1, 3, 4, 2]',
        output: '3',
        explanation: 'The duplicate number is 3.'
      }
    ],
    testCases: [
      {
        input: '[1, 3, 4, 2, 2]',
        output: '2',
        description: 'Duplicate at the end'
      },
      {
        input: '[3, 1, 3, 4, 2]',
        output: '3',
        description: 'Duplicate in the middle'
      },
      {
        input: '[1, 1]',
        output: '1',
        description: 'Only two elements, both same'
      }
    ],
    constraints: [
      '2 <= array.length <= 100000',
      '1 <= array[i] <= array.length - 1'
    ],
    hints: [
      'Consider using Floyd\'s cycle detection algorithm',
      'Think about the array as a linked list',
      'Use two pointers: slow and fast'
    ]
  }
}

/**
 * Get coding problem for a specific subject, unit, subtopic, and difficulty
 * Returns generic problems for all subjects except DBMS/SQL
 */
export function getCodingProblem(
  subject: string,
  unit: string,
  subtopic: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
): CodingProblem | null {
  // Normalize subject name
  let normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
  
  // Handle subject name variations
  if (normalizedSubject.includes('data-structures') || normalizedSubject.includes('dsa')) {
    normalizedSubject = 'dsa'
  } else if (normalizedSubject.includes('database') || normalizedSubject.includes('dbms') || normalizedSubject.includes('sql')) {
    // NO coding problems for DBMS/SQL
    return null
  }
  
  // Map difficulty to problem key
  const difficultyMap: Record<string, string> = {
    'basic': 'basic',
    'medium': 'medium',
    'advanced': 'hard',
    'hard': 'hard'
  }
  
  const mappedDifficulty = difficultyMap[difficulty.toLowerCase()] || 'basic'
  
  // Return generic problems based on difficulty
  // These work for all subjects (cpp, java, python, dsa, oops) except dbms
  if (mappedDifficulty === 'basic') {
    // Return a basic problem (rotate between available basic problems)
    const basicProblems = ['basic-find-maximum', 'basic-count-elements']
    const problemIndex = Math.abs(
      `${subject}-${unit}-${subtopic}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % basicProblems.length
    return codingProblemDatabase[basicProblems[problemIndex]] || codingProblemDatabase['basic-find-maximum']
  } else if (mappedDifficulty === 'medium') {
    // Return a medium problem
    const mediumProblems = ['medium-two-sum', 'medium-reverse-array']
    const problemIndex = Math.abs(
      `${subject}-${unit}-${subtopic}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % mediumProblems.length
    return codingProblemDatabase[mediumProblems[problemIndex]] || codingProblemDatabase['medium-two-sum']
  } else {
    // Return a hard problem
    const hardProblems = ['hard-maximum-subarray', 'hard-find-duplicate']
    const problemIndex = Math.abs(
      `${subject}-${unit}-${subtopic}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % hardProblems.length
    return codingProblemDatabase[hardProblems[problemIndex]] || codingProblemDatabase['hard-maximum-subarray']
  }
}

/**
 * Check if coding problem exists
 */
export function hasCodingProblem(
  subject: string,
  unit: string,
  subtopic: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
): boolean {
  return getCodingProblem(subject, unit, subtopic, difficulty) !== null
}










