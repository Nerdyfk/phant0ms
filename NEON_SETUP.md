# Neon Database Setup Guide

## Step 1: Create Neon Database

1. Go to https://neon.tech
2. Sign up or log in
3. Create a new project: **phant0ms**
4. Copy the connection string

## Step 2: Add Environment Variable to Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Your Neon connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)
   - **Environments:** Production, Preview, Development

## Step 3: Initialize Database Schema

1. Go to Neon Console → SQL Editor
2. Copy the contents of `database/schema.sql`
3. Paste and execute in SQL Editor
4. Verify tables are created

## Step 4: Install Dependencies

```bash
cd d:\phant0ms
npm install
```

## Step 5: Test Locally (Optional)

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 6: Deploy to Vercel

```bash
git add .
git commit -m "Add Neon database integration"
git push
```

Vercel will automatically redeploy with the new changes.

## API Endpoints Created

### Public:
- `POST /api/giveaway/submit` - Submit giveaway entry
- `GET /api/giveaway/tasks` - Get active tasks

### Admin (Requires Bearer Token):
- `GET /api/giveaway/entries` - Get all entries
- `POST /api/giveaway/tasks` - Add new task
- `DELETE /api/giveaway/tasks` - Remove task
- `POST /api/giveaway/winner` - Draw random winner

## Bearer Token Format

For admin endpoints, use:
```
Authorization: Bearer <base64(email:password)>
```

Example (JavaScript):
```javascript
const token = btoa('admin@phant0ms.com:YourPassword');
headers: { 'Authorization': `Bearer ${token}` }
```

## Database Tables

- `giveaway_entries` - All giveaway submissions
- `giveaway_tasks` - Tasks users must complete
- `partnerships` - Partnership information
- `visitor_stats` - Daily visitor counts

## Next Steps

After deployment, update frontend code to use these API endpoints instead of localStorage.
