// Public API endpoint to list active giveaways
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();

    // Get only live and ended giveaways for public view
    const giveaways = await sql`
      SELECT id, title, description, status, start_time, end_time, winner_count, prizes, created_at
      FROM giveaways
      WHERE is_active = true AND (status = 'live' OR status = 'ended')
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      success: true,
      giveaways: giveaways
    });

  } catch (error) {
    console.error('Get public giveaways error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
