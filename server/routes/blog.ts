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

// Helper function to translate content in parts using regex splitting
// async function translateBlogContentInParts(content: string, targetLanguage: string = 'ru'): Promise<string> {
//   try {
//     // Split by HTML tags
//     const tagRegex = /(<\/?[^>]+>)/g;
//     const parts = content.split(tagRegex).filter(part => part);

//     const translatedParts = [];
    
//     for (const part of parts) {
//       // Skip HTML tags
//       if (part.startsWith('<') && part.endsWith('>')) {
//         translatedParts.push(part);
//         continue;
//       }
      
//       // For text, split into sentences (handles bullet points and short sentences)
//       if (part.trim()) {
//         // Sentence splitter for Estonian (handles .!?, bullet points, and whitespace)
//         const sentences = part.split(/(?<=[.!?])\s+|(?<=•)\s+/).filter(s => s.trim());
        
//         const translatedSentences = [];
//         for (const sentence of sentences) {
//           try {
//             let translation;
//             let attempts = 0;
//             const maxAttempts = 3;

//             // Retry translation for each sentence
//             while (attempts < maxAttempts) {
//               try {
//                 translation = await translationService.translateText({
//                   text: sentence,
//                   targetLanguage: targetLanguage,
//                   sourceLanguage: 'ee'
//                 });
                
//                 if (translation.translatedText && translation.translatedText !== sentence) {
//                   translatedSentences.push(translation.translatedText);
//                   break;
//                 }
//               } catch (error) {
//                 console.error(`Translation attempt ${attempts + 1} failed for sentence:`, sentence, error);
//               }
//               attempts++;
//               if (attempts === maxAttempts) {
//                 console.error(`Max attempts reached for sentence:`, sentence);
//                 translatedSentences.push(sentence); // Use original if all attempts fail
//               }
//             }
//           } catch (error) {
//             console.error('Error processing sentence:', sentence, error);
//             translatedSentences.push(sentence);
//           }
//         }
//         translatedParts.push(translatedSentences.join(' '));
//       } else {
//         translatedParts.push(part); // Preserve whitespace
//       }
//     }

//     return translatedParts.join('');
//   } catch (error) {
//     console.error('Error in translateBlogContentInParts:', error);
//     return content; // Return original content if translation fails
//   }
// }

async function translateBlogContentInParts(content: string, targetLanguage: string = 'ru'): Promise<string> {
  try {
    const tagRegex = /(<[^>]+>)/g;
    const parts = content.split(tagRegex).filter(Boolean);

    const translatedParts = [];

    for (const part of parts) {
      // Skip HTML tags entirely
      if (part.startsWith('<') && part.endsWith('>')) {
        translatedParts.push(part);
        continue;
      }

      const cleanPart = part.trim();

      // Skip non-translatable or empty text
      if (!cleanPart || isNonTranslatable(cleanPart)) {
        translatedParts.push(part);
        continue;
      }

      try {
        const translated = await translateWithRetries(cleanPart, targetLanguage);
        translatedParts.push(translated || part);
      } catch (err) {
        translatedParts.push(part);
      }
    }

    return translatedParts.join('');
  } catch (err) {
    console.error('translateHtmlByParts error:', err);
    return content;
  }
}

function isNonTranslatable(text: string): boolean {
  // Skip things like &nbsp;, single punctuation, or symbols
  return (
    text === '&nbsp;' ||
    text === '\n' ||
    /^[•\s]+$/.test(text) ||
    !text.replace(/&nbsp;/g, '').trim()
  );
}

async function translateWithRetries(
  text: string,
  targetLanguage: string,
  retries = 3
): Promise<string> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const res = await translationService.translateText({
        text,
        targetLanguage,
        sourceLanguage: 'ee',
      });

      if (res?.translatedText) return res.translatedText;
      throw new Error('No translation returned from DeepL API');
    } catch (err) {
      attempt++;
      if (attempt === retries) throw err;
      console.warn(`Retrying translation (attempt ${attempt})...`);
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  return text;
}

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
    
    // Translate introduction (using part-based translation for HTML content)
    if (blog.introduction) {
      translatedBlog.introduction = await translateBlogContentInParts(blog.introduction, targetLanguage);
    }
    
    // Translate intro_detail (using part-based translation for HTML content)
    if (blog.intro_detail) {
      translatedBlog.intro_detail = await translateBlogContentInParts(blog.intro_detail, targetLanguage);
    }
    
    // Translate summary (using part-based translation for HTML content)
    if (blog.summary) {
      translatedBlog.summary = await translateBlogContentInParts(blog.summary, targetLanguage);
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
    
    
    const blogs = await getAllBlogs();
    
    // Translate blogs if language is not Estonian
    if (targetLanguage !== 'ee' && translationService.isConfigured()) {
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
    
    
    const blog = await getBlogById(Number(req.params.id));
    if (!blog) return res.status(404).json({ message: 'Blogi ei leitud.' });
    
    // Translate blog if language is not Estonian
    if (targetLanguage !== 'ee' && translationService.isConfigured()) {
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