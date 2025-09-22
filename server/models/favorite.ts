import { pool } from '../db';

export interface Favorite {
  id: number;
  user_id: number;
  car_id: number;
  created_at: string;
}

export async function addFavorite(userId: number, carId: number): Promise<Favorite> {
  const [result]: any = await pool.query(
    'INSERT INTO favorites (user_id, car_id) VALUES (?, ?)',
    [userId, carId]
  );
  
  return {
    id: result.insertId,
    user_id: userId,
    car_id: carId,
    created_at: new Date().toISOString()
  };
}

export async function removeFavorite(userId: number, carId: number): Promise<boolean> {
  const [result]: any = await pool.query(
    'DELETE FROM favorites WHERE user_id = ? AND car_id = ?',
    [userId, carId]
  );
  
  return result.affectedRows > 0;
}

export async function getUserFavorites(userId: number): Promise<number[]> {
  const [rows]: any = await pool.query(
    'SELECT car_id FROM favorites WHERE user_id = ?',
    [userId]
  );
  
  return rows.map((row: any) => row.car_id);
}

export async function isFavorite(userId: number, carId: number): Promise<boolean> {
  const [rows]: any = await pool.query(
    'SELECT id FROM favorites WHERE user_id = ? AND car_id = ?',
    [userId, carId]
  );
  
  return rows.length > 0;
}

export async function getFavoriteCount(carId: number): Promise<number> {
  const [rows]: any = await pool.query(
    'SELECT COUNT(*) as count FROM favorites WHERE car_id = ?',
    [carId]
  );
  
  return rows[0].count;
} 