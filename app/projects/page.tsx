// app/projects/page.tsx
// 프로젝트 관리 페이지

import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // 프로젝트 목록 조회
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      keywords:keywords(count)
    `)
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              프로젝트 관리
            </h1>
            <p className="text-gray-600">
              키워드를 프로젝트별로 그룹화하여 관리하세요
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            + 새 프로젝트
          </button>
        </div>

        {/* 프로젝트 그리드 */}
        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 🔧 변경 가능: 프로젝트 카드 레이아웃 */}
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.name}
                    </h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋮
                  </button>
                </div>

                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📊</span>
                    <span>{project.keywords?.[0]?.count || 0}개 키워드</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(project.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              아직 프로젝트가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              첫 프로젝트를 만들어 키워드를 관리해보세요
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              + 첫 프로젝트 만들기
            </button>
          </div>
        )}

        {/* 보관된 프로젝트 섹션 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            보관된 프로젝트
          </h2>
          <Link
            href="/projects/archived"
            className="text-blue-600 hover:underline"
          >
            보관된 프로젝트 보기 →
          </Link>
        </div>
      </div>
    </div>
  )
}