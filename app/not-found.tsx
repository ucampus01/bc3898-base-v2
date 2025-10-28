// app/not-found.tsx
// 404 Not Found 페이지

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            홈으로 이동
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            대시보드
          </Link>
        </div>

        {/* 빠른 링크 */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-4">빠른 링크</p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* 🔧 변경 가능: 자주 사용하는 링크 추가 */}
            <Link href="/services/keyword-analysis" className="text-sm text-blue-600 hover:underline">
              키워드 분석
            </Link>
            <Link href="/services/trends" className="text-sm text-blue-600 hover:underline">
              트렌드
            </Link>
            <Link href="/subscription" className="text-sm text-blue-600 hover:underline">
              요금제
            </Link>
            <Link href="/mypage" className="text-sm text-blue-600 hover:underline">
              마이페이지
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}