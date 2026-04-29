// Database utilities for interview experiences and articles
import { supabase, isSupabaseConfigured, getSupabaseAdmin, logConnectionFailure } from '@/lib/supabase'
import {
  InterviewExperience,
  InterviewArticle,
  InterviewComment,
  CreateInterviewPost,
  InterviewType,
  ExperienceLevel,
  CompanyType,
} from '@/lib/types/interviews'
import { Domain } from '@/lib/subjects'

// Fallback sample data when Supabase is not configured or unavailable
const now = new Date()

const FALLBACK_EXPERIENCES: InterviewExperience[] = [
  {
    id: 'sample-exp-1',
    title: 'Google SDE Intern Interview Experience',
    content:
      'I applied through campus placements. The process had an online test, two DSA rounds, and one system design + behavioral round...',
    authorId: 'sample-user-1',
    authorName: 'Aditi Sharma',
    authorAvatar: undefined,
    company: 'Google',
    companyType: 'faang',
    position: 'SDE Intern',
    domain: 'placement',
    experienceLevel: 'intern',
    interviewType: 'experience',
    rounds: [
      {
        id: 'r1',
        roundNumber: 1,
        roundName: 'Online Assessment',
        description: '3 DSA questions on arrays, strings, and graphs.',
        questions: ['Find number of islands', 'Longest palindromic substring'],
        difficulty: 'medium',
        duration: 90,
      },
      {
        id: 'r2',
        roundNumber: 2,
        roundName: 'Technical Interview',
        description: 'Focused on DSA, OOPs, and projects.',
        questions: ['Design an LRU cache', 'Explain polymorphism with examples'],
        difficulty: 'medium',
        duration: 60,
      },
    ],
    tips: [
      'Be very strong with DSA fundamentals.',
      'Communicate your approach clearly before coding.',
    ],
    verdict: 'selected',
    compensation: { base: 800000, currency: 'INR' },
    tags: ['C++', 'DSA', 'System Design', 'Campus'],
    likes: 42,
    comments: 5,
    views: 320,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-exp-2',
    title: 'Frontend Engineer Interview at StartupX',
    content:
      'The interview focused heavily on React, TypeScript, and system design for frontend. I had one take-home assignment and two live coding rounds...',
    authorId: 'sample-user-2',
    authorName: 'Rahul Verma',
    authorAvatar: undefined,
    company: 'StartupX',
    companyType: 'startup',
    position: 'Frontend Engineer',
    domain: 'frontend',
    experienceLevel: 'mid-level',
    interviewType: 'experience',
    rounds: [
      {
        id: 'r1',
        roundNumber: 1,
        roundName: 'Take-home Assignment',
        description: 'Build a dashboard using React and a public API.',
        questions: [],
        difficulty: 'medium',
        duration: 180,
      },
      {
        id: 'r2',
        roundNumber: 2,
        roundName: 'Live Coding + System Design',
        description: 'Implement debounced search and discuss design of a component library.',
        questions: ['Implement debounced input box', 'Design a modal component API'],
        difficulty: 'medium',
        duration: 75,
      },
    ],
    tips: ['Know React hooks deeply.', 'Practice building small UI components from scratch.'],
    verdict: 'selected',
    compensation: { base: 1600000, currency: 'INR' },
    tags: ['React', 'TypeScript', 'System Design'],
    likes: 27,
    comments: 3,
    views: 210,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-exp-3',
    title: 'Backend Engineer Interview at FinTech Corp',
    content:
      'The process involved DSA, backend design, and a lot of questions around databases and scaling APIs...',
    authorId: 'sample-user-3',
    authorName: 'Priya Nair',
    authorAvatar: undefined,
    company: 'FinTech Corp',
    companyType: 'product-based',
    position: 'Backend Engineer',
    domain: 'backend',
    experienceLevel: 'mid-level',
    interviewType: 'hiring-process',
    rounds: [
      {
        id: 'r1',
        roundNumber: 1,
        roundName: 'DSA + SQL',
        description: 'Mixed DSA and SQL questions.',
        questions: ['Design a leaderboard table', 'Top K frequent elements'],
        difficulty: 'medium',
        duration: 60,
      },
      {
        id: 'r2',
        roundNumber: 2,
        roundName: 'Backend System Design',
        description: 'Design a payments API with idempotency guarantees.',
        questions: ['Design payments API', 'How to handle idempotency'],
        difficulty: 'hard',
        duration: 75,
      },
    ],
    tips: ['Understand HTTP, REST, and database indexing.', 'Practice system design basics.'],
    verdict: 'selected',
    compensation: { base: 2200000, currency: 'INR' },
    tags: ['Node.js', 'PostgreSQL', 'System Design'],
    likes: 31,
    comments: 4,
    views: 180,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-exp-4',
    title: 'Machine Learning Engineer Interview at AI Labs',
    content:
      'The interview focused on ML fundamentals, math, and a take-home modelling assignment...',
    authorId: 'sample-user-4',
    authorName: 'Siddharth Gupta',
    authorAvatar: undefined,
    company: 'AI Labs',
    companyType: 'product-based',
    position: 'ML Engineer',
    domain: 'aiml',
    experienceLevel: 'new-grad',
    interviewType: 'experience',
    rounds: [
      {
        id: 'r1',
        roundNumber: 1,
        roundName: 'ML Quiz',
        description: 'Questions on bias-variance, regularization, and evaluation metrics.',
        questions: ['Explain bias-variance tradeoff', 'What is ROC-AUC?'],
        difficulty: 'medium',
        duration: 60,
      },
    ],
    tips: ['Revise core ML algorithms and metrics.', 'Have 1–2 ML projects ready to explain.'],
    verdict: 'pending',
    compensation: { base: 1800000, currency: 'INR' },
    tags: ['Machine Learning', 'Python', 'Data Science'],
    likes: 15,
    comments: 2,
    views: 120,
    createdAt: now,
    updatedAt: now,
  },
]

