-- Manual SQL to add language and address columns to cars table
ALTER TABLE cars
  ADD COLUMN language VARCHAR(50),
  ADD COLUMN address TEXT;
