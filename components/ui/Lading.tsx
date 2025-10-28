// components/ui/Loading.tsx
// 로딩 스피너 컴포넌트

export default function Loading({ 
  size = 'md',
  fullScreen = false 
}: { 
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean 
}) {
  // 🔧 변경 가능: 스피너 크기
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}