import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set in environment variables' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Try to list available models using the API
    // Note: This might not work with all API keys, but we'll try
    try {
      // Try to get models list (if supported)
      const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp',
        'gemini-pro',
        'gemini-1.0-pro',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro-latest'
      ]

      const results: Array<{
        model: string
        status: 'working' | 'failed' | 'empty'
        error?: string
        response?: string
      }> = []

      for (const modelName of modelsToTest) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })
          const result = await model.generateContent('Say "Hello"')
          const response = await result.response
          const text = response.text()
          
          if (text && text.trim().length > 0) {
            results.push({
              model: modelName,
              status: 'working',
              response: text.substring(0, 50)
            })
          } else {
            results.push({
              model: modelName,
              status: 'empty'
            })
          }
        } catch (error: any) {
          results.push({
            model: modelName,
            status: 'failed',
            error: error.message?.substring(0, 200) || 'Unknown error'
          })
        }
      }

      const workingModels = results.filter(r => r.status === 'working')
      
      return NextResponse.json({
        success: workingModels.length > 0,
        workingModels: workingModels.map(r => r.model),
        allResults: results,
        recommendation: workingModels.length > 0 
          ? `Use model: ${workingModels[0].model}`
          : 'No working models found. Please check your API key permissions.'
      })
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to test models',
        suggestion: 'Please verify your API key at https://aistudio.google.com/'
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to list models',
        details: 'Check your GEMINI_API_KEY in .env.local'
      },
      { status: 500 }
    )
  }
}
















