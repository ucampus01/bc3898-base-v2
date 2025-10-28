// app/api/stripe/checkout/route.ts
// Stripe 결제 세션 생성 API

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// 🔧 변경 가능: Stripe 초기화
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plan = searchParams.get('plan')

    if (!plan) {
      return NextResponse.json(
        { error: '플랜을 선택해주세요' },
        { status: 400 }
      )
    }

    // 사용자 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // 🔧 변경 가능: 플랜별 가격 ID 매핑
    const priceIds: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_BASIC!,
      standard: process.env.STRIPE_PRICE_STANDARD!,
      premium: process.env.STRIPE_PRICE_PREMIUM!,
    }

    const priceId = priceIds[plan]

    if (!priceId) {
      return NextResponse.json(
        { error: '유효하지 않은 플랜입니다' },
        { status: 400 }
      )
    }

    // Stripe 체크아웃 세션 생성
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // 🔧 변경 가능: 무료 체험 기간 (일 단위)
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: user.id,
          plan: plan,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription?canceled=true`,
      metadata: {
        user_id: user.id,
        plan: plan,
      },
    })

    // 세션 정보 DB에 임시 저장
    await supabase.from('checkout_sessions').insert({
      user_id: user.id,
      session_id: session.id,
      plan: plan,
      status: 'pending',
    })

    return NextResponse.redirect(session.url!)
  } catch (error: any) {
    console.error('Stripe 체크아웃 오류:', error)
    return NextResponse.json(
      { error: error.message || '결제 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}