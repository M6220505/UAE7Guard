# UAE7Guard - Threat Model Document

> Security Assessment & Attack Mitigation Analysis
> Version: 1.0
> Date: February 2026
> Classification: Internal Security Documentation

---

## Executive Summary

UAE7Guard is a blockchain security platform protecting UAE users from cryptocurrency scams. This document outlines potential attack vectors, their likelihood, impact, and the mitigations implemented.

**Security Posture**: Production-Ready with Defense-in-Depth

---

## 1. Authentication Threats

### 1.1 What if a malicious client tried to bypass authentication?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Client sends forged JWT or manipulated Authorization header |
| **Likelihood** | High (common attack) |
| **Impact** | Critical - unauthorized access to user data |

**Mitigations Implemented:**

1. **Server-Side JWT Verification**
   - All JWTs verified using Supabase Admin SDK
   - Signature validation against Supabase JWKS
   - Token expiry checked on every request
   ```typescript
   // server/middleware/supabaseAuth.ts
   const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
   ```

2. **No Client-Side Trust**
   - Backend NEVER trusts client-provided user IDs
   - User ID extracted from verified JWT only
   - RLS policies enforce user isolation at database level

3. **Deprecated Legacy Endpoints**
   - `/api/auth/login`, `/api/auth/signup` return 410 Gone
   - Forces clients to use Supabase Auth (server-controlled)

**Residual Risk**: Low - Multiple layers prevent bypass

---

### 1.2 What if JWT token leaked?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Token stolen via XSS, network interception, or device compromise |
| **Likelihood** | Medium |
| **Impact** | High - attacker gains user session |

**Mitigations Implemented:**

1. **Short Token Expiry**
   - Supabase access tokens expire in 1 hour (default)
   - Refresh tokens required for extended sessions

2. **HTTPS Enforcement**
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - All API traffic encrypted in transit

3. **XSS Prevention**
   - Input sanitization removes `<script>` tags and event handlers
   - Content-Security-Policy restricts script execution
   - `X-XSS-Protection: 1; mode=block`

4. **Token Binding**
   - Tokens bound to specific user ID in Supabase
   - Cannot be transferred between accounts

5. **Rate Limiting**
   - Auth endpoints: 5 requests per 15 minutes
   - Prevents automated token testing

**Recovery Steps:**
1. User can sign out from Supabase dashboard (invalidates all tokens)
2. Password reset invalidates existing sessions
3. Admin can revoke user sessions via service_role

**Residual Risk**: Medium - Token theft still possible via device compromise

---

### 1.3 What if service_role key was used incorrectly?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Service role key exposed to client or misused in backend |
| **Likelihood** | Low (requires developer error) |
| **Impact** | Critical - bypasses ALL RLS policies |

**Mitigations Implemented:**

1. **Environment Separation**
   ```bash
   # Client-safe keys (VITE_ prefix for frontend)
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...

   # Server-only key (NO prefix, never in client bundle)
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

2. **Bundler Protection**
   - Vite only exposes `VITE_` prefixed variables to client
   - Service role key unreachable from frontend code

3. **Limited Service Role Usage**
   - Only used for: admin operations, JWT verification
   - Never used for regular user queries
   - Code review required for any service_role usage

4. **Audit Logging**
   - All admin actions logged to immutable `security_logs`
   - Cannot be deleted (RLS: DELETE blocked)

**Code Pattern (Correct Usage):**
```typescript
// CORRECT: Service role for admin verification only
const supabaseAdmin = createClient(url, SERVICE_ROLE_KEY);
const { data: { user } } = await supabaseAdmin.auth.getUser(token);

