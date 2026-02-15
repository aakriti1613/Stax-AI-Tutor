import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment variables',
        check: 'Make sure .env.local exists in your project root with GEMINI_API_KEY=your_key'
      }, { status: 500 })
    }

    // Check API key format (should start with AIza...)
    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({
        success: false,
        error: 'API key format looks incorrect',
        note: 'Gemini API keys usually start with "AIza"',
        keyPrefix: apiKey.substring(0, 10) + '...',
        suggestion: 'Please verify your API key from https://aistudio.google.com/'
      }, { status: 500 })
    }

    // Try to initialize the client
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      
      // Try the simplest possible call with the most basic model name
      // Try various model name formats and versions
      const simpleModels = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-2.0-flash-exp',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-pro',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro-latest'
      ]
      
      for (const modelName of simpleModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName })
          const result = await model.generateContent('Hi')
          const response = await result.response
          const text = response.text()
          
          if (text) {
            return NextResponse.json({
              success: true,
              message: 'API key is valid!',
              workingModel: modelName,
              testResponse: text.substring(0, 50),
              apiKeyFormat: 'Valid',
              apiKeyPrefix: apiKey.substring(0, 10) + '...'
            })
          }
        } catch (modelError: any) {
          // Continue to next model
          continue
        }
      }
      
      return NextResponse.json({
        success: false,
        error: 'API key format is valid but no models are accessible',
        apiKeyFormat: 'Valid',
        apiKeyPrefix: apiKey.substring(0, 10) + '...',
        testedModels: simpleModels,
        suggestion: 'Your API key may not have access to Gemini models. Check https://aistudio.google.com/ to see available models and enable billing if needed.'
      }, { status: 500 })
      
    } catch (initError: any) {
      return NextResponse.json({
        success: false,
        error: 'Failed to initialize Gemini client',
        details: initError.message,
        suggestion: 'Please verify your API key is correct'
      }, { status: 500 })
    }
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      suggestion: 'Check your .env.local file and restart the server'
    }, { status: 500 })
  }
}

