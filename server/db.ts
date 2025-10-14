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
  connectionLimit: 5, // Reduced for free database limits
  queueLimit: 0,
  maxIdle: 5, // Maximum idle connections
  idleTimeout: 60000, // Close idle connections after 60 seconds
  enableKeepAlive: true, // Keep connections alive
  keepAliveInitialDelay: 10000, // Start keep-alive after 10 seconds
  connectTimeout: 20000, // 20 second connection timeout
});

// Helper function to execute queries with retry logic
export async function queryWithRetry(sql: string, params?: any[], retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error: any) {
      console.error(`Query attempt ${attempt}/${retries} failed:`, error.message);
      
      // Retry on connection errors
      if (
        (error.code === 'ECONNRESET' || 
         error.code === 'PROTOCOL_CONNECTION_LOST' ||
         error.code === 'ETIMEDOUT' ||
         error.errno === -104) &&
        attempt < retries
      ) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      // Don't retry on other errors
      throw error;
    }
  }
} 