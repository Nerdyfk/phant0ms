// API endpoint to submit giveaway entry
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { twitter, email, wallet, tasks } = req.body;

    // Validate input
    if (!twitter || !email || !wallet || !tasks || tasks.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    const sql = getDb();

    // Check if email or wallet already submitted
    const existing = await sql`
      SELECT id FROM giveaway_entries 
      WHERE email = ${email} OR wallet_address = ${wallet}
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
      INSERT INTO giveaway_entries (twitter_handle, email, wallet_address, tasks_completed)
      VALUES (${twitter}, ${email}, ${wallet}, ${tasks})
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
