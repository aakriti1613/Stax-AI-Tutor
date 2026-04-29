import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPlan, calculateCustomPlanPrice, type PlanType } from '@/lib/pricing'
import type { Domain } from '@/lib/subjects'

interface PayUCheckoutRequest {
  planId: PlanType
  customDomains?: Domain[]
  name: string
  email: string
  phone: string
}

export async function POST(request: NextRequest) {
  try {
    const { planId, customDomains = [], name, email, phone } =
      (await request.json()) as PayUCheckoutRequest

    if (!planId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields (planId, name, email, phone)' },
        { status: 400 }
      )
    }

    const merchantKey = process.env.PAYU_MERCHANT_KEY
    const salt = process.env.PAYU_SALT
    const mode = process.env.PAYU_MODE || 'TEST'

    if (!merchantKey || !salt) {
      return NextResponse.json(
        { error: 'PayU is not configured. Please set PAYU_MERCHANT_KEY and PAYU_SALT in .env' },
        { status: 500 }
      )
    }

    const plan = getPlan(planId)
    const baseAmount =
      planId === 'custom' ? calculateCustomPlanPrice(customDomains) : plan.price

    if (baseAmount <= 0) {
      return NextResponse.json({ error: 'Invalid plan amount' }, { status: 400 })
    }

    const amount = baseAmount.toFixed(2)

    const txnid = 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 100000)

    const productinfo =
      planId === 'custom'
        ? `Custom Plan (${customDomains.join(',') || 'no-domains'})`
        : plan.name

    const udf1 = planId
    const udf2 = customDomains.join(',')
    const udf3 = ''
    const udf4 = ''
    const udf5 = ''

    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    const surl = `${baseUrl}/payments/success`
    const furl = `${baseUrl}/payments/failure`

    const hashString = [
      merchantKey,
      txnid,
      amount,
      productinfo,
      name,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      '',
      '',
      '',
      '',
      '',
      salt,
    ].join('|')

    const hash = crypto.createHash('sha512').update(hashString).digest('hex')

    const actionUrl =
      mode === 'TEST' ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment'

    const params: Record<string, string> = {
      key: merchantKey,
      txnid,
      amount,
      productinfo,
      firstname: name,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    }

    return NextResponse.json({ actionUrl, params })
  } catch (error: any) {
    console.error('Error initiating PayU checkout:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      {
        status: 500,
      }
    )
  }
}




