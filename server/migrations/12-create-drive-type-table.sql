-- Create drive_type table
CREATE TABLE drive_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  ee_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert drive types
INSERT INTO drive_type (name, ee_name) VALUES
('kabriolett', 'Kabriolett'),
('karavan', 'Karavan'),
('kaubik', 'Kaubik'),
('kupee', 'Kupee'),
('luukpara', 'Luukpära'),
('limusiin', 'Limusiin'),
('mitmeotstarbeline', 'Mitmeotstarbeline'),
('pikap', 'Pikap'),
('sedaan', 'Sedaan'),
('vaikekaubik', 'Väikekaubik'),
('universaal', 'Universaal'),
('mahtuniversaal', 'Mahtuniversaal');

-- Add drive_type_id column to cars table
ALTER TABLE cars ADD COLUMN drive_type_id INT;

-- Add foreign key constraint
ALTER TABLE cars ADD CONSTRAINT fk_drive_type FOREIGN KEY (drive_type_id) REFERENCES drive_type(id);

-- Update existing cars to use drive_type_id instead of driveType
UPDATE cars SET drive_type_id = (SELECT id FROM drive_type WHERE drive_type.name = cars.driveType) WHERE driveType IS NOT NULL;

-- Drop the old driveType column
ALTER TABLE cars DROP COLUMN driveType; 