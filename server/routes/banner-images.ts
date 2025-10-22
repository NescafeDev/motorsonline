import express, { Request } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createBannerImage,
  getBannerImageById,
  getAllBannerImages,
  updateBannerImage,
  deleteBannerImage,
  toggleBannerImageActive
} from '../models/banner-image';

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

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join('/img');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const field = file.fieldname;
    let id = req.params.id || Date.now();
    cb(null, `${field}_${id}${ext}`);
  }
});
const upload = multer({ storage });

// Create banner image (admin only, with image upload)
router.post('/', authenticateToken, requireAdmin, upload.fields([
  { name: 'desktop_image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const reqWithFiles = req as Request & { files?: any };
    let data = reqWithFiles.body;
    
    // Initialize with empty strings and proper boolean conversion
    data.desktop_image = '';
    data.mobile_image = '';
    data.active = data.active === 'true' || data.active === true;
    
    console.log('Received data:', data);
    console.log('Files:', reqWithFiles.files);
    
    // Handle file uploads first
    if (reqWithFiles.files) {
      const bannerId = Date.now(); // Use timestamp as temporary ID
      const bannerDir = path.join('/img', String(bannerId));
      if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });
      
      for (const field of ['desktop_image', 'mobile_image']) {
        if (reqWithFiles.files[field]) {
          const file = reqWithFiles.files[field][0];
          const ext = path.extname(file.originalname);
          const newPath = path.join(bannerDir, `${field}${ext}`);
          fs.renameSync(file.path, newPath);
          data[field] = `/img/${bannerId}/${field}${ext}`;
        }
      }
    }
    
    console.log('Final data before creation:', data);
    
    // Create banner image with final data
    const bannerImage = await createBannerImage(data);
    console.log('Created banner image:', bannerImage);
    
    res.status(201).json(await getBannerImageById(bannerImage.id));
  } catch (err) {
    console.error('Banner creation error:', err);
    res.status(400).json({ message: 'Banner image loomine ebaõnnestus.', error: err instanceof Error ? err.message : String(err) });
  }
});

// Get all banner images (public)
router.get('/', async (_req, res) => {
  try {
    const bannerImages = await getAllBannerImages();
    res.json(bannerImages);
  } catch (err: any) {
    console.error('Error fetching banner images:', err);
    res.status(500).json({ message: 'Failed to fetch banner images.', error: err.message });
  }
});

// Get banner image by id (public)
router.get('/:id', async (req, res) => {
  try {
    const bannerImage = await getBannerImageById(Number(req.params.id));
    if (!bannerImage) return res.status(404).json({ message: 'Banner image ei leitud.' });
    res.json(bannerImage);
  } catch (err: any) {
    console.error('Error fetching banner image:', err);
    res.status(500).json({ message: 'Failed to fetch banner image.', error: err.message });
  }
});

// Update banner image (admin only, with image upload)
router.put('/:id', authenticateToken, requireAdmin, upload.fields([
  { name: 'desktop_image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 }
]), async (req, res) => {
  const id = Number(req.params.id);
  const reqWithFiles = req as Request & { files?: any };
  let data = reqWithFiles.body;
  if (reqWithFiles.files) {
    for (const field of ['desktop_image', 'mobile_image']) {
      if (reqWithFiles.files[field]) {
        const ext = path.extname(reqWithFiles.files[field][0].originalname);
        const bannerDir = path.join('/img', String(id));
        if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });
        const newPath = path.join(bannerDir, `${field}${ext}`);
        fs.renameSync(reqWithFiles.files[field][0].path, newPath);
        data[field] = `/img/${id}/${field}${ext}`;
      }
    }
  }
  const ok = await updateBannerImage(id, data);
  if (!ok) return res.status(404).json({ message: 'Banner image uuendamine ebaõnnestus.' });
  res.json(await getBannerImageById(id));
});

// Toggle banner image active status (admin only)
router.patch('/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const ok = await toggleBannerImageActive(id);
  if (!ok) return res.status(404).json({ message: 'Banner image toggle ebaõnnestus.' });
  res.json(await getBannerImageById(id));
});

// Delete banner image (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const ok = await deleteBannerImage(Number(req.params.id));
  if (!ok) return res.status(404).json({ message: 'Banner image kustutamine ebaõnnestus.' });
  res.json({ success: true });
});

export default router;
