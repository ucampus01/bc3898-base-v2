// lib/supabase/client.ts
// Supabase 브라우저 클라이언트 (클라이언트 컴포넌트용)

import { createBrowserClient } from '@supabase/ssr'

// 🔧 변경 가능: 환경변수에서 자동으로 가져오므로 수정 불필요
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 싱글톤 패턴으로 클라이언트 재사용
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}