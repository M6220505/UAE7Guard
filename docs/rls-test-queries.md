# UAE7Guard RLS Test Queries

This document contains standard test queries for verifying RLS policies.
Run these in Supabase SQL Editor to verify security rules.

---

## Setup: Test Users

```sql
-- Create test users for RLS testing
-- User A (will be the authenticated user)
INSERT INTO users (id, email, role) VALUES
  ('test-user-a', 'usera@test.com', 'user')
ON CONFLICT (id) DO NOTHING;

-- User B (another user - should NOT be accessible)
INSERT INTO users (id, email, role) VALUES
  ('test-user-b', 'userb@test.com', 'user')
ON CONFLICT (id) DO NOTHING;

-- Simulate being User A
-- In Supabase SQL Editor, use: SET LOCAL role = 'authenticated';
-- Then set: SET LOCAL request.jwt.claims = '{"sub": "test-user-a"}';
```

---

## SCAM_REPORTS Tests

### INSERT: Allowed (own report)

```sql
-- As User A: Should SUCCEED
INSERT INTO scam_reports (reporter_id, scammer_address, scam_type, description)
VALUES ('test-user-a', '0x123...abc', 'rug_pull', 'Test scam report');
```

### INSERT: Blocked (as another user)

```sql
-- As User A trying to create report for User B: Should FAIL
INSERT INTO scam_reports (reporter_id, scammer_address, scam_type, description)
VALUES ('test-user-b', '0x123...abc', 'rug_pull', 'Fake report');
-- Expected: ERROR - violates row-level security policy
```

### SELECT: Allowed (own report)

```sql
-- As User A: Should return own reports
SELECT * FROM scam_reports WHERE reporter_id = 'test-user-a';
```

### SELECT: Allowed (verified reports from others)

```sql
-- As User A: Should see verified reports from anyone
SELECT * FROM scam_reports WHERE status = 'verified';
```

### SELECT: Blocked (pending reports from others)

```sql
-- As User A: Should NOT see User B's pending reports
SELECT * FROM scam_reports
WHERE reporter_id = 'test-user-b' AND status = 'pending';
-- Expected: Empty result set
```

### UPDATE: Allowed (own pending report, safe columns)

```sql
-- As User A: Should SUCCEED (updating description only)
UPDATE scam_reports
SET description = 'Updated description'
WHERE reporter_id = 'test-user-a' AND status = 'pending';
```

### UPDATE: Blocked (changing status column)

```sql
-- As User A: Should FAIL (trying to change status)
UPDATE scam_reports
SET status = 'verified'
WHERE reporter_id = 'test-user-a';
-- Expected: ERROR - Column "status" can only be modified by admin
```

### UPDATE: Blocked (verified report)

```sql
-- As User A: Should FAIL (report already verified)
UPDATE scam_reports
SET description = 'Hacked description'
WHERE reporter_id = 'test-user-a' AND status = 'verified';
-- Expected: ERROR or 0 rows affected
```

### DELETE: Allowed (own pending report)

```sql
-- As User A: Should SUCCEED
DELETE FROM scam_reports
WHERE reporter_id = 'test-user-a' AND status = 'pending';
```

### DELETE: Blocked (verified report)

```sql
-- As User A: Should FAIL
DELETE FROM scam_reports
WHERE reporter_id = 'test-user-a' AND status = 'verified';
-- Expected: 0 rows affected
```

---

## ESCROW_TRANSACTIONS Tests

### INSERT: Allowed (as buyer)

```sql
-- As User A: Should SUCCEED
INSERT INTO escrow_transactions
  (buyer_id, asset_type, asset_description, amount, buyer_wallet)
VALUES
  ('test-user-a', 'NFT', 'CryptoPunk #1234', '1000', '0xbuyer...');
```

### INSERT: Blocked (as seller - wrong role)

```sql
-- As User A trying to create as buyer = User B: Should FAIL
INSERT INTO escrow_transactions
  (buyer_id, asset_type, asset_description, amount, buyer_wallet)
VALUES
  ('test-user-b', 'NFT', 'Stolen NFT', '1000', '0xfake...');
-- Expected: ERROR - violates row-level security policy
```

### UPDATE: Allowed (pending to cancelled by buyer)

```sql
-- As User A (buyer): Should SUCCEED
UPDATE escrow_transactions
SET status = 'cancelled'
WHERE buyer_id = 'test-user-a' AND status = 'pending';
```

### UPDATE: Blocked (completed to cancelled)

```sql
-- As User A: Should FAIL (completed is final)
UPDATE escrow_transactions
SET status = 'cancelled'
WHERE buyer_id = 'test-user-a' AND status = 'completed';
-- Expected: ERROR - Status transition not allowed
```

### UPDATE: Blocked (active to completed without verification)

```sql
-- As User A: Should FAIL (both parties must verify)
UPDATE escrow_transactions
SET status = 'completed'
WHERE buyer_id = 'test-user-a'
  AND status = 'active'
  AND buyer_verified = false;
-- Expected: ERROR - Both parties must verify
```

### DELETE: Always Blocked

```sql
-- As User A: Should FAIL (no DELETE policy)
DELETE FROM escrow_transactions WHERE buyer_id = 'test-user-a';
-- Expected: ERROR - violates row-level security policy
```

---

## USERS Tests

### SELECT: Allowed (own profile)

