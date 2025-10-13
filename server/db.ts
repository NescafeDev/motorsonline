import mysql from 'mysql2/promise';

// Use environment variables for database configuration
// Falls back to freesqldatabase.com for production or localhost for development
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12801757',
  password: process.env.DB_PASSWORD || '3IfLc2uf4B',
  database: process.env.DB_NAME || 'sql12801757',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}); 