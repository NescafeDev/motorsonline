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