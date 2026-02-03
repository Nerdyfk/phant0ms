-- Quick fix: Add missing columns if they don't exist
-- This is safe to run multiple times

DO $$ 
BEGIN
    -- Add winner_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='giveaways' AND column_name='winner_count') THEN
        ALTER TABLE giveaways ADD COLUMN winner_count INT DEFAULT 1;
        RAISE NOTICE 'Added winner_count column';
    END IF;

    -- Add prizes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='giveaways' AND column_name='prizes') THEN
        ALTER TABLE giveaways ADD COLUMN prizes JSONB;
        RAISE NOTICE 'Added prizes column';
    END IF;

    -- Add ip_address column to giveaway_entries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='giveaway_entries' AND column_name='ip_address') THEN
        ALTER TABLE giveaway_entries ADD COLUMN ip_address VARCHAR(45);
        RAISE NOTICE 'Added ip_address column';
    END IF;

    -- Add user_agent column to giveaway_entries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='giveaway_entries' AND column_name='user_agent') THEN
        ALTER TABLE giveaway_entries ADD COLUMN user_agent TEXT;
        RAISE NOTICE 'Added user_agent column';
    END IF;

    -- Add prize_won column to giveaway_entries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='giveaway_entries' AND column_name='prize_won') THEN
        ALTER TABLE giveaway_entries ADD COLUMN prize_won TEXT;
        RAISE NOTICE 'Added prize_won column';
    END IF;
END $$;

-- Update any existing giveaways with NULL winner_count to 1
UPDATE giveaways SET winner_count = 1 WHERE winner_count IS NULL;

-- Add index for IP-based rate limiting if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_entries_ip ON giveaway_entries(ip_address);

-- Display success message
SELECT 'Database migration completed successfully!' as status;
