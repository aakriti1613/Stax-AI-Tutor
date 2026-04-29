'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Play, Loader2, AlertCircle, Lightbulb, Trophy, ArrowRight, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { DOMAINS } from '@/lib/subjects'
import FrontendEditor from './FrontendEditor'

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 bg-dark-card animate-pulse rounded-lg" />,
})

interface CodingProblem {
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  testCases?: Array<{
    input: string
    output: string
    description: string
  }>
  constraints: string[]
  hints: string[]
}

interface Hint {
  problematicLine: number
  concept: string
  explanation: string
  hint: string
  reviewConcept: string
}

interface CodingChallengeProps {
  subject: string
  unit: string
  subtopic?: string
  difficulty?: 'Basic' | 'Medium' | 'Advanced'
  onComplete: () => void
}

type Difficulty = 'Basic' | 'Medium' | 'Advanced'

// Check if subject is in frontend or backend domain
function isFrontendOrBackendSubject(subject: string): boolean {
  const frontendSubjects = DOMAINS.frontend.subjects
  const backendSubjects = DOMAINS.backend.subjects
  const subjectLower = subject.toLowerCase()
  
  return frontendSubjects.some(s => s.toLowerCase() === subjectLower) ||
         backendSubjects.some(s => s.toLowerCase() === subjectLower)
}

