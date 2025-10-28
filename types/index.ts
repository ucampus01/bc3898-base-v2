// types/index.ts
// TypeScript 타입 정의

// 사용자 타입
export interface User {
  id: string
  email: string
  name?: string
  role?: 'blogger' | 'seller' | 'youtuber'
  membership_tier: 'free' | 'basic' | 'standard' | 'premium'
  kiwi_balance: number
  created_at: string
  updated_at: string
}

// 구독 타입
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  plan: 'basic' | 'standard' | 'premium'
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid'
  current_period_start?: string
  current_period_end?: string
  trial_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// 키워드 타입
export interface Keyword {
  id: string
  user_id: string
  project_id?: string
  keyword: string
  search_volume?: number
  competition?: string
  cpc?: number
  platform?: 'naver' | 'google' | 'youtube' | 'coupang' | 'daum'
  metadata?: any
  notes?: string
  created_at: string
  updated_at: string
}

// 프로젝트 타입
export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  is_archived: boolean
  created_at: string
  updated_at: string
}

// 사용량 로그 타입
export interface UsageLog {
  id: string
  user_id: string
  service: string
  count: number
  created_at: string
  updated_at: string
}

// 🔧 변경 가능: 서비스 타입
export type ServiceType = 
  | 'keyword_analysis'
  | 'keyword_expand'
  | 'quick_search'
  | 'trends'
  | 'rank_tracking'
  | 'influence'
  | 'naver_ads'
  | 'naver_datalab'
  | 'daum_datalab'
  | 'coupang_wing'
  | 'youtube_keywords'

// 플랫폼 타입
export type Platform = 'naver' | 'google' | 'youtube' | 'coupang' | 'daum'

// 멤버십 티어 타입
export type MembershipTier = 'free' | 'basic' | 'standard' | 'premium'

// 사용자 역할 타입
export type UserRole = 'blogger' | 'seller' | 'youtuber'