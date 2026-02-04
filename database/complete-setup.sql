-- Complete Database Setup for Phantoms Giveaway System
-- Run this script in your Neon database to set up everything from scratch

-- Drop existing tables if you want to start fresh (CAREFUL: This deletes all data!)
-- Uncomment the lines below ONLY if you want to completely reset:
-- DROP TABLE IF EXISTS giveaway_entries CASCADE;
-- DROP TABLE IF EXISTS giveaway_tasks CASCADE;
-- DROP TABLE IF EXISTS giveaways CASCADE;
-- DROP TABLE IF EXISTS partnerships CASCADE;
-- DROP TABLE IF EXISTS visitor_stats CASCADE;

-- Create Giveaways Table
CREATE TABLE IF NOT EXISTS giveaways (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  winner_count INT DEFAULT 1,
  prizes JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create Giveaway Entries Table
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id SERIAL PRIMARY KEY,
  giveaway_id INT REFERENCES giveaways(id),
  twitter_handle VARCHAR(255),
  reply_link VARCHAR(500) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  tasks_completed INT[],
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_winner BOOLEAN DEFAULT FALSE,
  winner_drawn_at TIMESTAMP,
  prize_won TEXT
);

-- Create Giveaway Tasks Table
CREATE TABLE IF NOT EXISTS giveaway_tasks (
  id SERIAL PRIMARY KEY,
  giveaway_id INT REFERENCES giveaways(id),
  label VARCHAR(255) NOT NULL,
  url TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create Partnerships Table
CREATE TABLE IF NOT EXISTS partnerships (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tasks TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create Visitor Stats Table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  visitor_count INTEGER DEFAULT 0,
  UNIQUE(date)
);

-- Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_entries_reply_link ON giveaway_entries(reply_link);
CREATE INDEX IF NOT EXISTS idx_entries_wallet ON giveaway_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_entries_created ON giveaway_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_entries_giveaway ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_entries_ip ON giveaway_entries(ip_address);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON giveaway_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_giveaway ON giveaway_tasks(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_status ON giveaways(status);
CREATE INDEX IF NOT EXISTS idx_giveaway_active ON giveaways(is_active);

-- Success message
SELECT 'Database setup completed successfully!' as status,
       'All tables and indexes have been created.' as message;
