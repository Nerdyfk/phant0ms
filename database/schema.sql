-- Neon Database Schema for Phantoms Giveaway

-- Giveaway Table (Main)
CREATE TABLE IF NOT EXISTS giveaways (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'live', 'ended'
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Giveaway Entries Table
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id SERIAL PRIMARY KEY,
  giveaway_id INT REFERENCES giveaways(id),
  twitter_handle VARCHAR(255),
  reply_link VARCHAR(500) NOT NULL, -- Changed from email to reply link
  wallet_address VARCHAR(255) NOT NULL,
  tasks_completed INT[], -- Array of completed task IDs
  created_at TIMESTAMP DEFAULT NOW(),
  is_winner BOOLEAN DEFAULT FALSE,
  winner_drawn_at TIMESTAMP
);

-- Giveaway Tasks Table
CREATE TABLE IF NOT EXISTS giveaway_tasks (
  id SERIAL PRIMARY KEY,
  giveaway_id INT REFERENCES giveaways(id),
  label VARCHAR(255) NOT NULL,
  url TEXT,
  is_required BOOLEAN DEFAULT FALSE, -- Track if task is required
  sort_order INT DEFAULT 0,
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
CREATE INDEX IF NOT EXISTS idx_entries_email ON giveaway_entries(reply_link);
CREATE INDEX IF NOT EXISTS idx_entries_wallet ON giveaway_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_entries_created ON giveaway_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_entries_giveaway ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON giveaway_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_giveaway ON giveaway_tasks(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_status ON giveaways(status);
CREATE INDEX IF NOT EXISTS idx_giveaway_active ON giveaways(is_active);
