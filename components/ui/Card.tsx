// components/ui/Card.tsx
// 카드 컴포넌트

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: CardProps) {
  // 🔧 변경 가능: 카드 스타일
  const baseStyles = 'bg-white rounded-lg shadow-md p-6'
  const hoverStyles = hover ? 'hover:shadow-xl transition-shadow cursor-pointer' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// 카드 헤더 컴포넌트
export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

// 카드 타이틀 컴포넌트
export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

// 카드 설명 컴포넌트
export function CardDescription({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <p className={`text-gray-600 text-sm ${className}`}>
      {children}
    </p>
  )
}

// 카드 콘텐츠 컴포넌트
export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// 카드 푸터 컴포넌트
export function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`mt-4 pt-4 border-t ${className}`}>
      {children}
    </div>
  )
}