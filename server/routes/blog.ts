import express, { Request } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createBlog,
  getBlogById,
  getAllBlogs,
  updateBlog,
  deleteBlog
} from '../models/blog';
import { translationService } from '../services/translationService';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to translate blog content
async function translateBlogContent(blog: any, targetLanguage: string) {
  if (targetLanguage === 'ee' || !translationService.isConfigured()) {
    return blog;
  }

  try {
    const translatedBlog = { ...blog };
    
    // Translate title
    if (blog.title) {
      const titleTranslation = await translationService.translateText({
        text: blog.title,
        targetLanguage,
        sourceLanguage: 'ee'
      });
      translatedBlog.title = titleTranslation.translatedText;
    }
    
    // Translate introduction
    if (blog.introduction) {
      const introTranslation = await translationService.translateText({
        text: blog.introduction,
        targetLanguage,
        sourceLanguage: 'ee'
      });
      translatedBlog.introduction = introTranslation.translatedText;
    }
    
    // Translate intro_detail
    if (blog.intro_detail) {
      const detailTranslation = await translationService.translateText({
        text: blog.intro_detail,
        targetLanguage,
        sourceLanguage: 'ee'
      });
      translatedBlog.intro_detail = detailTranslation.translatedText;
    }
    
    // Translate summary
    if (blog.summary) {
      const summaryTranslation = await translationService.translateText({
        text: blog.summary,
        targetLanguage,
        sourceLanguage: 'ee'
      });
      translatedBlog.summary = summaryTranslation.translatedText;
    }
    
    // Translate category
    if (blog.category) {
      const categoryTranslation = await translationService.translateText({
        text: blog.category,
        targetLanguage,
        sourceLanguage: 'ee'
      });
      translatedBlog.category = categoryTranslation.translatedText;
    }
    
    return translatedBlog;
  } catch (error) {
    console.error('Blog translation error:', error);
    return blog; // Return original content if translation fails
  }
}

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
    let dest = path.join('/img/blogs');
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

// Create blog (admin only, with image upload)
router.post('/', authenticateToken, requireAdmin, upload.fields([
  { name: 'title_image', maxCount: 1 },
  { name: 'intro_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const reqWithFiles = req as Request & { files?: any };
    let data = reqWithFiles.body;
    if (reqWithFiles.files) {
      if (reqWithFiles.files['title_image']) {
        data.title_image = `/img/blogs/${reqWithFiles.files['title_image'][0].filename}`;
      }
      if (reqWithFiles.files['intro_image']) {
        data.intro_image = `/img/blogs/${reqWithFiles.files['intro_image'][0].filename}`;
      }
    }
    const blog = await createBlog(data);
    if (reqWithFiles.files) {
      const blogId = blog.id;
      const blogDir = path.join('/img/blogs', String(blogId));
      if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
      for (const field of ['title_image', 'intro_image']) {
        if (reqWithFiles.files[field]) {
          const file = reqWithFiles.files[field][0];
          const oldPath = file.path;
          const ext = path.extname(file.originalname);
          const newPath = path.join(blogDir, `${field}${ext}`);
          fs.renameSync(oldPath, newPath);
          data[field] = `/img/blogs/${blogId}/${field}${ext}`;
        }
      }
      await updateBlog(blogId, {
        title_image: data.title_image,
        intro_image: data.intro_image,
        intro_detail: data.intro_detail
      });
    }
    res.status(201).json(await getBlogById(blog.id));
  } catch (err) {
    res.status(400).json({ message: 'Blogi loomine ebaõnnestus.', error: err instanceof Error ? err.message : String(err) });
  }
});

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLanguage = (lang as string) || 'ee'; // Default to Estonian
    
    console.log('Blog API called with language:', targetLanguage);
    
    const blogs = await getAllBlogs();
    
    // Translate blogs if language is not Estonian
    if (targetLanguage !== 'ee' && translationService.isConfigured()) {
      console.log('Translating blogs to:', targetLanguage);
      const translatedBlogs = await Promise.all(
        blogs.map(blog => translateBlogContent(blog, targetLanguage))
      );
      res.json(translatedBlogs);
    } else {
      res.json(blogs);
    }
  } catch (err: any) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Failed to fetch blogs.', error: err.message });
  }
});

// Get blog by id (public)
router.get('/:id', async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLanguage = (lang as string) || 'ee'; // Default to Estonian
    
    console.log('Blog by ID API called with language:', targetLanguage);
    
    const blog = await getBlogById(Number(req.params.id));
    if (!blog) return res.status(404).json({ message: 'Blogi ei leitud.' });
    
    // Translate blog if language is not Estonian
    if (targetLanguage !== 'ee' && translationService.isConfigured()) {
      console.log('Translating blog to:', targetLanguage);
      const translatedBlog = await translateBlogContent(blog, targetLanguage);
      res.json(translatedBlog);
    } else {
      res.json(blog);
    }
  } catch (err: any) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: 'Failed to fetch blog.', error: err.message });
  }
});

// Update blog (admin only, with image upload)
router.put('/:id', authenticateToken, requireAdmin, upload.fields([
  { name: 'title_image', maxCount: 1 },
  { name: 'intro_image', maxCount: 1 }
]), async (req, res) => {
  const id = Number(req.params.id);
  const reqWithFiles = req as Request & { files?: any };
  let data = reqWithFiles.body;
  if (reqWithFiles.files) {
    for (const field of ['title_image', 'intro_image']) {
      if (reqWithFiles.files[field]) {
        const ext = path.extname(reqWithFiles.files[field][0].originalname);
        const blogDir = path.join('/img/blogs', String(id));
        if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
        const newPath = path.join(blogDir, `${field}${ext}`);
        fs.renameSync(reqWithFiles.files[field][0].path, newPath);
        data[field] = `/img/blogs/${id}/${field}${ext}`;
      }
    }
  }
  const ok = await updateBlog(id, data);
  if (!ok) return res.status(404).json({ message: 'Blogi uuendamine ebaõnnestus.' });
  res.json(await getBlogById(id));
});

// Delete blog (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const ok = await deleteBlog(Number(req.params.id));
  if (!ok) return res.status(404).json({ message: 'Blogi kustutamine ebaõnnestus.' });
  res.json({ success: true });
});

export default router; 