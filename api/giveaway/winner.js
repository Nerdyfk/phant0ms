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

    const { giveaway_id, count, mode, entry_ids } = req.body;
    const sql = getDb();

    // Get giveaway details
    const giveaway = await sql`
      SELECT winner_count, prizes, status, end_time
      FROM giveaways
      WHERE id::text = ${giveaway_id}
      LIMIT 1
    `;

    if (!giveaway || giveaway.length === 0) {
      return res.status(404).json({ success: false, message: 'Giveaway not found' });
    }

    const now = Date.now();
    const endTime = giveaway[0].end_time ? new Date(giveaway[0].end_time).getTime() : NaN;
    const isTimeEnded = !Number.isNaN(endTime) && now > endTime;

    if (giveaway[0].status !== 'ended' && !isTimeEnded) {
      return res.status(400).json({ success: false, message: 'Giveaway must be ended before drawing winners' });
    }

    const winnerCount = count || giveaway[0].winner_count || 1;
    const prizes = giveaway[0].prizes || [];

    // Manual winner selection
    if (mode === 'manual' && Array.isArray(entry_ids) && entry_ids.length > 0) {
      if (entry_ids.length > winnerCount) {
        return res.status(400).json({
          success: false,
          message: `Selected ${entry_ids.length} winners but limit is ${winnerCount}`
        });
      }

      const winners = [];
      for (let i = 0; i < entry_ids.length; i++) {
        const entryId = entry_ids[i];
        const rows = await sql`
          SELECT id, twitter_handle, reply_link, wallet_address, is_winner
          FROM giveaway_entries
          WHERE id = ${entryId} AND giveaway_id = ${giveaway_id}
          LIMIT 1
        `;

        if (!rows || rows.length === 0) {
          continue;
        }

        if (rows[0].is_winner) {
          continue;
        }

        const prizeWon = prizes[i]
          ? `${prizes[i].name}: ${prizes[i].description}`
          : (prizes.length > 0 ? `${prizes[0].name}: ${prizes[0].description}` : null);

        await sql`
          UPDATE giveaway_entries
          SET is_winner = true, winner_drawn_at = NOW(), prize_won = ${prizeWon}
          WHERE id = ${rows[0].id}
        `;

        winners.push({
          id: rows[0].id,
          twitter_handle: rows[0].twitter_handle,
          reply_link: rows[0].reply_link,
          wallet_address: rows[0].wallet_address,
          prize_won: prizeWon
        });
      }

      if (winners.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid entries selected'
        });
      }

      return res.status(200).json({
        success: true,
        winners
      });
    }

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
