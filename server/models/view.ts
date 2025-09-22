import { pool } from '../db';

export async function incrementViewCount(carId: number): Promise<void> {
  const [result]: any = await pool.query(
    'UPDATE cars SET views = views + 1 WHERE id = ?',
    [carId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Car not found');
  }
}

export async function getViewCount(carId: number): Promise<number> {
  const [rows]: any = await pool.query(
    'SELECT views FROM cars WHERE id = ?',
    [carId]
  );
  
  if (rows.length === 0) {
    throw new Error('Car not found');
  }
  
  return rows[0].views;
}

export async function getViewCountsForCars(carIds: number[]): Promise<{ [key: number]: number }> {
  if (carIds.length === 0) {
    return {};
  }
  
  const placeholders = carIds.map(() => '?').join(',');
  const [rows]: any = await pool.query(
    `SELECT id, views FROM cars WHERE id IN (${placeholders})`,
    carIds
  );
  
  const viewCounts: { [key: number]: number } = {};
  rows.forEach((row: any) => {
    viewCounts[row.id] = row.views;
  });
  
  return viewCounts;
} 