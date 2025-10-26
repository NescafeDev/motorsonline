-- Add lang field to privacy_terms table
ALTER TABLE privacy_terms ADD COLUMN lang VARCHAR(5) DEFAULT 'ee';

-- Create unique index for privacy_terms with lang
ALTER TABLE privacy_terms ADD UNIQUE KEY unique_privacy_lang (id, lang);

-- Update existing record to have lang = 'ee'
UPDATE privacy_terms SET lang = 'ee' WHERE lang IS NULL;

-- Insert sample records for other languages (these will be populated by admin saves)
INSERT IGNORE INTO privacy_terms (privacy, terms, lang) VALUES 
('', '', 'en'),
('', '', 'fi'), 
('', '', 'de'),
('', '', 'ru');
