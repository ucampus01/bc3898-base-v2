-- supabase/migrations/003_subscriptions.sql
-- 구독 정보 테이블 생성

-- 🔧 변경 가능: 구독 테이블 스키마
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'standard', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- RLS (Row Level Security) 활성화
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 🔧 변경 가능: RLS 정책
-- 사용자는 자신의 구독 정보만 조회 가능
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- 서비스 역할은 모든 구독 정보 조회/수정 가능 (Webhook용)
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 🔧 변경 가능: 구독 만료 체크 함수
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
  -- 만료된 구독을 canceled 상태로 변경
  UPDATE subscriptions
  SET status = 'canceled'
  WHERE status = 'active'
    AND current_period_end < NOW()
    AND NOT cancel_at_period_end;

  -- 해당 사용자를 무료 플랜으로 다운그레이드
  UPDATE users
  SET membership_tier = 'free'
  WHERE id IN (
    SELECT user_id
    FROM subscriptions
    WHERE status = 'canceled'
      AND current_period_end < NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- 매일 자동 실행 (pg_cron 필요)
-- SELECT cron.schedule('check-expired-subscriptions', '0 1 * * *', 'SELECT check_expired_subscriptions()');

-- 🔧 변경 가능: 체크아웃 세션 임시 저장 테이블 (결제 진행 중 추적용)
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);

-- RLS 활성화
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkout sessions"
  ON checkout_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage checkout sessions"
  ON checkout_sessions
  FOR ALL
  USING (auth.role() = 'service_role');