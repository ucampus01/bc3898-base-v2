-- supabase/migrations/004_keywords.sql
-- 키워드 저장 테이블 생성

-- 🔧 변경 가능: 키워드 테이블 스키마
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  competition TEXT,
  cpc DECIMAL(10, 2),
  platform TEXT CHECK (platform IN ('naver', 'google', 'youtube', 'coupang', 'daum')),
  metadata JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_keywords_user_id ON keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_keywords_project_id ON keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_platform ON keywords(platform);
CREATE INDEX IF NOT EXISTS idx_keywords_created_at ON keywords(created_at);

-- 전체 텍스트 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_keywords_keyword_gin ON keywords USING gin(to_tsvector('korean', keyword));

-- RLS (Row Level Security) 활성화
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- 🔧 변경 가능: RLS 정책
-- 사용자는 자신의 키워드만 조회 가능
CREATE POLICY "Users can view own keywords"
  ON keywords
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 키워드만 삽입 가능
CREATE POLICY "Users can insert own keywords"
  ON keywords
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 키워드만 업데이트 가능
CREATE POLICY "Users can update own keywords"
  ON keywords
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 사용자는 자신의 키워드만 삭제 가능
CREATE POLICY "Users can delete own keywords"
  ON keywords
  FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_keywords_updated_at
  BEFORE UPDATE ON keywords
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 🔧 변경 가능: 프로젝트 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_archived ON projects(is_archived);

-- RLS 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 🔧 변경 가능: 키워드 통계 뷰 생성
CREATE OR REPLACE VIEW keyword_stats AS
SELECT
  user_id,
  platform,
  COUNT(*) AS total_keywords,
  AVG(search_volume) AS avg_search_volume,
  AVG(cpc) AS avg_cpc,
  MIN(created_at) AS first_keyword_date,
  MAX(created_at) AS last_keyword_date
FROM keywords
GROUP BY user_id, platform;

-- 🔧 변경 가능: 프로젝트별 키워드 수 뷰
CREATE OR REPLACE VIEW project_keyword_counts AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  p.user_id,
  COUNT(k.id) AS keyword_count,
  MAX(k.created_at) AS last_keyword_added
FROM projects p
LEFT JOIN keywords k ON p.id = k.project_id
GROUP BY p.id, p.name, p.user_id;