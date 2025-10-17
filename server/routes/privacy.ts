import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// Get privacy and terms content
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT privacy, terms FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      // If no record exists, return empty content
      return res.json({ privacy: '', terms: '' });
    }
    
    res.json({
      privacy: rows[0].privacy || '',
      terms: rows[0].terms || ''
    });
  } catch (error: any) {
    console.error('Error fetching privacy/terms:', error);
    res.status(500).json({ message: 'Failed to fetch privacy/terms content', error: error.message });
  }
});

// Update privacy content
router.post('/', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }
    
    // Check if a record exists
    const [existingRows]: any = await pool.query(
      'SELECT id FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (existingRows.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE privacy_terms SET privacy = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, existingRows[0].id]
      );
    } else {
      // Insert new record
      await pool.query(
        'INSERT INTO privacy_terms (privacy, terms) VALUES (?, ?)',
        [content, '']
      );
    }
    
    res.json({ message: 'Privacy content updated successfully' });
  } catch (error: any) {
    console.error('Error updating privacy content:', error);
    res.status(500).json({ message: 'Failed to update privacy content', error: error.message });
  }
});

// Update terms content
router.post('/terms', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'Content must be a string' });
    }
    
    // Check if a record exists
    const [existingRows]: any = await pool.query(
      'SELECT id FROM privacy_terms ORDER BY id DESC LIMIT 1'
    );
    
    if (existingRows.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE privacy_terms SET terms = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, existingRows[0].id]
      );
    } else {
      // Insert new record
      await pool.query(
        'INSERT INTO privacy_terms (privacy, terms) VALUES (?, ?)',
        ['', content]
      );
    }
    
    res.json({ message: 'Terms content updated successfully' });
  } catch (error: any) {
    console.error('Error updating terms content:', error);
    res.status(500).json({ message: 'Failed to update terms content', error: error.message });
  }
});

export default router;
