import express from 'express';
import { incrementViewCount, getViewCount, getViewCountsForCars } from '../models/view';

const router = express.Router();

// Increment view count for a car (public endpoint - no authentication required)
router.post('/increment/:carId', async (req: express.Request, res: express.Response) => {
  try {
    const carId = parseInt(req.params.carId);
    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }
    
    await incrementViewCount(carId);
    res.json({ message: 'View count incremented successfully' });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
});

// Get view count for a specific car (public endpoint - no authentication required)
router.get('/count/:carId', async (req: express.Request, res: express.Response) => {
  try {
    const carId = parseInt(req.params.carId);
    if (isNaN(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }
    
    const count = await getViewCount(carId);
    res.json({ carId, viewCount: count });
  } catch (error) {
    console.error('Error getting view count:', error);
    res.status(500).json({ error: 'Failed to get view count' });
  }
});

// Get view counts for multiple cars (public endpoint - no authentication required)
router.post('/counts', async (req: express.Request, res: express.Response) => {
  try {
    const { carIds } = req.body;
    
    if (!Array.isArray(carIds)) {
      return res.status(400).json({ error: 'carIds must be an array' });
    }
    
    const viewCounts = await getViewCountsForCars(carIds);
    res.json({ viewCounts });
  } catch (error) {
    console.error('Error getting view counts:', error);
    res.status(500).json({ error: 'Failed to get view counts' });
  }
});

export default router; 