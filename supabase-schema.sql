-- UAE7Guard Database Schema for Supabase
-- This schema creates all necessary tables for the UAE7Guard application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table for session storage
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT,
  password TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Reputation table
CREATE TABLE IF NOT EXISTS user_reputation (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL UNIQUE REFERENCES users(id),
  trust_score INTEGER NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT 'Novice',
  verified_reports INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Scam Reports table
CREATE TABLE IF NOT EXISTS scam_reports (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  scammer_address TEXT NOT NULL,
  reporter_id VARCHAR NOT NULL REFERENCES users(id),
  scam_type TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_url TEXT,
  amount_lost TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  severity TEXT NOT NULL DEFAULT 'medium',
  verified_by VARCHAR REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scammer_address_idx ON scam_reports (scammer_address);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  address TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Security Logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL,
  target_address TEXT,
  details TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Live Monitoring table
CREATE TABLE IF NOT EXISTS live_monitoring (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  label TEXT,
  network TEXT NOT NULL DEFAULT 'ethereum',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_checked TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS live_monitoring_wallet_idx ON live_monitoring (wallet_address);

-- Monitoring Alerts table
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  monitoring_id VARCHAR NOT NULL REFERENCES live_monitoring(id),
  alert_type TEXT NOT NULL,
  amount TEXT,
  to_address TEXT,
  from_address TEXT,
  tx_hash TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Escrow Transactions table
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  buyer_id VARCHAR NOT NULL REFERENCES users(id),
  seller_id VARCHAR,
  asset_type TEXT NOT NULL,
  asset_description TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AED',
  buyer_wallet TEXT NOT NULL,
  seller_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  buyer_verified BOOLEAN NOT NULL DEFAULT FALSE,
  seller_verified BOOLEAN NOT NULL DEFAULT FALSE,
  asset_transferred BOOLEAN NOT NULL DEFAULT FALSE,
  release_conditions TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Slippage Calculations table
CREATE TABLE IF NOT EXISTS slippage_calculations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  token_symbol TEXT NOT NULL,
  token_address TEXT,
  amount TEXT NOT NULL,
  current_price TEXT,
  estimated_slippage TEXT,
  liquidity_depth TEXT,
  recommendation TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations table for AI chat
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for AI chat
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Encrypted Audit Logs table
CREATE TABLE IF NOT EXISTS encrypted_audit_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transaction_hash TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  transaction_value_aed TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  encryption_iv TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  timestamp_utc TIMESTAMP NOT NULL DEFAULT NOW(),
  block_number TEXT,
  network TEXT NOT NULL DEFAULT 'ethereum',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_wallet_idx ON encrypted_audit_logs (wallet_address);
CREATE INDEX IF NOT EXISTS audit_logs_timestamp_idx ON encrypted_audit_logs (timestamp_utc);

-- AI Predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  wallet_address TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  ai_analysis TEXT NOT NULL,
  factors TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_predictions_wallet_idx ON ai_predictions (wallet_address);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger to escrow_transactions table
CREATE TRIGGER update_escrow_updated_at BEFORE UPDATE ON escrow_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo admin user (password: admin123456)
-- Password hash for "admin123456" using bcrypt
INSERT INTO users (id, email, password, first_name, last_name, role, subscription_tier, subscription_status)
VALUES (
  'admin-demo-user',
  'admin@uae7guard.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5P.MnL2uxGa9K',
  'Admin',
  'User',
  'admin',
  'pro',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert initial user reputation for admin
INSERT INTO user_reputation (id, user_id, trust_score, rank, verified_reports)
VALUES (
  gen_random_uuid()::text,
  'admin-demo-user',
  1000,
  'Sentinel',
  100
) ON CONFLICT (user_id) DO NOTHING;

-- Success message
SELECT 'UAE7Guard database schema created successfully!' AS status;