const FALLBACK_ARTICLES: InterviewArticle[] = [
  {
    id: 'sample-art-1',
    title: 'How to Prepare for DSA Interviews',
    content:
      'To crack DSA interviews, start with arrays and strings, then move to linked lists, trees, graphs, and DP. Practice on platforms like LeetCode and avoid memorising solutions...',
    excerpt: 'A practical roadmap to prepare for DSA interviews effectively.',
    authorId: 'sample-user-5',
    authorName: 'Interview Coach',
    authorAvatar: undefined,
    domain: 'placement',
    category: 'technical',
    tags: ['DSA', 'Interview Prep'],
    featuredImage: undefined,
    likes: 50,
    comments: 6,
    views: 420,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sample-art-2',
    title: 'Frontend System Design Basics',
    content:
      'Frontend system design focuses on performance, caching, and user experience. Learn how to split bundles, lazy load routes, and use CDNs effectively...',
    excerpt: 'Key concepts to discuss in frontend system design rounds.',
    authorId: 'sample-user-6',
    authorName: 'UI Architect',
    authorAvatar: undefined,
    domain: 'frontend',
    category: 'technical',
    tags: ['Frontend', 'System Design'],
    featuredImage: undefined,
    likes: 24,
    comments: 1,
    views: 150,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
]

export interface InterviewExperienceDB {
  id: string
  title: string
  content: string
  author_id: string
  company: string
  company_type: string
  position: string
  domain: string
  experience_level: string
  interview_type: string
  rounds: any // JSONB
  tips: string[] // JSONB
  verdict: string
  compensation: any // JSONB
  tags: string[] // JSONB
  likes: number
  comments: number
  views: number
  created_at: string
  updated_at: string
}

export interface InterviewArticleDB {
  id: string
  title: string
  content: string
  excerpt: string
  author_id: string
  domain: string
  category: string
  tags: string[] // JSONB
  featured_image: string | null
  likes: number
  comments: number
  views: number
  published: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all interview experiences
 * @param domain Optional domain filter
 * @param type Optional type filter
 */
function filterFallbackExperiences(domain?: Domain, type?: InterviewType): InterviewExperience[] {
  let data = [...FALLBACK_EXPERIENCES]
  if (domain) {
    data = data.filter((exp) => exp.domain === domain)
  }
  if (type) {
    data = data.filter((exp) => exp.interviewType === type)
  }
  return data
}

function filterFallbackArticles(domain?: Domain, category?: string): InterviewArticle[] {
  let data = [...FALLBACK_ARTICLES]
  if (domain) {
    data = data.filter((art) => art.domain === domain)
  }
  if (category) {
    data = data.filter((art) => art.category === category)
  }
  return data
}

export async function getInterviewExperiences(
  domain?: Domain,
  type?: InterviewType
): Promise<InterviewExperience[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return filterFallbackExperiences(domain, type)
  }

  try {
    let query = supabase!
      .from('interview_experiences')
      .select('*, author:author_id(id, username, display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (domain) {
      query = query.eq('domain', domain)
    }

    if (type) {
      query = query.eq('interview_type', type)
    }

    const { data, error } = await query

    if (error) {
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Interview experiences unavailable.')
        return filterFallbackExperiences(domain, type)
      }
      if (error.code === 'PGRST205') {
        return filterFallbackExperiences(domain, type)
      }
      console.error('Error getting interview experiences:', error)
      return filterFallbackExperiences(domain, type)
    }

    if (!data || data.length === 0) {
      return filterFallbackExperiences(domain, type)
    }

    return (data || []).map(convertExperienceFromDB)
  } catch (error: any) {
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
      logConnectionFailure('Supabase connection failed. Interview experiences unavailable.')
      return filterFallbackExperiences(domain, type)
    }
    console.error('Error getting interview experiences:', error)
    return filterFallbackExperiences(domain, type)
  }
}

