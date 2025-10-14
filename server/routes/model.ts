import express from 'express';
import { queryWithRetry } from '../db';

const router = express.Router();

// GET /api/models?brand_id=123 or GET /api/models?brand_id=all
router.get('/', async (req, res) => {
  try {
    const brand_id = req.query.brand_id;
    if (!brand_id) return res.status(400).json({ message: 'brand_id required' });
    
    if (brand_id === 'all') {
      const rows = await queryWithRetry('SELECT id, name, brand_id FROM model ORDER BY name ASC');
      res.json(rows);
    } else {
      const rows = await queryWithRetry('SELECT id, name FROM model WHERE brand_id = ? ORDER BY name ASC', [brand_id]);
      res.json(rows);
    }
  } catch (err: any) {
    console.error('Error fetching models:', err);
    res.status(500).json({ message: 'Failed to fetch models.', error: err.message });
  }
});

export default router; 