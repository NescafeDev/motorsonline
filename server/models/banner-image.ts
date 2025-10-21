import { pool } from '../db';

export interface BannerImage {
  id: number;
  desktop_image: string;
  mobile_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function createBannerImage(data: Omit<BannerImage, 'id' | 'created_at' | 'updated_at'>): Promise<BannerImage> {
  const { desktop_image, mobile_image, active } = data;
  const [result] = await pool.execute(
    'INSERT INTO banner_images (desktop_image, mobile_image, active) VALUES (?, ?, ?)',
    [desktop_image, mobile_image, active]
  );
  const insertId = (result as any).insertId;
  return getBannerImageById(insertId);
}

export async function getBannerImageById(id: number): Promise<BannerImage | null> {
  const [rows] = await pool.execute(
    'SELECT * FROM banner_images WHERE id = ?',
    [id]
  );
  const bannerImages = rows as BannerImage[];
  return bannerImages.length > 0 ? bannerImages[0] : null;
}

export async function getAllBannerImages(): Promise<BannerImage[]> {
  const [rows] = await pool.execute('SELECT * FROM banner_images ORDER BY created_at DESC');
  return rows as BannerImage[];
}

export async function updateBannerImage(id: number, data: Partial<Omit<BannerImage, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = Object.values(data).map(v => typeof v === 'boolean' ? v : String(v));
  values.push(String(id));
  
  const [result] = await pool.execute(
    `UPDATE banner_images SET ${fields} WHERE id = ?`,
    values
  );
  return (result as any).affectedRows > 0;
}

export async function deleteBannerImage(id: number): Promise<boolean> {
  const [result] = await pool.execute('DELETE FROM banner_images WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

export async function toggleBannerImageActive(id: number): Promise<boolean> {
  const [result] = await pool.execute(
    'UPDATE banner_images SET active = NOT active WHERE id = ?',
    [id]
  );
  return (result as any).affectedRows > 0;
}
