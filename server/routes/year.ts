import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT id, value FROM year ORDER BY value DESC');
    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching years:', err);
    res.status(500).json({ message: 'Failed to fetch years.', error: err.message });
  }
});

export default router; 