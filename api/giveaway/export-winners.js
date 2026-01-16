import { getDb } from '../db.js';

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
    const winners = await sql`
      SELECT twitter_handle, email, wallet_address, winner_drawn_at
      FROM giveaway_entries
      WHERE is_winner = true
      ORDER BY winner_drawn_at DESC
    `;

    // Generate CSV
    let csv = 'Twitter Handle,Email,Wallet Address,Winner Drawn At\n';
    
    winners.forEach(winner => {
      const twitterHandle = `"${winner.twitter_handle.replace(/"/g, '""')}"`;
      const email = `"${winner.email.replace(/"/g, '""')}"`;
      const walletAddress = `"${winner.wallet_address.replace(/"/g, '""')}"`;
      const drawnAt = winner.winner_drawn_at ? new Date(winner.winner_drawn_at).toLocaleString() : '';
      
      csv += `${twitterHandle},${email},${walletAddress},"${drawnAt}"\n`;
    });

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="giveaway_winners_${Date.now()}.csv"`);
    res.status(200).send(csv);

  } catch (error) {
    console.error('Export winners error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
