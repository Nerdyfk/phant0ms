import { getDb } from '../db.js';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString();
    const [email, password] = decoded.split(':');

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminEmails.includes(email) || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Fetch all winners from database
    const sql = getDb();
    const { giveaway_id, format = 'csv' } = req.query;

    let winners;
    if (giveaway_id) {
      winners = await sql`
        SELECT e.twitter_handle, e.email, e.wallet_address, e.reply_link, e.prize_won, e.winner_drawn_at, e.giveaway_id,
               e.tasks_completed, g.title AS giveaway_title
        FROM giveaway_entries e
        LEFT JOIN giveaways g ON e.giveaway_id = g.id::text
        WHERE e.is_winner = true AND e.giveaway_id = ${giveaway_id}
        ORDER BY e.winner_drawn_at DESC
      `;
    } else {
      winners = await sql`
        SELECT e.twitter_handle, e.email, e.wallet_address, e.reply_link, e.prize_won, e.winner_drawn_at, e.giveaway_id,
               e.tasks_completed, g.title AS giveaway_title
        FROM giveaway_entries e
        LEFT JOIN giveaways g ON e.giveaway_id = g.id::text
        WHERE e.is_winner = true
        ORDER BY e.winner_drawn_at DESC
      `;
    }

    const rows = winners.map(w => ({
      'Twitter Handle': w.twitter_handle || '',
      'Email': w.email || '',
      'Wallet Address': w.wallet_address || '',
      'Reply Link': w.reply_link || '',
      'Task Proof (IDs)': Array.isArray(w.tasks_completed) ? w.tasks_completed.join(' ') : '',
      'Prize Won': w.prize_won || '',
      'Giveaway': w.giveaway_title || w.giveaway_id || '',
      'Winner Drawn At': w.winner_drawn_at ? new Date(w.winner_drawn_at).toLocaleString() : ''
    }));

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Winners');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="giveaway_winners_${Date.now()}.xlsx"`);
      res.status(200).send(buffer);
      return;
    }

    // Generate CSV
    let csv = 'Twitter Handle,Email,Wallet Address,Reply Link,Prize Won,Giveaway,Winner Drawn At\n';
    rows.forEach(row => {
      const line = Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
      csv += `${line}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="giveaway_winners_${Date.now()}.csv"`);
    res.status(200).send(csv);

  } catch (error) {
    console.error('Export winners error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
