import { NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'

export async function GET() {
  try {
    console.log('🧪 Testing Gemini API connection...')
    
    const model = await getGeminiModel()
    const result = await model.generateContent('Say "Hello, Gemini is working!"')
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API is working!',
      response: text,
      model: 'Connected successfully'
    })
  } catch (error: any) {
    console.error('❌ Gemini API test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: error.toString(),
      troubleshooting: [
        '1. Verify your API key is correct in .env.local',
        '2. Check that the API key has access to Gemini models',
        '3. Ensure billing is enabled if required',
        '4. Visit https://aistudio.google.com/app/apikey to verify your key',
        '5. Try regenerating your API key'
      ]
    }, { status: 500 })
  }
}
