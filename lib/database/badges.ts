// Database utilities for badges
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Badge } from '@/lib/types/profile'

export interface UserBadgeDB {
  id?: string
  user_id: string
  badge_id: string
  badge_name: string
  badge_description?: string
  badge_icon?: string
  earned_at?: string
}

/**
 * Save badge to database
 */
export async function saveBadgeToDatabase(userId: string, badge: Badge): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from('user_badges')
      .upsert({
        user_id: userId,
        badge_id: badge.id,
        badge_name: badge.name,
        badge_description: badge.description,
        badge_icon: badge.icon,
        earned_at: badge.earnedAt?.toISOString() || new Date().toISOString()
      }, {
        onConflict: 'user_id,badge_id'
      })

    if (error) {
      console.error('Error saving badge:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving badge:', error)
    return false
  }
}

/**
 * Get all badges for a user from database
 */
export async function getUserBadgesFromDatabase(userId: string): Promise<Badge[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error || !data) {
      console.error('Error getting badges:', error)
      return []
    }

    return data.map((dbBadge: UserBadgeDB) => ({
      id: dbBadge.badge_id,
      name: dbBadge.badge_name,
      description: dbBadge.badge_description || '',
      icon: dbBadge.badge_icon || '🏅',
      rarity: 'common' as const,
      earnedAt: dbBadge.earned_at ? new Date(dbBadge.earned_at) : new Date()
    }))
  } catch (error) {
    console.error('Error getting badges:', error)
    return []
  }
}

/**
 * Sync badges from localStorage to database
 */
export async function syncBadgesToDatabase(userId: string, badges: Badge[]): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
    // Get existing badges from database
    const dbBadges = await getUserBadgesFromDatabase(userId)
    const dbBadgeIds = new Set(dbBadges.map(b => b.id))

    // Save new badges
    for (const badge of badges) {
      if (!dbBadgeIds.has(badge.id)) {
        await saveBadgeToDatabase(userId, badge)
      }
    }
  } catch (error) {
    console.error('Error syncing badges:', error)
  }
}


