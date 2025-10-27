// app/layout.tsx
// 전역 레이아웃

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { Toaster } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

// 🔧 변경 가능: 메타데이터 커스터마이징
export const metadata: Metadata = {
  title: '키워드 분석 서비스 - 블로거/셀러/유튜버를 위한 토탈 솔루션',
  description: '네이버, 구글, 유튜브, 쿠팡 키워드 분석을 한 곳에서',
  keywords: '키워드 분석, SEO, 블로그, 쇼핑몰, 유튜브',
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: '키워드 분석 서비스',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Toaster />
        
        {/* 🔧 변경 가능: 푸터 추가 가능 */}
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 키워드 분석 서비스. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}