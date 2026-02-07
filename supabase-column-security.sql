-- =====================================================
-- UAE7Guard Column-Level Security
-- =====================================================
-- This file implements column-level protection for sensitive fields
-- that should ONLY be modified by service_role (backend/admin)
--
-- IMPORTANT: Run this AFTER supabase-rls-policies.sql
-- =====================================================

-- =====================================================
-- SENSITIVE COLUMNS IDENTIFIED:
-- =====================================================
-- 1. scam_reports: status, verified_by, verified_at
-- 2. escrow_transactions: status (for final states)
-- 3. users: role, subscription_tier, subscription_status
-- 4. user_reputation: trust_score, rank, verified_reports
-- =====================================================

-- =====================================================
-- APPROACH: Use UPDATE policies with column restrictions
-- PostgreSQL doesn't have native column-level RLS, so we use:
-- 1. Trigger-based protection (recommended)
-- 2. Updated RLS policies with NEW/OLD checks
-- =====================================================

-- =====================================================
-- STEP 1: Create helper function to check if caller is service_role
-- =====================================================

CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  -- service_role bypasses RLS, so if this function runs,
  -- the caller is NOT service_role
  -- This is used in triggers that run BEFORE RLS
  RETURN current_setting('role', true) = 'service_role'
         OR current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 2: SCAM_REPORTS - Protect status, verified_by, verified_at
-- =====================================================

CREATE OR REPLACE FUNCTION protect_scam_reports_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If not service_role, prevent changes to sensitive columns
  IF NOT is_service_role() THEN
    -- Protect status column - users cannot change status
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      RAISE EXCEPTION 'SECURITY: Column "status" can only be modified by admin/service_role';
    END IF;

    -- Protect verified_by column
    IF OLD.verified_by IS DISTINCT FROM NEW.verified_by THEN
      RAISE EXCEPTION 'SECURITY: Column "verified_by" can only be modified by admin/service_role';
    END IF;

    -- Protect verified_at column
    IF OLD.verified_at IS DISTINCT FROM NEW.verified_at THEN
      RAISE EXCEPTION 'SECURITY: Column "verified_at" can only be modified by admin/service_role';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS protect_scam_reports_columns ON scam_reports;

-- Create trigger
CREATE TRIGGER protect_scam_reports_columns
  BEFORE UPDATE ON scam_reports
  FOR EACH ROW
  EXECUTE FUNCTION protect_scam_reports_sensitive_columns();

-- =====================================================
-- STEP 3: ESCROW_TRANSACTIONS - Protect status transitions
-- =====================================================

CREATE OR REPLACE FUNCTION protect_escrow_status_transitions()
RETURNS TRIGGER AS $$
DECLARE
  allowed_user_transitions TEXT[] := ARRAY[
    'pending->active',      -- Seller accepts
    'active->completed',    -- Normal completion (requires both verified)
    'pending->cancelled',   -- Buyer cancels before seller accepts
    'active->disputed'      -- Either party disputes
  ];
  current_transition TEXT;
BEGIN
  -- If status hasn't changed, allow the update
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  current_transition := OLD.status || '->' || NEW.status;

  -- Service role can do any transition
  IF is_service_role() THEN
    RETURN NEW;
  END IF;

  -- Users can only do allowed transitions
  IF NOT (current_transition = ANY(allowed_user_transitions)) THEN
    RAISE EXCEPTION 'SECURITY: Status transition "%" not allowed for users. Contact admin.', current_transition;
  END IF;

  -- Additional validation for specific transitions
  IF current_transition = 'active->completed' THEN
    -- Both parties must be verified for completion
    IF NOT (NEW.buyer_verified AND NEW.seller_verified) THEN
      RAISE EXCEPTION 'SECURITY: Both parties must verify before completing escrow';
    END IF;
  END IF;

  -- Only buyer can cancel pending escrow
  IF current_transition = 'pending->cancelled' THEN
    IF auth.uid()::text != OLD.buyer_id THEN
      RAISE EXCEPTION 'SECURITY: Only buyer can cancel pending escrow';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS protect_escrow_status ON escrow_transactions;

-- Create trigger
CREATE TRIGGER protect_escrow_status
  BEFORE UPDATE ON escrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION protect_escrow_status_transitions();

-- =====================================================
-- STEP 4: USERS - Protect role, subscription columns
-- =====================================================

CREATE OR REPLACE FUNCTION protect_users_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_service_role() THEN
    -- Protect role column - CRITICAL: prevents privilege escalation
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      RAISE EXCEPTION 'SECURITY: Column "role" can only be modified by admin/service_role';
    END IF;

    -- Protect subscription_tier - payment-related
    IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN
      RAISE EXCEPTION 'SECURITY: Column "subscription_tier" can only be modified through payment system';
    END IF;

    -- Protect subscription_status - payment-related
    IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status THEN
      RAISE EXCEPTION 'SECURITY: Column "subscription_status" can only be modified through payment system';
    END IF;

    -- Protect Stripe IDs - payment-related
    IF OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id THEN
      RAISE EXCEPTION 'SECURITY: Column "stripe_customer_id" can only be modified by payment system';
    END IF;

    IF OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id THEN
      RAISE EXCEPTION 'SECURITY: Column "stripe_subscription_id" can only be modified by payment system';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS protect_users_columns ON users;

-- Create trigger
CREATE TRIGGER protect_users_columns
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION protect_users_sensitive_columns();

-- =====================================================
-- STEP 5: USER_REPUTATION - Protect gaming-sensitive columns
-- =====================================================

CREATE OR REPLACE FUNCTION protect_reputation_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_service_role() THEN
    -- Users cannot modify their own reputation scores
    IF OLD.trust_score IS DISTINCT FROM NEW.trust_score THEN
      RAISE EXCEPTION 'SECURITY: Column "trust_score" can only be modified by system';
    END IF;

    IF OLD.rank IS DISTINCT FROM NEW.rank THEN
      RAISE EXCEPTION 'SECURITY: Column "rank" can only be modified by system';
    END IF;

    IF OLD.verified_reports IS DISTINCT FROM NEW.verified_reports THEN
      RAISE EXCEPTION 'SECURITY: Column "verified_reports" can only be modified by system';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS protect_reputation_columns ON user_reputation;

-- Create trigger
CREATE TRIGGER protect_reputation_columns
  BEFORE UPDATE ON user_reputation
  FOR EACH ROW
  EXECUTE FUNCTION protect_reputation_columns();

-- =====================================================
-- VERIFICATION: List all column protection triggers
-- =====================================================

SELECT
  tgname AS trigger_name,
  tgrelid::regclass AS table_name,
  tgtype,
  proname AS function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname LIKE 'protect_%'
ORDER BY table_name;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Column-level security triggers installed successfully!' AS status;
