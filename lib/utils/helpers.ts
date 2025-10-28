// lib/utils/helpers.ts
// 공통 헬퍼 함수

// 숫자 포맷팅 (천 단위 구분)
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return 'N/A'
  return num.toLocaleString('ko-KR')
}

// 통화 포맷팅
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return 'N/A'
  return `${amount.toLocaleString('ko-KR')}원`
}

// 날짜 포맷팅
export function formatDate(date: string | Date | undefined | null, format: 'short' | 'long' = 'short'): string {
  if (!date) return 'N/A'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('ko-KR')
  }
  
  return d.toLocaleString('ko-KR')
}

// 상대 시간 (예: "3분 전", "2시간 전")
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  
  return formatDate(d)
}

// 문자열 자르기
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

// 퍼센트 계산
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// 🔧 변경 가능: 경쟁도 표시
export function getCompetitionLabel(competition: string | undefined): string {
  if (!competition) return 'N/A'
  
  const comp = competition.toLowerCase()
  if (comp === 'low' || comp === '낮음') return '낮음'
  if (comp === 'medium' || comp === '중간') return '중간'
  if (comp === 'high' || comp === '높음') return '높음'
  
  return competition
}

// 색상 생성 (프로젝트용)
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', 
    '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 이메일 마스킹
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  
  const masked = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
  return `${masked}@${domain}`
}

// 🔧 변경 가능: 플랫폼 아이콘 가져오기
export function getPlatformIcon(platform: string | undefined): string {
  const icons: Record<string, string> = {
    naver: '🟢',
    google: '🔍',
    youtube: '🎬',
    coupang: '🛒',
    daum: '💬',
  }
  return icons[platform?.toLowerCase() || ''] || '📊'
}

// 멤버십 티어 라벨
export function getMembershipLabel(tier: string): string {
  const labels: Record<string, string> = {
    free: '무료',
    basic: '베이직',
    standard: '스탠다드',
    premium: '프리미엄',
  }
  return labels[tier.toLowerCase()] || tier
}