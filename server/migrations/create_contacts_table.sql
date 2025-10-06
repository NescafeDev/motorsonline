-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
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
);

-- Migrate existing contact data from cars table to contacts table
INSERT INTO contacts (car_id, phone, businessType, socialNetwork, email, address, website, language, country)
SELECT 
  id as car_id,
  phone,
  businessType,
  socialNetwork,
  email,
  address,
  website,
  language,
  country
FROM cars 
WHERE phone IS NOT NULL 
   OR businessType IS NOT NULL 
   OR socialNetwork IS NOT NULL 
   OR email IS NOT NULL 
   OR address IS NOT NULL 
   OR website IS NOT NULL 
   OR language IS NOT NULL 
   OR country IS NOT NULL;

-- Remove contact columns from cars table (optional - you might want to keep them for backward compatibility)
-- ALTER TABLE cars DROP COLUMN phone;
-- ALTER TABLE cars DROP COLUMN businessType;
-- ALTER TABLE cars DROP COLUMN socialNetwork;
-- ALTER TABLE cars DROP COLUMN email;
-- ALTER TABLE cars DROP COLUMN address;
-- ALTER TABLE cars DROP COLUMN website;
-- ALTER TABLE cars DROP COLUMN language;
-- ALTER TABLE cars DROP COLUMN country;
