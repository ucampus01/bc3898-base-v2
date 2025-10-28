// lib/utils/rate-limit.ts
// API 요청 제한

interface RateLimitOptions {
  interval: number // 시간 간격 (밀리초)
  uniqueTokenPerInterval: number // 간격당 최대 요청 수
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// 🔧 변경 가능: 메모리 기반 Rate Limiter
class RateLimiter {
  private store: RateLimitStore = {}
  private options: RateLimitOptions

  constructor(options: RateLimitOptions) {
    this.options = options
  }

  // Rate limit 체크
  check(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now()
    const record = this.store[identifier]

    // 기록이 없거나 리셋 시간이 지난 경우
    if (!record || now >= record.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.options.interval,
      }
      return { 
        success: true, 
        remaining: this.options.uniqueTokenPerInterval - 1 
      }
    }

    // 제한 초과
    if (record.count >= this.options.uniqueTokenPerInterval) {
      return { 
        success: false, 
        remaining: 0 
      }
    }

    // 카운트 증가
    record.count++
    return { 
      success: true, 
      remaining: this.options.uniqueTokenPerInterval - record.count 
    }
  }

  // 클린업 (주기적으로 오래된 기록 제거)
  cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (now >= this.store[key].resetTime) {
        delete this.store[key]
      }
    })
  }
}

// 🔧 변경 가능: Rate Limiter 인스턴스 생성
// 1분당 60회 제한
export const rateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1분
  uniqueTokenPerInterval: 60, // 60회
})

// API별 Rate Limiter
export const apiRateLimiters = {
  // 키워드 분석: 1분당 10회
  keywordAnalysis: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  }),
  
  // 트렌드 조회: 1분당 5회
  trends: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5,
  }),
  
  // 일반 API: 1분당 30회
  general: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 30,
  }),
}

// 5분마다 클린업 실행
setInterval(() => {
  rateLimiter.cleanup()
  Object.values(apiRateLimiters).forEach(limiter => limiter.cleanup())
}, 5 * 60 * 1000)