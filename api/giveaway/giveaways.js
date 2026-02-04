// API endpoint to manage giveaways
import { getDb } from '../db.js';

export default async function handler(req, res) {
  const sql = getDb();

  let parsedBody = req.body;
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body);
    } catch {
      parsedBody = {};
    }
  }

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
      return res.status(500).json({ success: false, message: error.message || 'Server error', error: error.toString() });
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

      const { title, description, start_time, end_time, status, winner_count, prizes } = parsedBody || {};

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
      return res.status(500).json({ success: false, message: error.message || 'Server error', error: error.toString() });
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

      const id = parsedBody?.id || (req.query?.id ? parseInt(req.query.id) : undefined);
      const { title, description, start_time, end_time, status } = parsedBody || {};

      if (!id) {
        return res.status(400).json({ success: false, message: 'Giveaway id is required' });
      }

      try {
        // Update all fields provided
        await sql`
          UPDATE giveaways 
          SET 
            title = COALESCE(${title}, title),
            description = COALESCE(${description}, description),
            start_time = COALESCE(${start_time}, start_time),
            end_time = COALESCE(${end_time}, end_time),
            status = COALESCE(${status}, status),
            updated_at = NOW()
          WHERE id = ${id}
        `;
      } catch (updateError) {
        if (updateError.message?.includes('updated_at')) {
          // Fallback: try without updated_at if column doesn't exist
          await sql`
            UPDATE giveaways 
            SET 
              title = COALESCE(${title}, title),
              description = COALESCE(${description}, description),
              start_time = COALESCE(${start_time}, start_time),
              end_time = COALESCE(${end_time}, end_time),
              status = COALESCE(${status}, status)
            WHERE id = ${id}
          `;
        } else {
          throw updateError;
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Giveaway updated'
      });
    } catch (error) {
      console.error('Update giveaway error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error', error: error.toString() });
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

      const id = parsedBody?.id || (req.query?.id ? parseInt(req.query.id) : undefined);

      if (!id) {
        return res.status(400).json({ success: false, message: 'Giveaway id is required' });
      }

      try {
        await sql`
          UPDATE giveaways 
          SET is_active = false 
          WHERE id = ${id}
        `;
      } catch (deleteError) {
        if (deleteError.message?.includes('is_active')) {
          await sql`
            DELETE FROM giveaways
            WHERE id = ${id}
          `;
        } else {
          throw deleteError;
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Giveaway removed'
      });
    } catch (error) {
      console.error('Delete giveaway error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error', error: error.toString() });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
