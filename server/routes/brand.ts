import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows]: any = await pool.query('SELECT id, name FROM brand ORDER BY name ASC');
  res.json(rows);
});

export default router; 