/**
 * Get interview experience by ID
 */
export async function getInterviewExperienceById(id: string): Promise<InterviewExperience | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase!
      .from('interview_experiences')
      .select('*, author:author_id(id, username, display_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error getting interview experience:', error)
      return null
    }

    // Increment views
    await supabase!
      .from('interview_experiences')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)

    return convertExperienceFromDB({ ...data, views: (data.views || 0) + 1 })
  } catch (error) {
    console.error('Error getting interview experience:', error)
    return null
  }
}

/**
 * Create a new interview experience
 */
export async function createInterviewExperience(
  authorId: string,
  post: CreateInterviewPost
): Promise<string | null> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return null
  }

  try {
    const { data, error } = await admin
      .from('interview_experiences')
      .insert({
        title: post.title,
        content: post.content,
        author_id: authorId,
        company: post.company || '',
        company_type: post.companyType || 'other',
        position: post.position || '',
        domain: post.domain,
        experience_level: post.experienceLevel || 'new-grad',
        interview_type: post.interviewType,
        rounds: post.rounds || [],
        tips: post.tips || [],
        verdict: post.verdict || 'pending',
        compensation: post.compensation || null,
        tags: post.tags || [],
        likes: 0,
        comments: 0,
        views: 0
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error creating interview experience:', error)
      return null
    }

    return data.id
  } catch (error: any) {
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
      logConnectionFailure('Supabase connection failed. Cannot create interview experience.')
      return null
    }
    console.error('Error creating interview experience:', error)
    return null
  }
}

/**
 * Get all interview articles
 * @param domain Optional domain filter
 * @param category Optional category filter
 */
