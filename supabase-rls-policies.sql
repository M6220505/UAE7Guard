-- =====================================================
-- UAE7Guard RLS (Row Level Security) Policies Migration
-- =====================================================
-- Run this on existing databases to add complete RLS policies
--
-- IMPORTANT: Without INSERT/UPDATE/DELETE policies, users can only SELECT!
-- This is a common mistake that causes "permission denied" errors on iOS.

-- =====================================================
-- STEP 1: Enable RLS on all tables
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE slippage_calculations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: Drop existing policies (if any) to avoid conflicts
-- =====================================================

-- scam_reports
DROP POLICY IF EXISTS "Users can view their own reports" ON scam_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON scam_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON scam_reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON scam_reports;

-- alerts
DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can insert their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON alerts;

-- watchlist
DROP POLICY IF EXISTS "Users can view their own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can insert to their own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can update their own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can delete from their own watchlist" ON watchlist;

-- security_logs
DROP POLICY IF EXISTS "Users can view their own security logs" ON security_logs;
DROP POLICY IF EXISTS "Users can insert their own security logs" ON security_logs;

-- live_monitoring
DROP POLICY IF EXISTS "Users can view their own monitoring" ON live_monitoring;
DROP POLICY IF EXISTS "Users can insert their own monitoring" ON live_monitoring;
DROP POLICY IF EXISTS "Users can update their own monitoring" ON live_monitoring;
DROP POLICY IF EXISTS "Users can delete their own monitoring" ON live_monitoring;

-- monitoring_alerts
DROP POLICY IF EXISTS "Users can view their monitoring alerts" ON monitoring_alerts;
DROP POLICY IF EXISTS "Users can update their monitoring alerts" ON monitoring_alerts;

-- escrow_transactions
DROP POLICY IF EXISTS "Users can view their escrow transactions" ON escrow_transactions;
DROP POLICY IF EXISTS "Users can create escrow as buyer" ON escrow_transactions;
DROP POLICY IF EXISTS "Users can update their escrow transactions" ON escrow_transactions;

-- slippage_calculations
DROP POLICY IF EXISTS "Users can view their slippage calculations" ON slippage_calculations;
DROP POLICY IF EXISTS "Users can insert their slippage calculations" ON slippage_calculations;

-- users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- user_reputation
DROP POLICY IF EXISTS "Anyone can view reputation leaderboard" ON user_reputation;
DROP POLICY IF EXISTS "Users can view their own reputation" ON user_reputation;

-- =====================================================
-- STEP 3: SCAM_REPORTS POLICIES (Complete CRUD)
-- =====================================================

-- 1. SELECT: Users can view their own reports + all verified reports
CREATE POLICY "Users can view their own reports"
ON scam_reports
FOR SELECT
USING (
  auth.uid()::text = reporter_id
  OR status = 'verified'
);

-- 2. INSERT: Users can only create reports as themselves
-- NOTE: Uses WITH CHECK (not USING) - prevents inserting reports as another user
CREATE POLICY "Users can insert their own reports"
ON scam_reports
FOR INSERT
WITH CHECK (auth.uid()::text = reporter_id);

-- 3. UPDATE: Users can update their own pending reports only
-- NOTE: Both USING and WITH CHECK required for UPDATE
-- SECURITY: WITH CHECK must also verify status = 'pending' to prevent users
-- from changing status to bypass restrictions before admin verification
CREATE POLICY "Users can update their own reports"
ON scam_reports
FOR UPDATE
USING (auth.uid()::text = reporter_id AND status = 'pending')
WITH CHECK (auth.uid()::text = reporter_id AND status = 'pending');

-- 4. DELETE: Users can delete their own pending reports only
CREATE POLICY "Users can delete their own reports"
ON scam_reports
FOR DELETE
USING (auth.uid()::text = reporter_id AND status = 'pending');

-- =====================================================
-- STEP 4: ALERTS POLICIES
-- =====================================================

CREATE POLICY "Users can view their own alerts"
ON alerts FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own alerts"
ON alerts FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own alerts"
ON alerts FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own alerts"
ON alerts FOR DELETE
USING (auth.uid()::text = user_id);

-- =====================================================
-- STEP 5: WATCHLIST POLICIES
-- =====================================================

CREATE POLICY "Users can view their own watchlist"
ON watchlist FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert to their own watchlist"
ON watchlist FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own watchlist"
ON watchlist FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete from their own watchlist"
ON watchlist FOR DELETE
USING (auth.uid()::text = user_id);

-- =====================================================
-- STEP 6: SECURITY_LOGS POLICIES (No UPDATE/DELETE for audit integrity)
-- =====================================================

CREATE POLICY "Users can view their own security logs"
ON security_logs FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own security logs"
ON security_logs FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- =====================================================
-- STEP 7: LIVE_MONITORING POLICIES
-- =====================================================

CREATE POLICY "Users can view their own monitoring"
ON live_monitoring FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own monitoring"
ON live_monitoring FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own monitoring"
ON live_monitoring FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own monitoring"
ON live_monitoring FOR DELETE
USING (auth.uid()::text = user_id);

-- =====================================================
-- STEP 8: MONITORING_ALERTS POLICIES
-- =====================================================

CREATE POLICY "Users can view their monitoring alerts"
ON monitoring_alerts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM live_monitoring lm
    WHERE lm.id = monitoring_alerts.monitoring_id
    AND lm.user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update their monitoring alerts"
ON monitoring_alerts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM live_monitoring lm
    WHERE lm.id = monitoring_alerts.monitoring_id
    AND lm.user_id = auth.uid()::text
  )
);

-- =====================================================
-- STEP 9: ESCROW_TRANSACTIONS POLICIES
-- =====================================================
-- SECURITY CRITICAL: Escrow transactions require strict state-based rules
-- - Only buyer OR seller can access
-- - Updates only allowed in modifiable states (pending, active)
-- - NO DELETE allowed (audit trail + dispute resolution)

CREATE POLICY "Users can view their escrow transactions"
ON escrow_transactions FOR SELECT
USING (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id);

CREATE POLICY "Users can create escrow as buyer"
ON escrow_transactions FOR INSERT
WITH CHECK (auth.uid()::text = buyer_id);

-- UPDATE: Only allowed when status is in modifiable states
-- Prevents modification after completion, cancellation, or dispute
CREATE POLICY "Users can update their escrow transactions"
ON escrow_transactions FOR UPDATE
USING (
  (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id)
  AND status NOT IN ('completed', 'cancelled', 'disputed', 'released', 'refunded')
)
WITH CHECK (
  (auth.uid()::text = buyer_id OR auth.uid()::text = seller_id)
  AND status NOT IN ('completed', 'cancelled', 'disputed', 'released', 'refunded')
);

-- NO DELETE POLICY: Escrow transactions must never be deleted
-- They are required for audit trail and dispute resolution

-- =====================================================
-- STEP 10: SLIPPAGE_CALCULATIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view their slippage calculations"
ON slippage_calculations FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their slippage calculations"
ON slippage_calculations FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- =====================================================
-- STEP 11: USERS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- =====================================================
-- STEP 12: USER_REPUTATION POLICIES (Public leaderboard)
-- =====================================================

CREATE POLICY "Anyone can view reputation leaderboard"
ON user_reputation FOR SELECT
USING (true);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify all policies are created:

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
