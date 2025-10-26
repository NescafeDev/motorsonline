import { pool } from '../db';

export interface Blog {
  id: number;
  category: string;
  title: string;
  title_image: string;
  author: string;
  published: string; // ISO date string
  introduction: string;
  intro_image: string;
  summary: string;
  intro_detail?: string;
  updated_at?: string;
}

export interface BlogTranslation {
  id?: number;
  blogId: number;
  lang: string;
  title: string;
  introduction: string;
  intro_detail?: string;
  summary: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export async function createBlog(blog: Omit<Blog, 'id'>): Promise<Blog> {
  const [result]: any = await pool.query(
    `INSERT INTO blogs (category, title, title_image, author, published, introduction, intro_image, summary, intro_detail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [blog.category, blog.title, blog.title_image, blog.author, blog.published, blog.introduction, blog.intro_image, blog.summary, blog.intro_detail]
  );
  return { id: result.insertId, ...blog };
}

export async function getBlogById(id: number): Promise<Blog | null> {
  const [rows]: any = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  return rows[0];
}

export async function getAllBlogs(): Promise<Blog[]> {
  const [rows]: any = await pool.query('SELECT * FROM blogs ORDER BY published DESC');
  return rows;
}

export async function updateBlog(id: number, blog: Partial<Omit<Blog, 'id'>>): Promise<boolean> {
  const fields = Object.keys(blog).map(key => `${key} = ?`).join(', ');
  const values = Object.values(blog);
  if (!fields) return false;
  const [result]: any = await pool.query(
    `UPDATE blogs SET ${fields}, updated_at = NOW() WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows > 0;
}

export async function deleteBlog(id: number): Promise<boolean> {
  const [result]: any = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Blog Translation Functions
export async function createBlogTranslation(translation: Omit<BlogTranslation, 'id'>): Promise<BlogTranslation> {
  const [result]: any = await pool.query(
    `INSERT INTO blog_translations (blogId, lang, title, introduction, intro_detail, summary, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [translation.blogId, translation.lang, translation.title, translation.introduction, translation.intro_detail, translation.summary, translation.category]
  );
  return { id: result.insertId, ...translation };
}

export async function getBlogTranslation(blogId: number, lang: string): Promise<BlogTranslation | null> {
  const [rows]: any = await pool.query(
    'SELECT * FROM blog_translations WHERE blogId = ? AND lang = ?', 
    [blogId, lang]
  );
  if (rows.length === 0) return null;
  return rows[0];
}

export async function getAllBlogTranslations(blogId: number): Promise<BlogTranslation[]> {
  const [rows]: any = await pool.query(
    'SELECT * FROM blog_translations WHERE blogId = ? ORDER BY lang', 
    [blogId]
  );
  return rows;
}

export async function updateBlogTranslation(blogId: number, lang: string, translation: Partial<Omit<BlogTranslation, 'id' | 'blogId' | 'lang'>>): Promise<boolean> {
  const fields = Object.keys(translation).map(key => `${key} = ?`).join(', ');
  const values = Object.values(translation);
  if (!fields) return false;
  const [result]: any = await pool.query(
    `UPDATE blog_translations SET ${fields}, updated_at = NOW() WHERE blogId = ? AND lang = ?`,
    [...values, blogId, lang]
  );
  return result.affectedRows > 0;
}

export async function deleteBlogTranslation(blogId: number, lang: string): Promise<boolean> {
  const [result]: any = await pool.query(
    'DELETE FROM blog_translations WHERE blogId = ? AND lang = ?', 
    [blogId, lang]
  );
  return result.affectedRows > 0;
}

export async function deleteAllBlogTranslations(blogId: number): Promise<boolean> {
  const [result]: any = await pool.query(
    'DELETE FROM blog_translations WHERE blogId = ?', 
    [blogId]
  );
  return result.affectedRows > 0;
} 