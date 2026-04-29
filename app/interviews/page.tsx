'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, BookOpen, Users, TrendingUp, Search, Plus, Filter } from 'lucide-react'
import { InterviewExperience, InterviewArticle } from '@/lib/types/interviews'
import { Domain, DOMAINS } from '@/lib/subjects'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'articles'>('experiences')
  const [experiences, setExperiences] = useState<InterviewExperience[]>([])
  const [articles, setArticles] = useState<InterviewArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [activeTab, domainFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('type', activeTab)
      if (domainFilter !== 'all') {
        params.append('domain', domainFilter)
      }

      const response = await axios.get(`/api/interviews?${params.toString()}`)
      
      if (activeTab === 'experiences') {
        setExperiences(response.data.experiences || [])
      } else {
        setArticles(response.data.articles || [])
      }
    } catch (error: any) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredExperiences = experiences.filter(exp => 
    searchQuery === '' || 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredArticles = articles.filter(art =>
    searchQuery === '' ||
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold neon-text mb-4 flex items-center gap-3">
            <Briefcase className="w-12 h-12 text-neon-cyan" />
            Interview Resources
          </h1>
          <p className="text-xl text-gray-400">
            Learn from real interview experiences and expert articles
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'experiences'
                ? 'bg-neon-cyan text-black'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            <Users className="w-5 h-5" />
            Experiences
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'bg-neon-cyan text-black'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Articles
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan"
              />
            </div>
            <Link href="/interviews/post">
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Post {activeTab === 'experiences' ? 'Experience' : 'Article'}
              </button>
            </Link>
          </div>

          {/* Domain Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Domain
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDomainFilter('all')}
                className={`px-4 py-1 rounded-lg text-sm font-bold transition-all ${
                  domainFilter === 'all'
                    ? 'bg-neon-cyan text-black'
                    : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
                }`}
              >
                All
              </button>
              {(Object.keys(DOMAINS) as Domain[]).map(domainId => {
                const domain = DOMAINS[domainId]
                return (
                  <button
                    key={domainId}
                    onClick={() => setDomainFilter(domainId)}
                    className={`px-4 py-1 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${
                      domainFilter === domainId
                        ? 'bg-neon-cyan text-black'
                        : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
                    }`}
                  >
                    <span>{domain.icon}</span>
                    <span>{domain.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : activeTab === 'experiences' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperiences.length === 0 ? (
              <div className="col-span-2 glass-card p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No interview experiences found</p>
                <Link href="/interviews/post">
                  <button className="btn-primary">Share Your Experience</button>
                </Link>
              </div>
            ) : (
              filteredExperiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Link href={`/interviews/experiences/${exp.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-neon-cyan">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <span>{exp.company}</span>
                          <span>•</span>
                          <span>{exp.position}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        exp.verdict === 'selected' ? 'bg-neon-green/20 text-neon-green' :
                        exp.verdict === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {exp.verdict.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <span>{DOMAINS[exp.domain]?.icon}</span>
                        <span>{DOMAINS[exp.domain]?.name}</span>
                      </div>
                      <span>•</span>
                      <span>{exp.rounds.length} rounds</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>👁️ {exp.views}</span>
                        <span>❤️ {exp.likes}</span>
                        <span>💬 {exp.comments}</span>
                      </div>
                      <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length === 0 ? (
              <div className="col-span-3 glass-card p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No articles found</p>
                <Link href="/interviews/post">
                  <button className="btn-primary">Write an Article</button>
                </Link>
              </div>
            ) : (
              filteredArticles.map((art, idx) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Link href={`/interviews/articles/${art.id}`}>
                    {art.featuredImage && (
                      <div className="w-full h-40 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg mb-4" />
                    )}
                    <h3 className="text-xl font-bold mb-2 text-neon-cyan">{art.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{art.excerpt}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <span>{DOMAINS[art.domain]?.icon}</span>
                      <span>{DOMAINS[art.domain]?.name}</span>
                      <span>•</span>
                      <span className="capitalize">{art.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {art.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>👁️ {art.views}</span>
                        <span>❤️ {art.likes}</span>
                      </div>
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}



