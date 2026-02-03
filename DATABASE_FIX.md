# Database Migration Required

## Issue
The giveaway creation is failing because the database needs to be updated with new columns.

## Solution
You need to run the database migration to add the new columns to your Neon database.

### Option 1: Using Neon Console (Recommended)
1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Go to "SQL Editor"
4. Copy and paste the contents of `database/quick-fix.sql`
5. Click "Run" to execute the migration

### Option 2: Using psql command line
If you have PostgreSQL client installed:

```bash
psql "YOUR_DATABASE_URL" -f database/quick-fix.sql
```

Replace `YOUR_DATABASE_URL` with your actual Neon database connection string.

### Option 3: Use the migration.sql
Alternatively, you can run:

```bash
psql "YOUR_DATABASE_URL" -f database/migration.sql
```

## What This Does
The migration adds the following new columns:
- `giveaways.winner_count` - Number of winners per giveaway
- `giveaways.prizes` - JSONB field for prize information
- `giveaway_entries.ip_address` - For bot prevention
- `giveaway_entries.user_agent` - For bot detection
- `giveaway_entries.prize_won` - Prize assigned to winner

## After Migration
Once the migration is complete:
1. Refresh your admin panel
2. Try creating a giveaway again
3. All new features will work properly

## Already Applied Migration?
The code now has fallback support, so even if some columns are missing, basic giveaway creation will still work (just without the advanced features like multiple prizes).
