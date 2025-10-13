import express from 'express';
import { queryWithRetry } from '../db';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await queryWithRetry('SELECT id, name FROM brand ORDER BY name ASC');
    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching brands:', err);
    res.status(500).json({ message: 'Failed to fetch brands.', error: err.message });
  }
});

export default router; 