// API endpoint to manage giveaway tasks
import { getDb } from '../db.js';

export default async function handler(req, res) {
  const sql = getDb();

  // GET - Retrieve all active tasks
  if (req.method === 'GET') {
    try {
      const tasks = await sql`
        SELECT id, label, url, created_at
        FROM giveaway_tasks
        WHERE is_active = true
        ORDER BY created_at ASC
      `;

      return res.status(200).json({
        success: true,
        tasks: tasks
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // POST - Add new task (admin only)
  if (req.method === 'POST') {
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

      const { label, url } = req.body;

      if (!label) {
        return res.status(400).json({ success: false, message: 'Label is required' });
      }

      const result = await sql`
        INSERT INTO giveaway_tasks (label, url)
        VALUES (${label}, ${url || null})
        RETURNING id, label, url, created_at
      `;

      return res.status(200).json({
        success: true,
        task: result[0]
      });

    } catch (error) {
      console.error('Add task error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // DELETE - Remove task (admin only)
  if (req.method === 'DELETE') {
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

      const { id } = req.body;

      await sql`
        UPDATE giveaway_tasks 
        SET is_active = false 
        WHERE id = ${id}
      `;

      return res.status(200).json({
        success: true,
        message: 'Task removed'
      });

    } catch (error) {
      console.error('Delete task error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
