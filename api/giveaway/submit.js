// API endpoint to submit giveaway entry
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();
    
    // Ensure entries table exists with correct schema
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS giveaway_entries (
          id SERIAL PRIMARY KEY,
          giveaway_id TEXT,
          twitter_handle VARCHAR(255),
          email VARCHAR(255),
          reply_link VARCHAR(500) NOT NULL,
          wallet_address VARCHAR(255) NOT NULL,
          tasks_completed INT[],
          ip_address VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          is_winner BOOLEAN DEFAULT FALSE,
          winner_drawn_at TIMESTAMP,
          prize_won TEXT
        )
      `;

      // Check if giveaway_entries table has correct giveaway_id type
      const checkTable = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'giveaway_entries' AND column_name = 'giveaway_id'
      `;
      
      // If table exists but giveaway_id is INT, migrate it
      if (checkTable.length > 0 && checkTable[0].data_type === 'integer') {
        console.log('Migrating giveaway_entries table to support TEXT giveaway_id...');
        try {
          // Drop the foreign key constraint first
          await sql`
            ALTER TABLE giveaway_entries 
            DROP CONSTRAINT IF EXISTS giveaway_entries_giveaway_id_fkey
          `;
        } catch (e) {
          console.log('Could not drop FK:', e.message);
        }
        
        try {
          // Change the column type
          await sql`
            ALTER TABLE giveaway_entries 
            ALTER COLUMN giveaway_id TYPE TEXT USING giveaway_id::TEXT
          `;
        } catch (e) {
          console.log('Could not alter column:', e.message);
        }
      }
    } catch (e) {
      console.log('Schema check info:', e.message);
    }

    const { twitter_handle, reply_link, wallet_address, tasks_completed, giveaway_id } = req.body;

    // Get IP address and user agent for bot prevention
    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Validate input
    if (!reply_link || !wallet_address) {
      return res.status(400).json({ 
        success: false,
        message: 'Reply link and wallet address are required' 
      });
    }

    // Basic bot detection - check if user agent looks legitimate
    if (userAgent === 'unknown' || userAgent.length < 10) {
      return res.status(403).json({
        success: false,
        message: 'Invalid request'
      });
    }

    // Check giveaway status
    if (giveaway_id) {
      const giveaway = await sql`
        SELECT status, end_time FROM giveaways 
        WHERE id = ${giveaway_id} AND is_active = true 
        LIMIT 1
      `;

      if (giveaway.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Giveaway not found'
        });
      }

      if (giveaway[0].status !== 'live') {
        return res.status(400).json({
          success: false,
          message: 'Giveaway is not currently active'
        });
      }

      // Check if giveaway has ended
      if (new Date(giveaway[0].end_time) < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Giveaway has ended'
        });
      }
    }

    // Check if reply link or wallet already submitted for this giveaway
    let existing;
    if (giveaway_id) {
      existing = await sql`
        SELECT id FROM giveaway_entries 
        WHERE (reply_link = ${reply_link} OR wallet_address = ${wallet_address})
        AND giveaway_id = ${giveaway_id}
        LIMIT 1
      `;
    } else {
      existing = await sql`
        SELECT id FROM giveaway_entries 
        WHERE (reply_link = ${reply_link} OR wallet_address = ${wallet_address})
        LIMIT 1
      `;
    }

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an entry with this reply link or wallet address'
      });
    }

    // Rate limiting: Check submissions from same IP in last hour
    const recentFromIP = await sql`
      SELECT COUNT(*) as count FROM giveaway_entries
      WHERE ip_address = ${ipAddress}
      AND created_at > NOW() - INTERVAL '1 hour'
    `;

    if (recentFromIP[0].count >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please try again later.'
      });
    }

    const normalizedTasks = Array.isArray(tasks_completed)
      ? tasks_completed.map(Number).filter(Number.isFinite)
      : null;

    // Insert new entry
    const result = await sql`
      INSERT INTO giveaway_entries (giveaway_id, twitter_handle, reply_link, wallet_address, tasks_completed, ip_address, user_agent)
      VALUES (${giveaway_id || null}, ${twitter_handle || null}, ${reply_link}, ${wallet_address}, ${normalizedTasks}, ${ipAddress}, ${userAgent})
      RETURNING id, giveaway_id, reply_link, wallet_address, created_at
    `;

    // Verify insert and surface DB info for debugging
    const verify = await sql`
      SELECT COUNT(*)::int AS total FROM giveaway_entries
    `;
    const dbInfo = await sql`
      SELECT current_database() AS db, current_schema() AS schema
    `;

    return res.status(200).json({
      success: true,
      message: 'Entry submitted successfully',
      entry: result[0],
      totalEntries: verify[0]?.total || 0,
      db: dbInfo[0] || null
    });

  } catch (error) {
    console.error('Giveaway submission error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
}
