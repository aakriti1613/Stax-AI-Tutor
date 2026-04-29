'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  PRICING_PLANS,
  DOMAIN_PRICING,
  calculateCustomPlanPrice,
  type PlanType,
} from '@/lib/pricing'
import { DOMAINS, type Domain } from '@/lib/subjects'
import { Check, X, Sparkles, Crown, Star, Zap } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [customDomains, setCustomDomains] = useState<Domain[]>([])
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)

  const handlePlanSelect = (planId: PlanType) => {
    if (planId === 'custom') {
      setShowCustomBuilder(true)
      setSelectedPlan('custom')
    } else {
      setSelectedPlan(planId)
      void handlePurchase(planId)
    }
  }

  const handlePurchase = async (planId: PlanType) => {
    try {
      // TODO: Replace with real user data from auth/profile
      const name = 'Test User'
      const email = 'test@example.com'
      const phone = '9999999999'

      const res = await axios.post('/api/payments/payu/checkout', {
        planId,
        name,
        email,
        phone,
      })

      const { actionUrl, params } = res.data as {
        actionUrl: string
        params: Record<string, string>
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = actionUrl

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error: any) {
      console.error('Error starting payment:', error)
      alert(error?.response?.data?.error || 'Failed to start payment')
    }
  }

  const toggleDomain = (domain: Domain) => {
    setCustomDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    )
  }

  const customPrice = calculateCustomPlanPrice(customDomains)

  const handleCustomPurchase = async () => {
    if (customDomains.length === 0) {
      alert('Please select at least one domain')
      return
    }

    try {
      const name = 'Test User'
      const email = 'test@example.com'
      const phone = '9999999999'

      const res = await axios.post('/api/payments/payu/checkout', {
        planId: 'custom',
        customDomains,
        name,
        email,
        phone,
      })

      const { actionUrl, params } = res.data as {
        actionUrl: string
        params: Record<string, string>
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = actionUrl

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error: any) {
      console.error('Error starting custom payment:', error)
      alert(error?.response?.data?.error || 'Failed to start payment')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold neon-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your learning journey. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {(['platinum', 'gold', 'silver'] as PlanType[]).map((planId) => {
            const plan = PRICING_PLANS[planId]
            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: planId === 'platinum' ? 0.1 : planId === 'gold' ? 0.2 : 0.3 }}
                className={`glass-card p-6 relative ${plan.popular ? 'ring-2 ring-neon-cyan scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-neon-cyan text-black px-4 py-1 rounded-full text-sm font-bold">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">
                    {planId === 'platinum' && <Crown className="w-12 h-12 text-neon-cyan mx-auto mb-2" />}
                    {planId === 'gold' && <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />}
                    {planId === 'silver' && <Zap className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-neon-cyan">
                      ₹{plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-gray-500 line-through ml-2">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                    <div className="text-sm text-gray-400 mt-1">/{plan.duration}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-sm font-semibold text-neon-cyan mb-2">
                    Includes {plan.domains.length} domain{plan.domains.length > 1 ? 's' : ''}:
                  </div>
                  {plan.domains.map(domainId => (
                    <div key={domainId} className="text-sm text-gray-300">
                      • {DOMAINS[domainId].name}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(planId)}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    plan.popular
                      ? 'bg-neon-cyan text-black hover:bg-neon-cyan/80'
                      : 'bg-neon-purple text-white hover:bg-neon-purple/80'
                  }`}
                >
                  Choose Plan
                </button>
              </motion.div>
            )
          })}

          {/* Custom Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 relative border-2 border-dashed border-neon-purple"
          >
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-neon-purple mx-auto mb-2" />
              <h3 className="text-2xl font-bold mb-2">{PRICING_PLANS.custom.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{PRICING_PLANS.custom.description}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-neon-purple">
                  ₹{customPrice || 0}
                </span>
                <div className="text-sm text-gray-400 mt-1">/month</div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('custom')}
              className="w-full py-3 rounded-lg font-bold bg-neon-purple text-white hover:bg-neon-purple/80 transition-all"
            >
              Build Custom Plan
            </button>
          </motion.div>
        </div>

        {/* Custom Plan Builder */}
        {showCustomBuilder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Build Your Custom Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {(Object.keys(DOMAINS) as Domain[]).map(domainId => {
                const domain = DOMAINS[domainId]
                const isSelected = customDomains.includes(domainId)
                const price = DOMAIN_PRICING[domainId]
                
                return (
                  <motion.div
                    key={domainId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleDomain(domainId)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-neon-cyan bg-neon-cyan/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{domain.icon}</span>
                        <div>
                          <h3 className="font-bold">{domain.name}</h3>
                          <p className="text-sm text-gray-400">{domain.subjects.length} subjects</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-neon-cyan font-bold">₹{price}</div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-neon-cyan mt-1" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold">
                    Total: ₹{customPrice}
                  </div>
                  <div className="text-sm text-gray-400">
                    {customDomains.length} domain{customDomains.length !== 1 ? 's' : ''} selected
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowCustomBuilder(false)
                      setCustomDomains([])
                    }}
                    className="px-6 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomPurchase}
                    disabled={customDomains.length === 0}
                    className="px-6 py-2 rounded-lg bg-neon-cyan text-black font-bold hover:bg-neon-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Purchase Custom Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 mt-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Silver</th>
                  <th className="text-center py-4 px-4">Gold</th>
                  <th className="text-center py-4 px-4">Platinum</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_PLANS.platinum.features.map((feature, idx) => (
                  <tr key={feature.id} className="border-b border-gray-800">
                    <td className="py-4 px-4">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {PRICING_PLANS.silver.features[idx]?.included ? (
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {PRICING_PLANS.gold.features[idx]?.included ? (
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-neon-green mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

