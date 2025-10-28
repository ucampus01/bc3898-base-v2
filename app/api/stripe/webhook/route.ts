// app/api/stripe/webhook/route.ts
// Stripe Webhook 처리 (결제 완료 시 구독 활성화)

import { createServiceRoleClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// 🔧 변경 가능: Stripe 초기화
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook 서명 검증 실패:', err.message)
      return NextResponse.json(
        { error: 'Webhook 서명 검증 실패' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // 이벤트 타입별 처리
    switch (event.type) {
      // 구독 생성 (무료 체험 시작 또는 즉시 결제)
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id
        const plan = subscription.metadata.plan

        if (userId) {
          // 🔧 변경 가능: 구독 정보 저장 로직
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            plan: plan,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })

          // 사용자 역할 업데이트
          await supabase.from('users').update({
            membership_tier: plan,
          }).eq('id', userId)
        }
        break
      }

      // 구독 업데이트 (플랜 변경, 갱신 등)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        if (userId) {
          await supabase.from('subscriptions').update({
            status: subscription.status,
            plan: subscription.metadata.plan,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }).eq('stripe_subscription_id', subscription.id)

          // 구독이 활성화된 경우
          if (subscription.status === 'active') {
            await supabase.from('users').update({
              membership_tier: subscription.metadata.plan,
            }).eq('id', userId)
          }
        }
        break
      }

      // 구독 삭제 (취소 완료)
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        if (userId) {
          await supabase.from('subscriptions').update({
            status: 'canceled',
          }).eq('stripe_subscription_id', subscription.id)

          // 사용자를 무료 플랜으로 변경
          await supabase.from('users').update({
            membership_tier: 'free',
          }).eq('id', userId)
        }
        break
      }

      // 결제 성공
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // 🔧 변경 가능: 결제 성공 시 추가 로직 (이메일 발송 등)
        console.log('결제 성공:', invoice.id)
        break
      }

      // 결제 실패
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // 🔧 변경 가능: 결제 실패 시 알림 로직
        console.error('결제 실패:', invoice.id)
        break
      }

      default:
        console.log(`처리되지 않은 이벤트 타입: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook 처리 오류:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook 처리 실패' },
      { status: 500 }
    )
  }
}