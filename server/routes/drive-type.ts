import express from 'express';
import jwt from 'jsonwebtoken';
import { getAllDriveTypes, getDriveTypeById, createDriveType, updateDriveType, deleteDriveType } from '../models/drive-type';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token puudub.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Kehtetu token.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ message: 'Ainult adminil on lubatud.' });
  }
  next();
}

// Get all drive types (public)
router.get('/', async (_req, res) => {
  try {
    const driveTypes = await getAllDriveTypes();
    res.json(driveTypes);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch drive types.', error: err.message });
  }
});

// Get drive type by id (public)
router.get('/:id', async (req, res) => {
  try {
    const driveType = await getDriveTypeById(Number(req.params.id));
    if (!driveType) return res.status(404).json({ message: 'Drive type not found.' });
    res.json(driveType);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch drive type.', error: err.message });
  }
});

// Create drive type (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const driveType = await createDriveType(req.body);
    res.status(201).json(driveType);
  } catch (err: any) {
    res.status(400).json({ message: 'Drive type creation failed.', error: err.message });
  }
});

// Update drive type (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ok = await updateDriveType(id, req.body);
    if (!ok) return res.status(404).json({ message: 'Drive type update failed.' });
    res.json(await getDriveTypeById(id));
  } catch (err: any) {
    res.status(400).json({ message: 'Drive type update failed.', error: err.message });
  }
});

// Delete drive type (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ok = await deleteDriveType(Number(req.params.id));
    if (!ok) return res.status(404).json({ message: 'Drive type deletion failed.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: 'Drive type deletion failed.', error: err.message });
  }
});

export default router; 