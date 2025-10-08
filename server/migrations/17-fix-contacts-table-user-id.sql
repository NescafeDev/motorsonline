-- Fix contacts table to use user_id instead of car_id
-- First, add user_id column
ALTER TABLE contacts ADD COLUMN user_id INT;

-- Update existing records to use the user_id from the associated car
UPDATE contacts c 
JOIN cars car ON c.car_id = car.id 
SET c.user_id = car.user_id;

-- Make user_id NOT NULL after populating it
ALTER TABLE contacts MODIFY COLUMN user_id INT NOT NULL;

-- Add foreign key constraint for user_id
ALTER TABLE contacts ADD CONSTRAINT fk_contacts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add index for user_id
ALTER TABLE contacts ADD INDEX idx_user_id (user_id);

-- Remove the old car_id foreign key constraint and column
ALTER TABLE contacts DROP FOREIGN KEY contacts_ibfk_1;
ALTER TABLE contacts DROP INDEX idx_car_id;
ALTER TABLE contacts DROP COLUMN car_id;
