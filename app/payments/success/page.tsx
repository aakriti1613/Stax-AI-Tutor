'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const txnid = searchParams?.get('txnid')
  const status = searchParams?.get('status')

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-lg text-center"
      >
        <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-4">Thank you for purchasing a plan.</p>
        {txnid && (
          <p className="text-sm text-gray-500 mb-4">Transaction ID: {txnid}</p>
        )}
        <p className="text-sm text-gray-500 mb-6">Status: {status || 'success'}</p>
        <button
          onClick={() => router.push('/pricing')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pricing
        </button>
      </motion.div>
    </div>
  )
}
