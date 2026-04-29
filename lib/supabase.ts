// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Track connection failures to avoid spam
let connectionFailureLogged = false
let lastFailureTime = 0
const FAILURE_LOG_INTERVAL = 60000 // Log at most once per minute

export function logConnectionFailure(message: string) {
  const now = Date.now()
  if (!connectionFailureLogged || (now - lastFailureTime) > FAILURE_LOG_INTERVAL) {
    console.warn(`⚠️ ${message}`)
    connectionFailureLogged = true
    lastFailureTime = now
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Contests and marathons will be unavailable.')
}

// Create Supabase client for client-side usage
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Create Supabase admin client for server-side usage (with service role key)
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role key is required for admin operations')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}













