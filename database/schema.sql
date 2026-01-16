-- Neon Database Schema for Phantoms Giveaway

-- Giveaway Entries Table
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  tasks_completed TEXT[], -- Array of completed task IDs
  created_at TIMESTAMP DEFAULT NOW(),
  is_winner BOOLEAN DEFAULT FALSE,
  winner_drawn_at TIMESTAMP
);

-- Giveaway Tasks Table
CREATE TABLE IF NOT EXISTS giveaway_tasks (
  id SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Partnerships Table
CREATE TABLE IF NOT EXISTS partnerships (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tasks TEXT[], -- Array of task requirements
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Visitor Stats Table
CREATE TABLE IF NOT EXISTS visitor_stats (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  visitor_count INTEGER DEFAULT 0,
  UNIQUE(date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entries_email ON giveaway_entries(email);
CREATE INDEX IF NOT EXISTS idx_entries_wallet ON giveaway_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_entries_created ON giveaway_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON giveaway_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_partnerships_active ON partnerships(is_active);
