import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Try to list available models
    const modelsToTest = [
      'gemini-pro',
      'models/gemini-pro',
      'gemini-1.5-pro',
      'models/gemini-1.5-pro',
      'gemini-1.0-pro',
      'models/gemini-1.0-pro',
      'gemini-1.5-flash',
      'models/gemini-1.5-flash'
    ]

    const results: Array<{ model: string; status: string; error?: string }> = []

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const testResult = await model.generateContent('Say "test"')
        const response = await testResult.response
        const text = response.text()
        
        results.push({
          model: modelName,
          status: '✅ Works',
        })
        break // Use first working model
      } catch (error: any) {
        results.push({
          model: modelName,
          status: '❌ Failed',
          error: error.message || 'Unknown error'
        })
      }
    }

    return NextResponse.json({ 
      message: 'Model test results',
      results,
      recommended: results.find(r => r.status === '✅ Works')?.model || 'None found'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to test models' },
      { status: 500 }
    )
  }
}
















