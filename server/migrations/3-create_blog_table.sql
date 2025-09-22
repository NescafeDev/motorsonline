CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_image VARCHAR(255),
  author VARCHAR(100) NOT NULL,
  published DATETIME NOT NULL,
  introduction TEXT,
  intro_image VARCHAR(255),
  summary TEXT,
  intro_detail TEXT, -- Added for blog intro details
  updated_at TIMESTAMP NULL DEFAULT NULL
);