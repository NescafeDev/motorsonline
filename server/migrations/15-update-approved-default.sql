-- Update the default value of the approved column to true
-- This allows cars to go directly to live without admin approval
ALTER TABLE cars ALTER COLUMN approved SET DEFAULT TRUE;

-- Update all existing cars to be approved
UPDATE cars SET approved = TRUE WHERE approved = FALSE;
