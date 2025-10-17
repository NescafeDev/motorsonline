-- Create privacy_terms table
CREATE TABLE IF NOT EXISTS privacy_terms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  privacy TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default empty record
INSERT INTO privacy_terms (privacy, terms) VALUES ('', '') ON DUPLICATE KEY UPDATE privacy = privacy;
