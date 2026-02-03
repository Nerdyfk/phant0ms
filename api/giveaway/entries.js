// API endpoint to get all giveaway entries (admin only)
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    // Simple token validation (email:password base64)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!adminEmails.includes(email.toLowerCase()) || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const sql = getDb();

    // Get all entries
    const entries = await sql`
      SELECT id, giveaway_id, twitter_handle, reply_link, wallet_address, tasks_completed, 
             created_at, is_winner, winner_drawn_at
      FROM giveaway_entries
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      success: true,
      entries: entries
    });

  } catch (error) {
    console.error('Get entries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
