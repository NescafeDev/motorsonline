import { pool } from '../db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  admin: boolean;
}

export async function createUser(name: string, email: string, password: string, admin: boolean = false): Promise<User> {
  // Check if user already exists
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User with this email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result]: any = await pool.query(
    'INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, admin]
  );
  return {
    id: result.insertId,
    name,
    email,
    password: hashedPassword,
    created_at: new Date(),
    admin,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) return null;
  return rows[0];
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
} 