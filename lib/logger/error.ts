// lib/logger/error.ts
// 에러 추적 시스템

import { logErrorToGoogleSheets } from '../sheets/logger'

interface ErrorLogOptions {
  userId?: string
  context?: string
  metadata?: any
}

// 🔧 변경 가능: 에러 로깅 함수
export function logError(error: Error, options: ErrorLogOptions = {}) {
  // 콘솔 로그
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    ...options,
  })

  // Google Sheets에 기록 (선택적)
  if (process.env.GOOGLE_SHEET_ID) {
    logErrorToGoogleSheets({
      userId: options.userId,
      errorMessage: error.message,
      errorStack: error.stack,
      context: options.context,
    }).catch(err => {
      console.error('에러 로그 기록 실패:', err)
    })
  }

  // 🔧 변경 가능: Sentry 등 외부 에러 추적 서비스 연동
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, {
  //     user: { id: options.userId },
  //     contexts: { custom: options.metadata },
  //   })
  // }
}

// API 에러 응답 생성
export function createErrorResponse(error: Error, statusCode: number = 500) {
  return {
    error: error.message || '서버 오류가 발생했습니다',
    statusCode,
    timestamp: new Date().toISOString(),
  }
}

// 에러 타입 체크
export function isApiError(error: any): error is { message: string; statusCode: number } {
  return error && typeof error.message === 'string' && typeof error.statusCode === 'number'
}