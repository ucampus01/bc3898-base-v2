-- supabase/migrations/002_usage.sql
-- 사용량 로그 테이블 생성

-- 🔧 변경 가능: 사용량 테이블 스키마
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_service ON usage_logs(service);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_service_date ON usage_logs(user_id, service, created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 🔧 변경 가능: RLS 정책
-- 사용자는 자신의 사용량만 조회 가능
CREATE POLICY "Users can view own usage"
  ON usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 사용량만 삽입 가능
CREATE POLICY "Users can insert own usage"
  ON usage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 사용량만 업데이트 가능
CREATE POLICY "Users can update own usage"
  ON usage_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_usage_logs_updated_at
  BEFORE UPDATE ON usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 🔧 변경 가능: 오래된 사용량 로그 자동 삭제 (90일 이상)
CREATE OR REPLACE FUNCTION delete_old_usage_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM usage_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 매일 자동 실행 (pg_cron 필요)
-- SELECT cron.schedule('delete-old-usage-logs', '0 2 * * *', 'SELECT delete_old_usage_logs()');