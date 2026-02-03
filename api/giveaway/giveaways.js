// API endpoint to manage giveaways
import { getDb } from '../db.js';

export default async function handler(req, res) {
  const sql = getDb();

  // GET - Retrieve all giveaways (admin only)
  if (req.method === 'GET') {
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

      // Try selecting with all fields, fallback to basic fields if columns don't exist
      let giveaways;
      try {
        giveaways = await sql`
          SELECT id, title, description, status, start_time, end_time, winner_count, prizes, created_at, is_active
          FROM giveaways
          WHERE is_active = true
          ORDER BY created_at DESC
        `;
      } catch (selectError) {
        console.log('Full select failed, trying basic select:', selectError.message);
        // Fallback: Try without winner_count and prizes
        giveaways = await sql`
          SELECT id, title, description, status, start_time, end_time, created_at, is_active
          FROM giveaways
          WHERE is_active = true
          ORDER BY created_at DESC
        `;
      }

      return res.status(200).json({
        success: true,
        giveaways: giveaways
      });
    } catch (error) {
      console.error('Get giveaways error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // POST - Create new giveaway (admin only)
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

      const { title, description, start_time, end_time, status, winner_count, prizes } = req.body;

      if (!title || !start_time || !end_time) {
        return res.status(400).json({ success: false, message: 'Title, start_time, and end_time are required' });
      }

      // Try inserting with all fields first, fallback to basic fields if columns don't exist
      let result;
      try {
        result = await sql`
          INSERT INTO giveaways (title, description, start_time, end_time, status, winner_count, prizes)
          VALUES (${title}, ${description || null}, ${start_time}, ${end_time}, ${status || 'draft'}, ${winner_count || 1}, ${prizes ? JSON.stringify(prizes) : null})
          RETURNING id, title, description, status, start_time, end_time, winner_count, prizes, created_at
        `;
      } catch (insertError) {
        console.log('Full insert failed, trying basic insert:', insertError.message);
        // Fallback: Try without winner_count and prizes if columns don't exist
        result = await sql`
          INSERT INTO giveaways (title, description, start_time, end_time, status)
          VALUES (${title}, ${description || null}, ${start_time}, ${end_time}, ${status || 'draft'})
          RETURNING id, title, description, status, start_time, end_time, created_at
        `;
      }

      return res.status(200).json({
        success: true,
        giveaway: result[0]
      });

    } catch (error) {
      console.error('Create giveaway error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // PUT - Update giveaway (admin only)
  if (req.method === 'PUT') {
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

      const { id, description } = req.body;

      await sql`
        UPDATE giveaways 
        SET description = ${description}, updated_at = NOW()
        WHERE id = ${id}
      `;

      return res.status(200).json({
        success: true,
        message: 'Giveaway updated'
      });
    } catch (error) {
      console.error('Update giveaway error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // DELETE - Remove giveaway (admin only)
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
        UPDATE giveaways 
        SET is_active = false 
        WHERE id = ${id}
      `;

      return res.status(200).json({
        success: true,
        message: 'Giveaway removed'
      });
    } catch (error) {
      console.error('Delete giveaway error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
