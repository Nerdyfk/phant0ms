-- Migration SQL to add new features to existing database
-- Run this if you already have an existing Phantoms database

-- Add new columns to giveaways table
ALTER TABLE giveaways 
ADD COLUMN IF NOT EXISTS winner_count INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS prizes JSONB;

-- Modify status to include 'scheduled' option
-- Note: This doesn't change existing data, just allows the new status

-- Add new columns to giveaway_entries table
ALTER TABLE giveaway_entries 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS prize_won TEXT;

-- Note: reply_link already exists, but if you had 'email' column before, 
-- you might want to rename or migrate data

-- Add new index for IP-based rate limiting
CREATE INDEX IF NOT EXISTS idx_entries_ip ON giveaway_entries(ip_address);

-- Update any giveaways with NULL winner_count to 1
UPDATE giveaways SET winner_count = 1 WHERE winner_count IS NULL;

-- Helpful query to check your data
-- SELECT id, title, winner_count, prizes FROM giveaways WHERE is_active = true;
