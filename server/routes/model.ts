import express from 'express';
import { pool } from '../db';

const router = express.Router();

// GET /api/models?brand_id=123 or GET /api/models?brand_id=all
router.get('/', async (req, res) => {
  const brand_id = req.query.brand_id;
  if (!brand_id) return res.status(400).json({ message: 'brand_id required' });
  
  if (brand_id === 'all') {
    const [rows]: any = await pool.query('SELECT id, name, brand_id FROM model ORDER BY name ASC');
    res.json(rows);
  } else {
    const [rows]: any = await pool.query('SELECT id, name FROM model WHERE brand_id = ? ORDER BY name ASC', [brand_id]);
    res.json(rows);
  }
});

export default router; 