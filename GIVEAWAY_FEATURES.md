# Phantoms Giveaway System - New Features

## Overview
Complete giveaway management system with admin controls, bot prevention, and multiple winner support.

## ✨ New Features

### 1. **Reply Link Submission**
- Replaced email field with Twitter/X reply link
- Users must provide their reply link to the giveaway post
- Better verification and engagement tracking

### 2. **Countdown Timers**
- **Admin Panel**: Real-time countdown showing time until giveaway starts/ends
- **Website**: Live timer displayed for each giveaway
- Automatic status updates when time expires

### 3. **Bot Prevention**
- IP-based rate limiting (max 5 submissions per hour per IP)
- User agent validation
- Duplicate detection (reply link + wallet address)
- Giveaway status validation (must be 'live' to accept entries)

### 4. **Giveaway Control Buttons**
Admin can control giveaway lifecycle:
- **Start Giveaway**: Change status from draft/scheduled to live
- **End Giveaway**: Manually end a live giveaway
- Buttons disabled based on current status
- Timer updates in real-time

### 5. **Description Management**
- Add rich descriptions to each giveaway
- Edit descriptions anytime from admin panel
- Descriptions display prominently on both admin and public pages

### 6. **Required vs Optional Tasks**
- Admin marks tasks as "Required" or "Optional"
- Required tasks show **red star (★)** on website
- Optional tasks show gray "(Optional)" text
- Users can see which tasks are mandatory

### 7. **Multiple Winners & Prizes**
- **Winner Count**: Admin sets how many winners to draw
- **Prize List**: Add multiple prizes with names and descriptions
- Prizes auto-assigned to winners during drawing
- Winners display shows which prize each person won

### 8. **Enhanced Admin Panel**
- View giveaway status at a glance
- See prize count and winner count in giveaway list
- Filter submissions by giveaway
- Timer shows exact countdown
- Start/End buttons with smart enabling/disabling
- Draw button only enabled when giveaway is ended

### 9. **Status Management**
New giveaway statuses:
- **Draft**: Not yet published
- **Scheduled**: Set to go live later
- **Live**: Currently accepting entries
- **Ended**: Closed, ready for winner drawing

## 🎯 Usage Guide

### Creating a Giveaway

1. **Login** to admin panel
2. Fill out giveaway form:
   - Title (required)
   - Description (optional, can edit later)
   - Start Time (required)
   - End Time (required)
   - Number of Winners (default: 1)
   - Prizes (one per line, format: "Prize Name: Description")
   - Status (draft/scheduled/live/ended)
3. Click "Create Giveaway"

### Managing Tasks

1. Select a giveaway from dropdown
2. Add task name and optional URL
3. Check "Mark as Required Task" for mandatory tasks
4. Required tasks will show ★ on website

### Starting a Giveaway

1. Select giveaway from dropdown
2. View timer showing "Starts in" countdown
3. Click "▶️ Start Giveaway" button
4. Status changes to "Live"
5. Website immediately shows giveaway as active

### Drawing Winners

1. Wait for giveaway to end (or manually end it)
2. Select the giveaway
3. Timer shows "Giveaway Ended"
4. Click "🎲 Draw Winners" button
5. System randomly selects winners
6. Prizes automatically assigned
7. Winners displayed with their prizes

### User Experience

**On Website:**
- See all live and ended giveaways
- Filter by status (🔴 LIVE / ✅ ENDED)
- View countdown timer for each giveaway
- See prize pool and winner count
- Required tasks marked with red ★
- Submit with Twitter reply link

## 🔐 Security Features

### Bot Prevention
- Rate limiting: 5 submissions/hour per IP
- User agent validation
- Duplicate entry prevention
- Status validation (must be live)
- End time validation (can't submit after ended)

### Admin Security
- Bearer token authentication
- Environment variable credentials
- Secure password hashing
- Action authorization checks

## 📊 Database Schema

### Updated Tables

**giveaways**
```sql
- winner_count INT (number of winners)
- prizes JSONB (array of prize objects)
```

**giveaway_entries**
```sql
- reply_link VARCHAR(500) (Twitter/X reply link)
- ip_address VARCHAR(45) (for rate limiting)
- user_agent TEXT (for bot detection)
- prize_won TEXT (assigned prize if winner)
```

## 🚀 API Endpoints

### Public
- `GET /api/giveaway/list` - Get active giveaways
- `GET /api/giveaway/tasks?giveaway_id=X` - Get tasks
- `POST /api/giveaway/submit` - Submit entry

### Admin Only (require Bearer token)
- `POST /api/giveaway/control` - Start/end giveaway
- `POST /api/giveaway/winner` - Draw winners
- `PUT /api/giveaway/giveaways` - Update description
- `GET /api/giveaway/entries` - View all entries
- `GET /api/giveaway/export-winners` - Download CSV

## 🎨 UI Enhancements

### Admin Panel
- Real-time countdown timers
- Color-coded status badges
- Disabled button states
- Prize/winner count display
- Pulsing winner announcement
- Smooth animations

### Website
- Live countdown timers per giveaway
- Prize showcase boxes
- Required task indicators (red ★)
- Winner count display
- Enhanced status badges
- Responsive design

## 📝 Migration

If you have an existing database:

```sql
-- Run migration.sql to add new columns
psql YOUR_DATABASE < database/migration.sql
```

Or manually execute:
```sql
ALTER TABLE giveaways ADD COLUMN winner_count INT DEFAULT 1;
ALTER TABLE giveaways ADD COLUMN prizes JSONB;
ALTER TABLE giveaway_entries ADD COLUMN ip_address VARCHAR(45);
ALTER TABLE giveaway_entries ADD COLUMN user_agent TEXT;
ALTER TABLE giveaway_entries ADD COLUMN prize_won TEXT;
```

## 🎉 Complete Feature List

✅ Reply link submission instead of email  
✅ Countdown timers (admin & website)  
✅ Bot prevention (IP rate limiting, user agent check)  
✅ Start/End giveaway buttons  
✅ Edit description functionality  
✅ Required/Optional task control  
✅ Red star (★) for required tasks  
✅ Multiple winners per giveaway  
✅ Multiple prizes management  
✅ Prize auto-assignment to winners  
✅ Draw button enabled only when ended  
✅ Real-time timer updates  
✅ Enhanced security checks  
✅ Improved admin UX  
✅ Better public display  

## 🔧 Environment Variables

Required in Vercel/deployment:
```
DATABASE_URL=your_neon_database_url
ADMIN_EMAILS=admin@example.com,owner@example.com
ADMIN_PASSWORD=your_secure_password
```

## 📱 Responsive Design

All features work seamlessly on:
- Desktop browsers
- Tablets
- Mobile devices
- Different screen sizes

---

**Built with:** Node.js, Neon PostgreSQL, Vercel Serverless Functions  
**Framework:** Vanilla JavaScript (no dependencies)  
**Database:** PostgreSQL with JSONB support
