// API endpoint to control giveaway status (start/end)
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

    const { id, action } = req.body;
    const sql = getDb();

    if (!id || !action) {
      return res.status(400).json({ success: false, message: 'Missing id or action' });
    }

    let newStatus;
    if (action === 'start') {
      newStatus = 'live';
    } else if (action === 'end') {
      newStatus = 'ended';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    await sql`
      UPDATE giveaways
      SET status = ${newStatus}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return res.status(200).json({
      success: true,
      message: `Giveaway ${action}ed successfully`,
      status: newStatus
    });

  } catch (error) {
    console.error('Control giveaway error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
