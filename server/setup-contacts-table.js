const { pool } = require('./db');

async function setupContactsTable() {
  try {
    console.log('Checking if contacts table exists...');
    
    // Check if table exists
    const [tables] = await pool.query('SHOW TABLES LIKE "contacts"');
    
    if (tables.length === 0) {
      console.log('Contacts table does not exist. Creating it...');
      
      // Create the contacts table
      await pool.query(`
        CREATE TABLE contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          car_id INT NOT NULL,
          phone VARCHAR(20),
          businessType VARCHAR(255),
          socialNetwork VARCHAR(500),
          email VARCHAR(255),
          address TEXT,
          website VARCHAR(500),
          language VARCHAR(500),
          country VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
          INDEX idx_car_id (car_id)
        )
      `);
      
      console.log('Contacts table created successfully!');
    } else {
      console.log('Contacts table already exists.');
    }
    
    // Show table structure
    const [columns] = await pool.query('DESCRIBE contacts');
    console.log('Contacts table structure:');
    console.table(columns);
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up contacts table:', error);
    process.exit(1);
  }
}

setupContactsTable();