// CORRECT: Regular queries use user's JWT context
const supabase = createClient(url, ANON_KEY);
supabase.auth.setSession(userToken);
const { data } = await supabase.from('scam_reports').select();
```

**Residual Risk**: Low - Requires intentional misconfiguration

---

## 2. Data Access Threats

### 2.1 What if user tried to access another user's data?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Manipulate API parameters to access other user's records |
| **Likelihood** | High (common attack) |
| **Impact** | High - privacy breach |

**Mitigations Implemented:**

1. **Row Level Security (RLS)**
   ```sql
   -- Example: Users can only see own watchlist
   CREATE POLICY "Users can view own watchlist"
   ON watchlist FOR SELECT
   USING (auth.uid() = user_id);
   ```

2. **Tables with User Isolation:**
   | Table | Policy |
   |-------|--------|
   | users | Own profile only |
   | watchlist | Own entries only |
   | alerts | Own alerts only |
   | security_logs | Own logs only |
   | escrow_transactions | Buyer OR seller only |
   | scam_reports | Own + verified public |

3. **No Direct User ID Parameters**
   - API endpoints extract user_id from JWT
   - Never accept user_id from request body/params

**Residual Risk**: Very Low - RLS enforced at database level

---

### 2.2 What if user tried to escalate privileges?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Modify own user record to gain admin role |
| **Likelihood** | Medium |
| **Impact** | Critical - full system access |

**Mitigations Implemented:**

1. **Column-Level Protection**
   ```sql
   -- Trigger prevents users from modifying role
   CREATE OR REPLACE FUNCTION protect_user_role_column()
   RETURNS TRIGGER AS $$
   BEGIN
     IF OLD.role IS DISTINCT FROM NEW.role THEN
       RAISE EXCEPTION 'Cannot modify role column';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Protected Columns:**
   - `users.role` - Cannot be self-modified
   - `users.subscription_tier` - Requires Stripe webhook
   - `users.subscription_status` - Requires Stripe webhook
   - `scam_reports.status` - Admin only
   - `user_reputation.trust_score` - System only

3. **Admin Endpoint Protection**
   ```typescript
   // Requires valid admin role
   app.use('/api/admin/*', requireAdmin);
   ```

**Residual Risk**: Very Low - Multiple protection layers

---

### 2.3 What if escrow transaction was manipulated?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Buyer/seller tries to cheat by changing escrow state |
| **Likelihood** | High (financial motivation) |
| **Impact** | Critical - financial loss |

**Mitigations Implemented:**

1. **State-Based RLS**
   ```sql
   -- Only allow updates in modifiable states
   CREATE POLICY "escrow_update_state_based"
   ON escrow_transactions FOR UPDATE
   USING (
     (buyer_id = auth.uid() OR seller_id = auth.uid())
     AND status IN ('pending', 'active')
   );
   ```

2. **Valid State Transitions:**
   ```
   pending → active (funds deposited)
   pending → cancelled (buyer cancels)
   active → completed (both verify)
   active → disputed (either party disputes)
   ```

3. **Delete Prevention**
   - No DELETE policy exists
   - All escrow records are permanent audit trail

4. **Column Protection**
   - Status changes validated by triggers
   - Invalid transitions rejected at database level

**Residual Risk**: Low - State machine enforced at database level

---

## 3. API Security Threats

### 3.1 What if API was DDoS attacked?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Flood API with requests to cause denial of service |
| **Likelihood** | Medium |
| **Impact** | High - service unavailable |

**Mitigations Implemented:**

1. **Multi-Tier Rate Limiting**
   | Endpoint Type | Limit | Window |
   |--------------|-------|--------|
   | General API | 100 req | 15 min |
   | Auth endpoints | 5 req | 15 min |
   | Password reset | 3 req | 1 hour |
   | AI queries | 20 req | 1 hour |
   | Blockchain | 10 req | 1 min |
   | Payments | 10 req | 1 hour |

2. **Slow-Down Mechanism**
   - Progressive delays on repeated violations
   - IP-based tracking

3. **Health Check Exemption**
   - `/health/*` endpoints bypass rate limiting
   - Ensures monitoring always works

**Residual Risk**: Medium - Recommend CDN/WAF for production

---

### 3.2 What if XSS payload was injected?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Inject malicious script via user input |
| **Likelihood** | Medium |
| **Impact** | High - token theft, session hijack |

**Mitigations Implemented:**

