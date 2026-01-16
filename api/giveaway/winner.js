// API endpoint to draw and manage winners
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminEmails.includes(email.toLowerCase()) || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const sql = getDb();

    // Get all non-winner entries
    const entries = await sql`
      SELECT id, twitter_handle, email, wallet_address
      FROM giveaway_entries
      WHERE is_winner = false
      ORDER BY created_at
    `;

    if (entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No entries available'
      });
    }

    // Randomly select a winner
    const randomIndex = Math.floor(Math.random() * entries.length);
    const winner = entries[randomIndex];

    // Mark as winner
    await sql`
      UPDATE giveaway_entries
      SET is_winner = true, winner_drawn_at = NOW()
      WHERE id = ${winner.id}
    `;

    return res.status(200).json({
      success: true,
      winner: {
        id: winner.id,
        twitter: winner.twitter_handle,
        email: winner.email,
        wallet: winner.wallet_address
      }
    });

  } catch (error) {
    console.error('Draw winner error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
