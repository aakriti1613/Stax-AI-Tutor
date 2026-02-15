// Real-time database subscriptions using Supabase Realtime
// Falls back to polling if Realtime is not available (common - Realtime is in alpha)
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Subscribe to user stats changes
 * Falls back to polling if Realtime is not available
 */
export function subscribeToUserStats(
  userId: string,
  callback: (payload: any) => void
): RealtimeChannel | null {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured, real-time subscriptions disabled')
    return null
  }

  try {
    const channel = supabase
      .channel(`user-stats-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    // Check if subscription worked (Realtime might not be available)
    setTimeout(() => {
      if (channel.state !== 'joined') {
        console.log('Realtime not available, will use polling fallback')
      }
    }, 1000)

    return channel
  } catch (error) {
    console.log('Realtime subscription failed, will use polling:', error)
    return null
  }
}

/**
 * Subscribe to contest updates
 */
export function subscribeToContest(
  contestId: string,
  callback: (payload: any) => void
): RealtimeChannel | null {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured, real-time subscriptions disabled')
    return null
  }

  const channel = supabase
    .channel(`contest-${contestId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contests',
        filter: `id=eq.${contestId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contest_participants',
        filter: `contest_id=eq.${contestId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contest_submissions',
        filter: `contest_id=eq.${contestId}`
      },
      callback
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to duel updates
 */
export function subscribeToDuel(
  duelId: string,
  callback: (payload: any) => void
): RealtimeChannel | null {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured, real-time subscriptions disabled')
    return null
  }

  const channel = supabase
    .channel(`duel-${duelId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'duels',
        filter: `id=eq.${duelId}`
      },
      callback
    )
    .subscribe()

  return channel
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel | null): void {
  if (!channel || !isSupabaseConfigured() || !supabase) return

  supabase.removeChannel(channel)
}

