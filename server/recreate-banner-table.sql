-- Recreate banner_images table to fix AUTO_INCREMENT issue
DROP TABLE IF EXISTS banner_images;

CREATE TABLE banner_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  desktop_image VARCHAR(500) NOT NULL,
  mobile_image VARCHAR(500) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on active status for filtering
CREATE INDEX idx_active ON banner_images(active);
