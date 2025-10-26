const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
    user: process.env.DB_USER || 'sql12803920',
    password: process.env.DB_PASSWORD || 'dirWfenXsV',
    database: process.env.DB_NAME || 'sql12803920',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrations', '23-modify-privacy-terms-table.sql'), 'utf8');
    await connection.execute(migrationSQL);
    console.log('Migration 23-modify-privacy-terms-table.sql executed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
