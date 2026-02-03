// Public API endpoint to list active giveaways
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();

    // Get live, scheduled, and ended giveaways for public view
    let giveaways;
    try {
      giveaways = await sql`
        SELECT id, title, description, status, start_time, end_time, winner_count, prizes, created_at
        FROM giveaways
        WHERE is_active = true AND (status = 'live' OR status = 'scheduled' OR status = 'ended')
        ORDER BY created_at DESC
      `;
    } catch (selectError) {
      console.log('Full select failed, trying basic select:', selectError.message);
      // Fallback: Try without winner_count and prizes
      giveaways = await sql`
        SELECT id, title, description, status, start_time, end_time, created_at
        FROM giveaways
        WHERE is_active = true AND (status = 'live' OR status = 'scheduled' OR status = 'ended')
        ORDER BY created_at DESC
      `;
    }

    return res.status(200).json({
      success: true,
      giveaways: giveaways
    });

  } catch (error) {
    console.error('Get public giveaways error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
}
