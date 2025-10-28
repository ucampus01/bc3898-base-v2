// types/api.ts
// API 응답 타입 정의

// 기본 API 응답
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  statusCode?: number
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// 네이버 검색광고 API 응답
export interface NaverAdsResponse {
  keyword: string
  monthlyPcQcCnt?: number
  monthlyMobileQcCnt?: number
  monthlyAvePcClkCnt?: number
  monthlyAveMobileClkCnt?: number
  compIdx?: string
  relKeywords?: Array<{
    relKeyword: string
    monthlyPcQcCnt?: number
    monthlyAvePcClkCnt?: number
    compIdx?: string
  }>
}

// 네이버 데이터랩 API 응답
export interface NaverDatalabResponse {
  keywords: string[]
  startDate: string
  endDate: string
  data: Array<{
    period: string
    values: number[]
  }>
}

// 유튜브 API 응답
export interface YouTubeSearchResponse {
  keyword: string
  totalResults: number
  avgViews: number
  competition: string
  videos: Array<{
    videoId: string
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    thumbnailUrl: string
    viewCount: number
    likeCount: number
    commentCount: number
    videoUrl: string
  }>
  relatedKeywords: string[]
}

// 쿠팡 API 응답
export interface CoupangProductsResponse {
  keyword: string
  totalCount: number
  avgPrice: number
  minPrice: number
  maxPrice: number
  products: Array<{
    productId: string
    productName: string
    productPrice: number
    productImage: string
    productUrl: string
    isRocket?: boolean
    isFreeShipping?: boolean
  }>
}

// 사용량 체크 응답
export interface UsageCheckResponse {
  isAllowed: boolean
  remaining: number
  limit: number
  currentUsage?: number
  message: string
  tier: string
}

// 🔧 변경 가능: 통계 응답
export interface StatsResponse {
  totalKeywords: number
  totalProjects: number
  totalUsageToday: number
  membershipTier: string
}