// API endpoint to submit giveaway entry
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { twitter_handle, reply_link, wallet_address, tasks_completed, giveaway_id } = req.body;

    // Validate input
    if (!reply_link || !wallet_address) {
      return res.status(400).json({ 
        success: false,
        message: 'Reply link and wallet address are required' 
      });
    }

    const sql = getDb();

    // Check if reply link or wallet already submitted for this giveaway
    const existing = await sql`
      SELECT id FROM giveaway_entries 
      WHERE (reply_link = ${reply_link} OR wallet_address = ${wallet_address})
      ${giveaway_id ? `AND giveaway_id = ${giveaway_id}` : ''}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an entry'
      });
    }

    // Insert new entry
    const result = await sql`
      INSERT INTO giveaway_entries (giveaway_id, twitter_handle, reply_link, wallet_address, tasks_completed)
      VALUES (${giveaway_id || null}, ${twitter_handle || null}, ${reply_link}, ${wallet_address}, ${tasks_completed ? JSON.stringify(tasks_completed) : null})
      RETURNING id
    `;

    return res.status(200).json({
      success: true,
      message: 'Entry submitted successfully',
      entryId: result[0].id
    });

  } catch (error) {
    console.error('Giveaway submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