export async function getInterviewArticles(
  domain?: Domain,
  category?: string
): Promise<InterviewArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return filterFallbackArticles(domain, category)
  }

  try {
    let query = supabase!
      .from('interview_articles')
      .select('*, author:author_id(id, username, display_name, avatar_url)')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (domain) {
      query = query.eq('domain', domain)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        logConnectionFailure('Supabase connection failed. Interview articles unavailable.')
        return filterFallbackArticles(domain, category)
      }
      if (error.code === 'PGRST205') {
        return filterFallbackArticles(domain, category)
      }
      console.error('Error getting interview articles:', error)
      return filterFallbackArticles(domain, category)
    }

    if (!data || data.length === 0) {
      return filterFallbackArticles(domain, category)
    }

    return (data || []).map(convertArticleFromDB)
  } catch (error: any) {
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
      logConnectionFailure('Supabase connection failed. Interview articles unavailable.')
      return filterFallbackArticles(domain, category)
    }
    console.error('Error getting interview articles:', error)
    return filterFallbackArticles(domain, category)
  }
}

/**
 * Get interview article by ID
 */
export async function getInterviewArticleById(id: string): Promise<InterviewArticle | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    const { data, error } = await supabase!
      .from('interview_articles')
      .select('*, author:author_id(id, username, display_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error getting interview article:', error)
      return null
    }

    // Increment views
    await supabase!
      .from('interview_articles')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)

    return convertArticleFromDB({ ...data, views: (data.views || 0) + 1 })
  } catch (error) {
    console.error('Error getting interview article:', error)
    return null
  }
}

/**
 * Create a new interview article
 */
export async function createInterviewArticle(
  authorId: string,
  post: CreateInterviewPost
): Promise<string | null> {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return null
  }

  try {
    const { data, error } = await admin
      .from('interview_articles')
      .insert({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 200),
        author_id: authorId,
        domain: post.domain,
        category: post.category || 'general',
        tags: post.tags || [],
        featured_image: post.featuredImage || null,
        likes: 0,
        comments: 0,
        views: 0,
        published: true
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Error creating interview article:', error)
      return null
    }

    return data.id
  } catch (error: any) {
    if (error?.message?.includes('fetch failed') || error?.message?.includes('ENOTFOUND')) {
      logConnectionFailure('Supabase connection failed. Cannot create interview article.')
      return null
    }
    console.error('Error creating interview article:', error)
    return null
  }
}

/**
 * Like an interview post
 */
export async function likeInterviewPost(
  postId: string,
  userId: string,
  type: 'experience' | 'article'
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const table = type === 'experience' ? 'interview_experiences' : 'interview_articles'
    const { data } = await supabase!
      .from(table)
      .select('likes')
      .eq('id', postId)
      .single()

    if (!data) return false

    await supabase!
      .from(table)
      .update({ likes: (data.likes || 0) + 1 })
      .eq('id', postId)

    return true
  } catch (error) {
    console.error('Error liking post:', error)
    return false
  }
}

// Helper functions
function convertExperienceFromDB(db: any): InterviewExperience {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    authorId: db.author_id,
    authorName: db.author?.display_name || db.author?.username || 'Anonymous',
    authorAvatar: db.author?.avatar_url,
    company: db.company,
    companyType: db.company_type as CompanyType,
    position: db.position,
    domain: db.domain as Domain,
    experienceLevel: db.experience_level as ExperienceLevel,
    interviewType: db.interview_type as InterviewType,
    rounds: db.rounds || [],
    tips: db.tips || [],
    verdict: db.verdict as 'selected' | 'rejected' | 'pending',
    compensation: db.compensation,
    tags: db.tags || [],
    likes: db.likes || 0,
    comments: db.comments || 0,
    views: db.views || 0,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at)
  }
}

function convertArticleFromDB(db: any): InterviewArticle {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    excerpt: db.excerpt,
    authorId: db.author_id,
    authorName: db.author?.display_name || db.author?.username || 'Anonymous',
    authorAvatar: db.author?.avatar_url,
    domain: db.domain as Domain,
    category: db.category as any,
    tags: db.tags || [],
    featuredImage: db.featured_image,
    likes: db.likes || 0,
    comments: db.comments || 0,
    views: db.views || 0,
    published: db.published,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at)
  }
}