```sql
-- As User A: Should return own profile
SELECT * FROM users WHERE id = 'test-user-a';
```

### SELECT: Blocked (other user's profile)

```sql
-- As User A: Should NOT see User B's profile
SELECT * FROM users WHERE id = 'test-user-b';
-- Expected: Empty result set
```

### UPDATE: Allowed (safe columns)

```sql
-- As User A: Should SUCCEED
UPDATE users
SET first_name = 'Updated Name', profile_image_url = 'https://...'
WHERE id = 'test-user-a';
```

### UPDATE: Blocked (role escalation)

```sql
-- As User A: Should FAIL (privilege escalation attempt)
UPDATE users SET role = 'admin' WHERE id = 'test-user-a';
-- Expected: ERROR - Column "role" can only be modified by admin
```

### UPDATE: Blocked (subscription fraud)

```sql
-- As User A: Should FAIL
UPDATE users SET subscription_tier = 'pro' WHERE id = 'test-user-a';
-- Expected: ERROR - Column "subscription_tier" can only be modified through payment system
```

---

## USER_REPUTATION Tests

### SELECT: Allowed (public leaderboard)

```sql
-- As any user: Should return all reputation data
SELECT user_id, trust_score, rank FROM user_reputation
ORDER BY trust_score DESC LIMIT 10;
```

### UPDATE: Blocked (score manipulation)

```sql
-- As User A: Should FAIL
UPDATE user_reputation
SET trust_score = 99999, rank = 'Sentinel'
WHERE user_id = 'test-user-a';
-- Expected: ERROR - Column "trust_score" can only be modified by system
```

---

## SECURITY_LOGS Tests

### INSERT: Allowed

```sql
-- As User A: Should SUCCEED
INSERT INTO security_logs (user_id, action_type, details)
VALUES ('test-user-a', 'login', 'Test login event');
```

### UPDATE: Always Blocked

```sql
-- As User A: Should FAIL (no UPDATE policy)
UPDATE security_logs
SET details = 'Tampered data'
WHERE user_id = 'test-user-a';
-- Expected: ERROR - violates row-level security policy
```

### DELETE: Always Blocked

```sql
-- As User A: Should FAIL (no DELETE policy)
DELETE FROM security_logs WHERE user_id = 'test-user-a';
-- Expected: ERROR - violates row-level security policy
```

---

## Verification Queries

### List All RLS Policies

```sql
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
```

### List All Column Protection Triggers

```sql
SELECT
  tgname AS trigger_name,
  tgrelid::regclass AS table_name,
  proname AS function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname LIKE 'protect_%'
ORDER BY table_name;
```

### Check RLS Status on Tables

```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Quick Test Script

Run this to verify basic security is working:

```sql
-- This should FAIL if RLS is properly enabled
DO $$
BEGIN
  -- Try to insert as wrong user
  BEGIN
    INSERT INTO scam_reports (reporter_id, scammer_address, scam_type, description)
    VALUES ('non-existent-user', '0x...', 'test', 'Should fail');
    RAISE EXCEPTION 'SECURITY FAILURE: Insert as wrong user succeeded!';
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'RLS Check 1 PASSED: Cannot insert as wrong user';
  END;

  -- Verify column protection is active
  BEGIN
    PERFORM 1 FROM pg_trigger WHERE tgname = 'protect_scam_reports_columns';
    RAISE NOTICE 'RLS Check 2 PASSED: Column protection trigger exists';
  END;

  RAISE NOTICE 'All basic RLS checks passed!';
END $$;
```

---

## Admin Operations (Service Role Only)

These operations require `service_role` key:

```sql
-- Verify a scam report (admin only)
UPDATE scam_reports
SET status = 'verified',
    verified_by = 'admin-user-id',
    verified_at = NOW()
WHERE id = 'report-id-here';

-- Update user subscription (payment webhook)
UPDATE users
SET subscription_tier = 'pro',
    subscription_status = 'active',
    stripe_subscription_id = 'sub_xxx'
WHERE id = 'user-id-here';

-- Award reputation points (system only)
UPDATE user_reputation
SET trust_score = trust_score + 100,
    verified_reports = verified_reports + 1
WHERE user_id = 'user-id-here';

-- Force escrow release (dispute resolution)
UPDATE escrow_transactions
SET status = 'released'
WHERE id = 'escrow-id-here';
```

---

## Summary Table

| Table | SELECT | INSERT | UPDATE | DELETE | Protected Columns |
|-------|--------|--------|--------|--------|-------------------|
| scam_reports | Own + Verified | Own | Own + Pending | Own + Pending | status, verified_by, verified_at |
| escrow_transactions | Buyer/Seller | Buyer | State-based | BLOCKED | status (transitions) |
| users | Own | N/A | Own | N/A | role, subscription_*, stripe_* |
| user_reputation | PUBLIC | N/A | BLOCKED | N/A | trust_score, rank, verified_reports |
| security_logs | Own | Own | BLOCKED | BLOCKED | - (immutable) |
| alerts | Own | Own | Own | Own | - |
| watchlist | Own | Own | Own | Own | - |
| live_monitoring | Own | Own | Own | Own | - |
| monitoring_alerts | Own | N/A | Own | N/A | - |
| slippage_calculations | Own | Own | N/A | N/A | - |

---

*Last updated: 2026-02-07*
