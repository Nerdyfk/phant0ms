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

    const { giveaway_id, count } = req.body;
    const sql = getDb();

    // Get giveaway details
    const giveaway = await sql`
      SELECT winner_count, prizes, status
      FROM giveaways
      WHERE id = ${giveaway_id}
      LIMIT 1
    `;

    if (!giveaway || giveaway.length === 0) {
      return res.status(404).json({ success: false, message: 'Giveaway not found' });
    }

    if (giveaway[0].status !== 'ended') {
      return res.status(400).json({ success: false, message: 'Giveaway must be ended before drawing winners' });
    }

    const winnerCount = count || giveaway[0].winner_count || 1;
    const prizes = giveaway[0].prizes || [];

    // Get all non-winner entries for the giveaway
    let entries;
    if (giveaway_id) {
      entries = await sql`
        SELECT id, twitter_handle, reply_link, wallet_address
        FROM giveaway_entries
        WHERE is_winner = false AND giveaway_id = ${giveaway_id}
        ORDER BY created_at
      `;
    } else {
      entries = await sql`
        SELECT id, twitter_handle, reply_link, wallet_address
        FROM giveaway_entries
        WHERE is_winner = false
        ORDER BY created_at
      `;
    }

    if (entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No entries available'
      });
    }

    if (entries.length < winnerCount) {
      return res.status(400).json({
        success: false,
        message: `Not enough entries. Only ${entries.length} available, but ${winnerCount} winners requested.`
      });
    }

    // Randomly select winners
    const winners = [];
    const selectedIndices = new Set();
    
    while (winners.length < winnerCount && selectedIndices.size < entries.length) {
      const randomIndex = Math.floor(Math.random() * entries.length);
      if (!selectedIndices.has(randomIndex)) {
        selectedIndices.add(randomIndex);
        const winner = entries[randomIndex];
        
        // Assign prize if available
        const prizeWon = prizes[winners.length] ? 
          `${prizes[winners.length].name}: ${prizes[winners.length].description}` : 
          (prizes.length > 0 ? `${prizes[0].name}: ${prizes[0].description}` : null);
        
        // Mark as winner
        await sql`
          UPDATE giveaway_entries
          SET is_winner = true, winner_drawn_at = NOW(), prize_won = ${prizeWon}
          WHERE id = ${winner.id}
        `;
        
        winners.push({
          id: winner.id,
          twitter_handle: winner.twitter_handle,
          reply_link: winner.reply_link,
          wallet_address: winner.wallet_address,
          prize_won: prizeWon
        });
      }
    }

    return res.status(200).json({
      success: true,
      winners: winners
    });

  } catch (error) {
    console.error('Draw winner error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
