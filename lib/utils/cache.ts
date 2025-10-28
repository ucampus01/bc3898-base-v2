// lib/utils/cache.ts
// 데이터 캐싱 헬퍼

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// 🔧 변경 가능: 메모리 기반 캐시
class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  // 데이터 저장
  set<T>(key: string, data: T, ttl: number = 300000): void { // 기본 5분
    const expiresAt = Date.now() + ttl
    this.cache.set(key, { data, expiresAt })
  }

  // 데이터 조회
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // 만료 체크
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  // 데이터 삭제
  delete(key: string): void {
    this.cache.delete(key)
  }

  // 모든 캐시 삭제
  clear(): void {
    this.cache.clear()
  }

  // 만료된 캐시 정리
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // 캐시 크기 조회
  size(): number {
    return this.cache.size
  }

  // 특정 패턴의 키 삭제
  deletePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// 🔧 변경 가능: 캐시 인스턴스 생성
export const cache = new SimpleCache()

// 캐시 키 생성 헬퍼
export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(':')
}

// 캐시 래퍼 함수 (함수 실행 결과 캐싱)
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 300000
): Promise<T> {
  // 캐시 확인
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // 함수 실행 및 캐싱
  const result = await fn()
  cache.set(key, result, ttl)
  return result
}

// 🔧 변경 가능: API 응답 캐싱 예시
export async function getCachedKeywordData(keyword: string) {
  const cacheKey = generateCacheKey('keyword', keyword)
  
  return withCache(
    cacheKey,
    async () => {
      // 실제 API 호출
      const response = await fetch(`/api/keywords/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })
      return response.json()
    },
    600000 // 10분 캐싱
  )
}

// 주기적으로 만료된 캐시 정리 (5분마다)
setInterval(() => {
  cache.cleanup()
}, 5 * 60 * 1000)

// 🔧 변경 가능: 특정 사용자의 캐시 삭제
export function clearUserCache(userId: string): void {
  cache.deletePattern(`user:${userId}`)
}

// 전역 캐시 통계
export function getCacheStats() {
  return {
    size: cache.size(),
    timestamp: new Date().toISOString(),
  }
}