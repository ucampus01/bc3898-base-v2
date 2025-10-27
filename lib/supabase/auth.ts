// lib/supabase/auth.ts
// 인증 관련 헬퍼 함수

import { createClient } from './server'
import { redirect } from 'next/navigation'

// 현재 사용자 가져오기
export async function getCurrentUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('사용자 조회 오류:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('인증 오류:', error)
    return null
  }
}

// 로그인 필수 페이지 보호
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

// 사용자 세션 가져오기
export async function getSession() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('세션 조회 오류:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('세션 오류:', error)
    return null
  }
}

// 소셜 로그인
// 🔧 변경 가능: provider 타입 추가 가능 (github, twitter 등)
export async function signInWithOAuth(provider: 'google' | 'facebook' | 'kakao' | 'naver') {
  const supabase = await createClient()
  
  // 🔧 변경 가능: redirectTo URL 커스터마이징
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// 이메일 로그인
export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// 회원가입
export async function signUp(email: string, password: string, metadata?: any) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      // 🔧 변경 가능: 이메일 확인 리다이렉트 URL
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// 로그아웃
export async function signOut() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

// 사용자 프로필 가져오기
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    throw error
  }
  
  return data
}

// 사용자 역할 업데이트
// 🔧 변경 가능: 역할 타입 추가/변경 가능
export async function updateUserRole(userId: string, role: 'blogger' | 'seller' | 'youtuber') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data
}