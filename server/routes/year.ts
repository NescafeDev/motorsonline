import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows]: any = await pool.query('SELECT id, value FROM year ORDER BY value DESC');
  res.json(rows);
});

export default router; 