export default function CodingChallenge({ subject, unit, subtopic, difficulty: propDifficulty, onComplete }: CodingChallengeProps) {
  const [problem, setProblem] = useState<CodingProblem | null>(null)
  const [frontendQuestion, setFrontendQuestion] = useState<any>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>(propDifficulty || 'Basic')
  const [isFrontendBackend, setIsFrontendBackend] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [hint, setHint] = useState<Hint | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Array<{ 
    passed: boolean
    input: string
    expected: string
    got: string
    status?: string
    error?: string | null
  }>>([])

  // Language templates with input reading
  const languageTemplates: Record<string, string> = {
    python: `# Read input from stdin
import sys
import json

# Read the input line
input_line = sys.stdin.readline().strip()

# Parse the input (assuming it's a JSON array like "[1, 2, 3]")
try:
    arr = json.loads(input_line)
except:
    # If not JSON, try to parse as space-separated values
    arr = list(map(int, input_line.split()))

# Your solution here
# Example: process the array and store result in 'result'
result = []

# Print the result (as JSON array format)
print(json.dumps(result))
`,
    cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    string line;
    getline(cin, line);
    
    // Remove brackets and parse
    line.erase(remove(line.begin(), line.end(), '['), line.end());
    line.erase(remove(line.begin(), line.end(), ']'), line.end());
    
    vector<int> arr;
    stringstream ss(line);
    string token;
    
    while (getline(ss, token, ',')) {
        if (!token.empty()) {
            arr.push_back(stoi(token));
        }
    }
    
    // Your solution here
    vector<int> result;
    
    // Print result
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]";
    
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine().trim();
        
        // Remove brackets and parse
        line = line.replaceAll("[\\[\\]]", "");
        String[] parts = line.split(",");
        
        List<Integer> arr = new ArrayList<>();
        for (String part : parts) {
            if (!part.trim().isEmpty()) {
                arr.add(Integer.parseInt(part.trim()));
            }
        }
        
        // Your solution here
        List<Integer> result = new ArrayList<>();
        
        // Print result
        System.out.print("[");
        for (int i = 0; i < result.size(); i++) {
            System.out.print(result.get(i));
            if (i < result.size() - 1) System.out.print(",");
        }
        System.out.print("]");
    }
}`,
  }

  const [language, setLanguage] = useState('python')

  useEffect(() => {
    const isFrontendBackend = isFrontendOrBackendSubject(subject)
    setIsFrontendBackend(isFrontendBackend)
    
    if (isFrontendBackend) {
      fetchFrontendBackendQuestion()
    } else {
      fetchProblem()
      setCode(languageTemplates[language])
    }
  }, [difficulty, subject, unit, subtopic])

  const fetchFrontendBackendQuestion = async () => {
    try {
      setLoading(true)
      const subtopicName = subtopic || 'intro'
      
      console.log('💻 Fetching frontend/backend question:', { subject, unit, subtopic: subtopicName, difficulty })
      
      const response = await axios.get('/api/questions/frontend-backend', {
        params: {
          subject,
          unit,
          subtopic: subtopicName,
          difficulty,
          random: 'true'
        }
      })
      
      if (response.data && response.data.question) {
        console.log('✅ Received question:', response.data.question.title)
        setFrontendQuestion(response.data.question)
        setError(null)
      } else {
        throw new Error('No question found')
      }
    } catch (error: any) {
      console.error('Error fetching question:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load question'
      toast.error(errorMsg)
      setFrontendQuestion(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchProblem = async () => {
    try {
      setLoading(true)
      // Use subtopic prop if provided, otherwise default to 'intro'
      const subtopicName = subtopic || 'intro'
      
      console.log('💻 Fetching coding problem:', { subject, unit, subtopic: subtopicName, difficulty })
      
      const response = await axios.post('/api/gemini/coding-problem', {
        subject,
        unit,
        subtopic: subtopicName,
        difficulty,
      })
      
      if (response.data) {
        if (response.data.problem) {
          console.log('✅ Received coding problem:', response.data.problem.title)
          setProblem(response.data.problem)
          setCode(languageTemplates[language])
          setError(null)
          setTestResults([])
          setHint(null)
          setShowHint(false)
          setCurrentHintIndex(0)
          
          if (response.data.error) {
            toast(response.data.error)
          }
        } else if (response.data.error) {
          throw new Error(response.data.error)
        } else {
          throw new Error('No problem in response')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Error fetching problem:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load problem'
      toast.error(errorMsg)
      setProblem(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    if (!problem || problem.examples.length === 0) {
      toast.error('No test cases available')
      return
    }

    setExecuting(true)
    setError(null)
    setTestResults([])

    try {
      // Execute code against all test cases
      const results = await Promise.all(
        problem.examples.map(async (ex) => {
          try {
            const response = await axios.post('/api/judge0/execute', {
              code,
              language,
              stdin: ex.input,
              expectedOutput: ex.output,
            })

            const executionResult = response.data.result

            return {
              passed: executionResult.passed,
              input: ex.input,
              expected: ex.output,
              got: executionResult.stdout || executionResult.stderr || executionResult.compileOutput || 'No output',
              status: executionResult.status,
              error: executionResult.stderr || executionResult.compileOutput || null,
            }
          } catch (err: any) {
            return {
              passed: false,
              input: ex.input,
              expected: ex.output,
              got: err.response?.data?.error || 'Execution error',
              status: 'Error',
              error: err.response?.data?.error || 'Failed to execute',
            }
          }
        })
      )

      setTestResults(results)

      const allPassed = results.every(r => r.passed)
      if (allPassed) {
        setCompleted(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        toast.success('All tests passed! 🎉')
      } else {
        const passedCount = results.filter(r => r.passed).length
        toast.error(`${passedCount}/${results.length} tests passed. Keep trying!`)
      }
    } catch (err: any) {
      setError(err.message || 'Execution error')
      toast.error('Code execution failed. Check your Judge0 API configuration.')
    } finally {
      setExecuting(false)
    }
  }

  const handleGetHint = async () => {
    if (!code.trim()) {
      toast.error('Write some code first')
      return
    }

    setHintLoading(true)
    try {
      const response = await axios.post('/api/gemini/hint', {
        code,
        error: error || 'Incorrect output or logic error',
        subject,
        unit,
      })
      
      if (response.data && response.data.hint) {
        setHint(response.data.hint)
        setShowHint(true)
        if (response.data.error) {
          toast(response.data.error)
        }
      } else {
        throw new Error('No hint in response')
      }
    } catch (err: any) {
      console.error('Error fetching hint:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Failed to get hint'
      toast.error(errorMsg)
      
      // Set fallback hint so user still gets help
      if (err.response?.data?.hint) {
        setHint(err.response.data.hint)
        setShowHint(true)
      }
    } finally {
      setHintLoading(false)
    }
  }

  const handleNextDifficulty = () => {
    const difficulties: Difficulty[] = ['Basic', 'Medium', 'Advanced']
    const currentIdx = difficulties.indexOf(difficulty)
    if (currentIdx < difficulties.length - 1) {
      setDifficulty(difficulties[currentIdx + 1])
      setCompleted(false)
    } else {
      // All difficulties completed
      onComplete()
    }
  }

  const handleNextHint = () => {
    if (problem && currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  // Show FrontendEditor for frontend/backend subjects
  if (isFrontendBackend) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-neon-cyan" />
          </motion.div>
        </div>
      )
    }

    if (!frontendQuestion) {
      return (
        <div className="glass-card p-8 text-center">
          <p className="text-red-400">Failed to load question</p>
          <button onClick={fetchFrontendBackendQuestion} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      )
    }

    return (
      <FrontendEditor
        subject={subject}
        unit={unit}
        subtopic={subtopic || 'intro'}
        difficulty={difficulty}
        question={frontendQuestion}
        onComplete={onComplete}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-neon-cyan" />
        </motion.div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400">Failed to load problem</p>
        <button onClick={fetchProblem} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">{problem.title}</h1>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full font-bold ${
              difficulty === 'Basic' ? 'bg-neon-green/20 text-neon-green' :
              difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-red-500/20 text-red-500'
            }`}>
              {difficulty}
            </span>
            <span className="text-gray-400">{unit}</span>
          </div>
        </div>
        <button
          onClick={() => setDifficulty(difficulty === 'Basic' ? 'Medium' : difficulty === 'Medium' ? 'Advanced' : 'Basic')}
          className="btn-secondary"
        >
          Change Difficulty
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Problem Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-neon-cyan">📝</span>
              Examples
            </h3>
            <div className="space-y-4">
              {problem.examples.map((ex, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-dark-bg p-4 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors"
                >
                  <div className="mb-2">
                    <span className="text-sm text-gray-400 font-bold">Input:</span>
                    <pre className="text-neon-green mt-1 bg-black/30 p-2 rounded">{ex.input}</pre>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-400 font-bold">Output:</span>
                    <pre className="text-neon-cyan mt-1 bg-black/30 p-2 rounded">{ex.output}</pre>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 font-bold">Explanation:</span>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{ex.explanation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Test Cases */}
          {problem.testCases && problem.testCases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 border-2 border-neon-purple/30"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-neon-purple">🧪</span>
                Test Cases
              </h3>
              <div className="space-y-3">
                {problem.testCases.map((testCase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-neon-purple/10 p-4 rounded-lg border border-neon-purple/30"
                  >
                    <div className="text-sm text-neon-purple font-bold mb-2">
                      Test Case {idx + 1}: {testCase.description}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Input:</span>
                        <pre className="text-neon-green mt-1 bg-black/30 p-2 rounded text-xs">{testCase.input}</pre>
                      </div>
                      <div>
                        <span className="text-gray-400">Expected Output:</span>
                        <pre className="text-neon-cyan mt-1 bg-black/30 p-2 rounded text-xs">{testCase.output}</pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Constraints */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Constraints</h3>
            <ul className="space-y-2">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-neon-cyan">•</span>
                  <span className="text-gray-300">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Code Editor */}
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                setCode(languageTemplates[e.target.value])
              }}
              className="bg-dark-card border border-neon-cyan/50 text-white px-4 py-2 rounded-lg"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={handleGetHint}
              disabled={hintLoading}
              className="btn-secondary flex items-center gap-2"
            >
              {hintLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              Get AI Hint
            </button>
          </div>

          {/* Editor */}
          <div className="glass-card overflow-hidden">
            <MonacoEditor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* AI Hint Display */}
          <AnimatePresence>
            {showHint && hint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 border border-neon-cyan/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-neon-cyan" />
                  <h3 className="text-xl font-bold">AI Hint</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Problematic Line:</span>
                    <span className="ml-2 text-neon-cyan font-bold">Line {hint.problematicLine}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Concept:</span>
                    <span className="ml-2">{hint.concept}</span>
                  </div>
                  <div className="bg-dark-bg p-4 rounded-lg">
                    <p className="text-gray-300">{hint.explanation}</p>
                  </div>
                  <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
                    <p className="text-neon-cyan font-bold">💡 Hint: {hint.hint}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Review: <span className="text-neon-purple">{hint.reviewConcept}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progressive Hints */}
          {problem.hints.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progressive Hints</span>
                <span className="text-xs text-gray-500">
                  {currentHintIndex + 1} / {problem.hints.length}
                </span>
              </div>
              <div className="bg-dark-bg p-3 rounded-lg mb-2">
                <p className="text-sm text-gray-300">{problem.hints[currentHintIndex]}</p>
              </div>
              {currentHintIndex < problem.hints.length - 1 && (
                <button
                  onClick={handleNextHint}
                  className="text-sm text-neon-cyan hover:underline"
                >
                  Show next hint →
                </button>
              )}
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={executing || !code.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
          >
            {executing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Code
              </>
            )}
          </button>

          {/* Test Results */}
          <AnimatePresence>
            {testResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-4">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        result.passed
                          ? 'bg-neon-green/20 border border-neon-green'
                          : 'bg-red-400/20 border border-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <span className="text-neon-green">✅</span>
                        ) : (
                          <span className="text-red-400">❌</span>
                        )}
                        <span className="font-bold">Test {idx + 1}</span>
                        {result.status && (
                          <span className="text-xs text-gray-400 ml-2">({result.status})</span>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Input: <code className="text-neon-green">{result.input}</code></div>
                        <div>Expected: <code className="text-neon-cyan">{result.expected}</code></div>
                        {!result.passed && (
                          <>
                            <div>Got: <code className="text-red-400">{result.got}</code></div>
                            {result.error && (
                              <div className="mt-2 p-2 bg-red-900/20 rounded text-xs">
                                <span className="text-red-400 font-bold">Error:</span>
                                <pre className="text-red-300 mt-1 whitespace-pre-wrap">{result.error}</pre>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion */}
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 border-2 border-neon-green"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-neon-green" />
                <h3 className="text-2xl font-bold text-neon-green">Challenge Complete!</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Great job! You've mastered the {difficulty} level for {unit}.
              </p>
              <button
                onClick={handleNextDifficulty}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {difficulty === 'Advanced' ? 'Complete Unit' : `Try ${difficulty === 'Basic' ? 'Medium' : 'Advanced'} Level`}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

