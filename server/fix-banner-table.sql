-- Fix banner_images table AUTO_INCREMENT issue
-- This will reset the AUTO_INCREMENT to start from 1

-- First, check if there are any records with id = 0
SELECT * FROM banner_images WHERE id = 0;

-- If there are records with id = 0, delete them
DELETE FROM banner_images WHERE id = 0;

-- Reset AUTO_INCREMENT to start from 1
ALTER TABLE banner_images AUTO_INCREMENT = 1;

-- Check the table status
SHOW TABLE STATUS LIKE 'banner_images';
