-- Migration: Convert separate image_1 to image_8 fields to a single images JSON array

-- Step 1: Add new images column as JSON
ALTER TABLE cars_1 ADD COLUMN images JSON NULL;

-- Step 2: Migrate existing image data to the new images array
UPDATE cars_1
SET images = JSON_ARRAY(
  IFNULL(image_1, ''),
  IFNULL(image_2, ''),
  IFNULL(image_3, ''),
  IFNULL(image_4, ''),
  IFNULL(image_5, ''),
  IFNULL(image_6, ''),
  IFNULL(image_7, ''),
  IFNULL(image_8, '')
)
WHERE image_1 IS NOT NULL 
   OR image_2 IS NOT NULL 
   OR image_3 IS NOT NULL 
   OR image_4 IS NOT NULL 
   OR image_5 IS NOT NULL 
   OR image_6 IS NOT NULL 
   OR image_7 IS NOT NULL 
   OR image_8 IS NOT NULL;

-- Step 3: Clean up empty strings from the arrays (MySQL doesn't have JSON_ARRAY_FILTER, so we'll handle this in application code)
-- The application will filter out empty strings when reading

-- Step 4: Drop old image columns
ALTER TABLE cars_1 DROP COLUMN image_1;
ALTER TABLE cars_1 DROP COLUMN image_2;
ALTER TABLE cars_1 DROP COLUMN image_3;
ALTER TABLE cars_1 DROP COLUMN image_4;
ALTER TABLE cars_1 DROP COLUMN image_5;
ALTER TABLE cars_1 DROP COLUMN image_6;
ALTER TABLE cars_1 DROP COLUMN image_7;
ALTER TABLE cars_1 DROP COLUMN image_8;

