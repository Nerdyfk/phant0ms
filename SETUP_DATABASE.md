# 🔧 Database Setup Instructions

## The Problem
Your Neon database doesn't have the required tables and columns set up yet. You're seeing the error:
```
Failed: column "start_time" of relation "giveaways" does not exist
```

## The Solution
You need to run the database setup script in your Neon database.

---

## 📋 Step-by-Step Instructions

### 1. Open Neon Console
Go to: **https://console.neon.tech**

### 2. Select Your Project
- Click on your Phantoms project
- Navigate to **"SQL Editor"** in the left sidebar

### 3. Run the Setup Script

#### Option A: Complete Fresh Setup (Recommended for new projects)
1. Open the file: `database/complete-setup.sql`
2. Copy ALL the contents
3. Paste into Neon SQL Editor
4. Click **"Run"** button

This will create all tables from scratch with all the new columns.

#### Option B: If you already have data
1. **First**, run `database/complete-setup.sql` to ensure all tables exist
2. **Then**, if you get errors about tables already existing, that's OK - it means you have partial setup
3. The script uses `IF NOT EXISTS` so it won't overwrite existing data

### 4. Verify Setup
After running the script, you should see:
```
✓ Database setup completed successfully!
```

### 5. Test Your Admin Panel
1. Go back to your admin panel
2. Try creating a giveaway again
3. It should now work!

---

## 🎯 Quick Copy-Paste

If you want to do it quickly via command line (if you have psql installed):

```bash
# Replace YOUR_DATABASE_URL with your actual Neon connection string
psql "YOUR_DATABASE_URL" -f database/complete-setup.sql
```

---

## ❓ Troubleshooting

### "Table already exists" error
- This is normal if you have partial setup
- The script will skip existing tables
- Your data is safe

### "Permission denied" error
- Make sure you're using the correct database URL
- Check that your Neon project is active
- Verify your database user has CREATE permissions

### Still getting errors?
1. Check the Neon console for the exact error message
2. Make sure your DATABASE_URL environment variable is set correctly in Vercel
3. Try refreshing the Neon connection

---

## 📊 What Gets Created

The script creates these tables:
- ✅ `giveaways` - Main giveaway information
- ✅ `giveaway_entries` - User submissions
- ✅ `giveaway_tasks` - Tasks for each giveaway
- ✅ `partnerships` - Partnership information
- ✅ `visitor_stats` - Website analytics

Plus all necessary indexes for performance.

---

## 🔄 After Setup

Once the database is ready:
1. Reload your admin panel
2. Create your first giveaway
3. All features will work:
   - ✅ Multiple winners
   - ✅ Prize management
   - ✅ Timer countdowns
   - ✅ Required/Optional tasks
   - ✅ Bot prevention
   - ✅ Start/End controls

---

Need help? Check the error messages in:
- Browser Console (F12)
- Neon SQL Editor output
- Vercel deployment logs
