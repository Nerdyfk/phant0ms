// API endpoint to manage giveaway tasks
import { getDb } from '../db.js';

export default async function handler(req, res) {
  const sql = getDb();

  async function ensureTasksTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS giveaway_tasks (
        id SERIAL PRIMARY KEY,
        giveaway_id INT REFERENCES giveaways(id),
        label VARCHAR(255) NOT NULL,
        url TEXT,
        is_required BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_active ON giveaway_tasks(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_giveaway ON giveaway_tasks(giveaway_id)`;
  }

  let parsedBody = req.body;
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body);
    } catch {
      parsedBody = {};
    }
  }

  // GET - Retrieve tasks (optionally filtered by giveaway_id)
  if (req.method === 'GET') {
    try {
      await ensureTasksTable();
      const { giveaway_id } = req.query;
      
      let tasks;
      if (giveaway_id) {
        tasks = await sql`
          SELECT id, giveaway_id, label, url, is_required, sort_order, created_at
          FROM giveaway_tasks
          WHERE is_active = true AND giveaway_id = ${parseInt(giveaway_id)}
          ORDER BY sort_order ASC, created_at ASC
        `;
      } else {
        tasks = await sql`
          SELECT id, giveaway_id, label, url, is_required, sort_order, created_at
          FROM giveaway_tasks
          WHERE is_active = true
          ORDER BY giveaway_id ASC, sort_order ASC, created_at ASC
        `;
      }

      return res.status(200).json({
        success: true,
        tasks: tasks
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // POST - Add new task (admin only)
  if (req.method === 'POST') {
    try {
      await ensureTasksTable();
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

      const { giveaway_id, label, url, is_required } = parsedBody || {};

      if (!label) {
        return res.status(400).json({ success: false, message: 'Label is required' });
      }

      const result = await sql`
        INSERT INTO giveaway_tasks (giveaway_id, label, url, is_required)
        VALUES (${giveaway_id || null}, ${label}, ${url || null}, ${is_required || false})
        RETURNING id, giveaway_id, label, url, is_required, created_at
      `;

      return res.status(200).json({
        success: true,
        task: result[0]
      });

    } catch (error) {
      console.error('Add task error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // DELETE - Remove task (admin only)
  if (req.method === 'DELETE') {
    try {
      await ensureTasksTable();
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

      const id = parsedBody?.id || (req.query?.id ? parseInt(req.query.id) : undefined);

      if (!id) {
        return res.status(400).json({ success: false, message: 'Task id is required' });
      }

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
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
