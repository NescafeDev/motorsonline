import express from 'express';
import jwt from 'jsonwebtoken';
import { addFavorite, removeFavorite, getUserFavorites, isFavorite, getFavoriteCount } from '../models/favorite';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT token
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

// Get favorite count for a specific car (public endpoint - no authentication required)
router.get('/count/:carId', async (req: express.Request, res: express.Response) => {
  try {
    const carId = parseInt(req.params.carId);

    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const count = await getFavoriteCount(carId);
    res.json({ carId, favoriteCount: count });
  } catch (error) {
    console.error('Error getting favorite count:', error);
    res.status(500).json({ error: 'Failed to get favorite count' });
  }
});

// Add a car to favorites
router.post('/add/:carId', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const carId = parseInt(req.params.carId);

    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const favorite = await addFavorite(userId, carId);
    res.status(201).json({ message: 'Car added to favorites', favorite });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Car is already in favorites' });
    }
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove a car from favorites
router.delete('/remove/:carId', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const carId = parseInt(req.params.carId);

    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const removed = await removeFavorite(userId, carId);
    if (removed) {
      res.json({ message: 'Car removed from favorites' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get user's favorite car IDs
router.get('/user', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const favoriteCarIds = await getUserFavorites(userId);
    res.json({ favoriteCarIds });
  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Check if a car is in user's favorites
router.get('/check/:carId', authenticateToken, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).user.id;
    const carId = parseInt(req.params.carId);

    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const isFav = await isFavorite(userId, carId);
    res.json({ isFavorite: isFav });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

export default router; 