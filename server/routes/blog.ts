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
  deleteBlog,
  createBlogTranslation,
  getBlogTranslation,
  getAllBlogTranslations,
  updateBlogTranslation,
  deleteAllBlogTranslations
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

// Helper function to create translations for all supported languages
async function createBlogTranslations(blogId: number, blogData: any) {
  const supportedLanguages = ['en', 'fi', 'ru', 'de'];
  
  for (const lang of supportedLanguages) {
    try {
      console.log(`Creating translation for language: ${lang}`);
      
      // Translate the blog content
      const translatedBlog = await translateBlogContent(blogData, lang);
      
      // Create translation record
      await createBlogTranslation({
        blogId,
        lang,
        title: translatedBlog.title,
        introduction: translatedBlog.introduction,
        intro_detail: translatedBlog.intro_detail,
        summary: translatedBlog.summary,
        category: translatedBlog.category
      });
      
      console.log(`Translation created successfully for language: ${lang}`);
    } catch (error) {
      console.error(`Failed to create translation for language ${lang}:`, error);
      // Continue with other languages even if one fails
    }
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
    let dest = path.join('/img/blogs_1');
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
        data.title_image = `/img/blogs_1/${reqWithFiles.files['title_image'][0].filename}`;
      }
      if (reqWithFiles.files['intro_image']) {
        data.intro_image = `/img/blogs_1/${reqWithFiles.files['intro_image'][0].filename}`;
      }
    }
    
    // Create the main blog in Estonian (blogs_1 table)
    const blog = await createBlog(data);
    
    // Handle image file organization
    if (reqWithFiles.files) {
      const blogId = blog.id;
      const blogDir = path.join('/img/blogs_1', String(blogId));
      if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
      for (const field of ['title_image', 'intro_image']) {
        if (reqWithFiles.files[field]) {
          const file = reqWithFiles.files[field][0];
          const oldPath = file.path;
          const ext = path.extname(file.originalname);
          const newPath = path.join(blogDir, `${field}${ext}`);
          fs.renameSync(oldPath, newPath);
          data[field] = `/img/blogs_1/${blogId}/${field}${ext}`;
        }
      }
      await updateBlog(blogId, {
        title_image: data.title_image,
        intro_image: data.intro_image,
        intro_detail: data.intro_detail
      });
    }
    
    // Create translations for all supported languages
    console.log('Creating translations for blog ID:', blog.id);
    await createBlogTranslations(blog.id, data);
    
    res.status(201).json(await getBlogById(blog.id));
  } catch (err) {
    console.error('Blog creation error:', err);
    res.status(400).json({ message: 'Blogi loomine ebaõnnestus.', error: err instanceof Error ? err.message : String(err) });
  }
});

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const { lang } = req.query;
    const targetLanguage = (lang as string) || 'ee'; // Default to Estonian
    
    const blogs = await getAllBlogs();
    
    // If requesting Estonian, return original blogs
    if (targetLanguage === 'ee') {
      res.json(blogs);
      return;
    }
    
    // For other languages, get translations from database
    const translatedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        try {
          const translation = await getBlogTranslation(blog.id, targetLanguage);
          if (translation) {
            // Return blog with translated content but keep original metadata
            return {
              ...blog,
              title: translation.title,
              introduction: translation.introduction,
              intro_detail: translation.intro_detail,
              summary: translation.summary,
              category: translation.category
            };
          } else {
            // Fallback to real-time translation if no stored translation
            console.log(`No stored translation found for blog ${blog.id} in language ${targetLanguage}, using real-time translation`);
            return await translateBlogContent(blog, targetLanguage);
          }
        } catch (error) {
          console.error(`Error getting translation for blog ${blog.id}:`, error);
          return blog; // Return original if translation fails
        }
      })
    );
    
    res.json(translatedBlogs);
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
    
    // If requesting Estonian, return original blog
    if (targetLanguage === 'ee') {
      res.json(blog);
      return;
    }
    
    // For other languages, get translation from database
    try {
      const translation = await getBlogTranslation(blog.id, targetLanguage);
      if (translation) {
        // Return blog with translated content but keep original metadata
        const translatedBlog = {
          ...blog,
          title: translation.title,
          introduction: translation.introduction,
          intro_detail: translation.intro_detail,
          summary: translation.summary,
          category: translation.category
        };
        res.json(translatedBlog);
      } else {
        // Fallback to real-time translation if no stored translation
        console.log(`No stored translation found for blog ${blog.id} in language ${targetLanguage}, using real-time translation`);
        const translatedBlog = await translateBlogContent(blog, targetLanguage);
        res.json(translatedBlog);
      }
    } catch (error) {
      console.error(`Error getting translation for blog ${blog.id}:`, error);
      res.json(blog); // Return original if translation fails
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
  try {
    const id = Number(req.params.id);
    const reqWithFiles = req as Request & { files?: any };
    let data = reqWithFiles.body;
    
    if (reqWithFiles.files) {
      for (const field of ['title_image', 'intro_image']) {
        if (reqWithFiles.files[field]) {
          const ext = path.extname(reqWithFiles.files[field][0].originalname);
          const blogDir = path.join('/img/blogs_1', String(id));
          if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });
          const newPath = path.join(blogDir, `${field}${ext}`);
          fs.renameSync(reqWithFiles.files[field][0].path, newPath);
          data[field] = `/img/blogs_1/${id}/${field}${ext}`;
        }
      }
    }
    
    // Update the main blog in Estonian (blogs_1 table)
    const ok = await updateBlog(id, data);
    if (!ok) return res.status(404).json({ message: 'Blogi uuendamine ebaõnnestus.' });
    
    // Update translations for all supported languages
    console.log('Updating translations for blog ID:', id);
    const supportedLanguages = ['en', 'fi', 'ru', 'de'];
    
    for (const lang of supportedLanguages) {
      try {
        // Check if translation exists
        const existingTranslation = await getBlogTranslation(id, lang);
        
        if (existingTranslation) {
          // Update existing translation
          const translatedData = await translateBlogContent(data, lang);
          await updateBlogTranslation(id, lang, {
            title: translatedData.title,
            introduction: translatedData.introduction,
            intro_detail: translatedData.intro_detail,
            summary: translatedData.summary,
            category: translatedData.category
          });
          console.log(`Translation updated for language: ${lang}`);
        } else {
          // Create new translation
          const translatedData = await translateBlogContent(data, lang);
          await createBlogTranslation({
            blogId: id,
            lang,
            title: translatedData.title,
            introduction: translatedData.introduction,
            intro_detail: translatedData.intro_detail,
            summary: translatedData.summary,
            category: translatedData.category
          });
          console.log(`Translation created for language: ${lang}`);
        }
      } catch (error) {
        console.error(`Failed to update translation for language ${lang}:`, error);
        // Continue with other languages even if one fails
      }
    }
    
    res.json(await getBlogById(id));
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(400).json({ message: 'Blogi uuendamine ebaõnnestus.', error: err instanceof Error ? err.message : String(err) });
  }
});

// Delete blog (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Delete all translations first (due to foreign key constraint)
    await deleteAllBlogTranslations(id);
    
    // Delete the main blog
    const ok = await deleteBlog(id);
    if (!ok) return res.status(404).json({ message: 'Blogi kustutamine ebaõnnestus.' });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Blog deletion error:', err);
    res.status(500).json({ message: 'Blogi kustutamine ebaõnnestus.', error: err instanceof Error ? err.message : String(err) });
  }
});

export default router; 