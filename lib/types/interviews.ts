// Interview Experiences and Articles Types
import { Domain } from '@/lib/subjects'

export type InterviewType = 'experience' | 'hiring-process' | 'article' | 'tips'
export type ExperienceLevel = 'intern' | 'new-grad' | 'mid-level' | 'senior' | 'staff'
export type CompanyType = 'product-based' | 'service-based' | 'startup' | 'faang' | 'other'

export interface InterviewExperience {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  company: string
  companyType: CompanyType
  position: string
  domain: Domain
  experienceLevel: ExperienceLevel
  interviewType: InterviewType
  rounds: InterviewRound[]
  tips: string[]
  verdict: 'selected' | 'rejected' | 'pending'
  compensation?: {
    base: number
    stock?: number
    bonus?: number
    currency: string
  }
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface InterviewRound {
  id: string
  roundNumber: number
  roundName: string
  description: string
  questions: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // in minutes
  feedback?: string
}

export interface InterviewArticle {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  authorName: string
  authorAvatar?: string
  domain: Domain
  category: 'preparation' | 'resume' | 'behavioral' | 'technical' | 'negotiation' | 'general'
  tags: string[]
  featuredImage?: string
  likes: number
  comments: number
  views: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InterviewComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  likes: number
  parentId?: string // For nested comments
  createdAt: Date
  updatedAt: Date
}

export interface CreateInterviewPost {
  title: string
  content: string
  company?: string
  companyType?: CompanyType
  position?: string
  domain: Domain
  experienceLevel?: ExperienceLevel
  interviewType: InterviewType
  rounds?: Omit<InterviewRound, 'id'>[]
  tips?: string[]
  verdict?: 'selected' | 'rejected' | 'pending'
  compensation?: {
    base: number
    stock?: number
    bonus?: number
    currency: string
  }
  tags: string[]
  category?: 'preparation' | 'resume' | 'behavioral' | 'technical' | 'negotiation' | 'general'
  excerpt?: string
  featuredImage?: string
}