1. **Input Sanitization**
   ```typescript
   // Removes <script>, onclick=, javascript: etc.
   sanitizeInput(req.query);
   sanitizeInput(req.body);
   ```

2. **Security Headers**
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self'
   X-XSS-Protection: 1; mode=block
   X-Content-Type-Options: nosniff
   ```

3. **React Automatic Escaping**
   - React escapes all rendered content by default
   - `dangerouslySetInnerHTML` not used

**Residual Risk**: Low - Multiple protection layers

---

### 3.3 What if SQL injection was attempted?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Inject SQL via API parameters |
| **Likelihood** | Medium |
| **Impact** | Critical - database compromise |

**Mitigations Implemented:**

1. **Supabase Client (Parameterized)**
   ```typescript
   // All queries use parameterized statements
   supabase.from('users').select().eq('id', userId);
   // NOT: raw SQL concatenation
   ```

2. **No Raw SQL Queries**
   - Application never constructs raw SQL
   - All queries through Supabase client

3. **RLS as Defense Layer**
   - Even if injection succeeded, RLS limits data access
   - user_id required in all queries

**Residual Risk**: Very Low - No raw SQL exposure

---

## 4. Infrastructure Threats

### 4.1 What if database credentials leaked?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Credentials exposed in logs, repo, or config |
| **Likelihood** | Low |
| **Impact** | Critical - full database access |

**Mitigations Implemented:**

1. **Environment Variables**
   - All secrets in environment variables
   - Never committed to repository
   - `.env` in `.gitignore`

2. **Credential Rotation**
   - Supabase allows key rotation
   - Service role key can be regenerated

3. **Connection Encryption**
   - PostgreSQL connections use SSL
   - `SUPABASE_URL` uses HTTPS

**Residual Risk**: Low - Standard secret management

---

### 4.2 What if encryption key was compromised?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | ENCRYPTION_KEY exposed or stolen |
| **Likelihood** | Low |
| **Impact** | High - encrypted audit logs readable |

**Mitigations Implemented:**

1. **AES-256-GCM**
   - Industry-standard authenticated encryption
   - Provides confidentiality and integrity

2. **Key Derivation**
   - Key hashed with SHA-256 before use
   - Raw key never used directly

3. **Per-Record IV**
   - Each encrypted record has unique IV
   - Prevents pattern analysis

**Recovery Steps:**
1. Rotate ENCRYPTION_KEY
2. Re-encrypt historical audit logs (optional)
3. Old logs remain encrypted but accessible with old key

**Residual Risk**: Medium - Key management is critical

---

## 5. Mobile-Specific Threats

### 5.1 What if mobile app was reverse-engineered?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Decompile app to extract secrets or understand API |
| **Likelihood** | Medium |
| **Impact** | Medium - API structure revealed |

**Mitigations Implemented:**

1. **No Sensitive Keys in App**
   - Only `anon_key` embedded (designed to be public)
   - Service role key never in mobile bundle

2. **API Rate Limiting**
   - Prevents automated abuse even if API known
   - Auth endpoints strictly limited

3. **Server-Side Validation**
   - All security logic on server
   - Client-side checks are UX only

**Residual Risk**: Medium - API obfuscation not implemented

---

### 5.2 What if device was compromised?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Malware on device steals tokens |
| **Likelihood** | Low-Medium |
| **Impact** | High - account compromise |

**Mitigations Implemented:**

1. **Secure Storage**
   - iOS Keychain for sensitive data
   - Android Keystore for encryption

2. **Token Expiry**
   - Short-lived access tokens
   - Refresh tokens can be revoked

3. **Session Management**
   - User can view active sessions
   - Remote logout capability

**Residual Risk**: Medium - Device security is user responsibility

---

## 6. Business Logic Threats

### 6.1 What if fake scam reports were submitted?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | Malicious user submits false reports to harm legitimate addresses |
| **Likelihood** | Medium |
| **Impact** | Medium - reputation damage to legitimate users |

**Mitigations Implemented:**

1. **Verification Workflow**
   ```
   submitted → pending → (admin review) → verified/rejected
   ```

2. **Reporter Tracking**
   - All reports linked to reporter_id
   - False reporters can be identified and banned

3. **Reputation System**
   - User trust_score affected by report accuracy
   - Low-trust users have less influence

4. **Public Visibility Rules**
   - Only verified reports shown publicly
   - Pending reports visible only to reporter

**Residual Risk**: Medium - Human review required

---

### 6.2 What if reputation was manipulated?

| Aspect | Details |
|--------|---------|
| **Attack Vector** | User tries to inflate own trust_score |
| **Likelihood** | Medium |
| **Impact** | Medium - unfair leaderboard ranking |

**Mitigations Implemented:**

1. **System-Only Writes**
   ```sql
   -- No user UPDATE policy on user_reputation
   -- Only service_role can modify
   ```

2. **Column Protection Trigger**
   - trust_score, rank, verified_reports protected
   - User updates rejected at database level

3. **Audit Trail**
   - All reputation changes logged
   - Anomalies detectable

**Residual Risk**: Very Low - Database-enforced protection

---

## 7. Threat Summary Matrix

| Threat | Likelihood | Impact | Mitigations | Residual Risk |
|--------|------------|--------|-------------|---------------|
| Auth bypass | High | Critical | JWT verification, RLS | Low |
| JWT leak | Medium | High | HTTPS, short expiry, XSS prevention | Medium |
| Service role misuse | Low | Critical | Env separation, code review | Low |
| Cross-user data access | High | High | RLS policies | Very Low |
| Privilege escalation | Medium | Critical | Column protection triggers | Very Low |
| Escrow manipulation | High | Critical | State-based RLS | Low |
| DDoS | Medium | High | Rate limiting | Medium |
| XSS | Medium | High | Sanitization, CSP | Low |
| SQL injection | Medium | Critical | Parameterized queries | Very Low |
| DB credential leak | Low | Critical | Env vars, rotation | Low |
| Encryption key compromise | Low | High | AES-256-GCM, key derivation | Medium |
| Mobile reverse engineering | Medium | Medium | No secrets in app | Medium |
| Device compromise | Low-Medium | High | Secure storage, token expiry | Medium |
| Fake scam reports | Medium | Medium | Verification workflow | Medium |
| Reputation manipulation | Medium | Medium | System-only writes | Very Low |

---

## 8. Recommendations for Production

### High Priority
1. **Add WAF/CDN** - Cloudflare or AWS WAF for DDoS protection
2. **Redis Rate Limiting** - Replace in-memory with Redis for multi-instance
3. **Remove Demo Admin Endpoint** - `/api/admin/authenticate` legacy endpoint

### Medium Priority
4. **Certificate Pinning** - Mobile apps should pin SSL certificates
5. **App Obfuscation** - Code obfuscation for iOS/Android builds
6. **Anomaly Detection** - Monitor for unusual API patterns

### Low Priority
7. **Bug Bounty Program** - Invite security researchers
8. **Penetration Testing** - Annual third-party security audit
9. **SOC 2 Compliance** - For enterprise customers

---

## 9. Incident Response

### Token Compromise
1. User: Sign out from all devices via Supabase dashboard
2. Admin: Revoke user sessions via service_role
3. User: Reset password to invalidate refresh tokens

### Service Role Key Compromise
1. Immediately rotate key in Supabase dashboard
2. Update environment variables in all deployments
3. Audit security_logs for unauthorized admin actions
4. Review all recent admin operations

### Database Compromise
1. Revoke all connections immediately
2. Rotate all credentials (Supabase, PostgreSQL)
3. Restore from backup if data modified
4. Notify affected users per GDPR/local regulations

---

## 10. Compliance Notes

### GDPR Compliance
- User data can be exported (user profile access)
- User data can be deleted (CASCADE delete on user_id)
- Encrypted audit logs for right to explanation

### UAE Data Protection
- Data stored in compliant region (Supabase region selection)
- Arabic language support for transparency
- AED currency for local transactions

---

**Document Maintained By**: Security Team
**Review Frequency**: Quarterly
**Last Review**: February 2026
