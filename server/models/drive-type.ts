import { pool } from '../db';

export interface DriveType {
  id: number;
  name: string;
  ee_name: string;
  created_at?: string;
}

export async function getAllDriveTypes(): Promise<DriveType[]> {
  const [rows]: any = await pool.query('SELECT * FROM drive_type ORDER BY name');
  return rows;
}

export async function getDriveTypeById(id: number): Promise<DriveType | null> {
  const [rows]: any = await pool.query('SELECT * FROM drive_type WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function createDriveType(driveType: Omit<DriveType, 'id'>): Promise<DriveType> {
  const [result]: any = await pool.query(
    'INSERT INTO drive_type (name, ee_name) VALUES (?, ?)',
    [driveType.name, driveType.ee_name]
  );
  return { id: result.insertId, ...driveType };
}

export async function updateDriveType(id: number, driveType: Partial<Omit<DriveType, 'id'>>): Promise<boolean> {
  const fields = Object.keys(driveType).map(key => `${key} = ?`).join(', ');
  const values = Object.values(driveType);
  if (!fields) return false;
  const [result]: any = await pool.query(
    `UPDATE drive_type SET ${fields} WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows > 0;
}

export async function deleteDriveType(id: number): Promise<boolean> {
  const [result]: any = await pool.query('DELETE FROM drive_type WHERE id = ?', [id]);
  return result.affectedRows > 0;
} 