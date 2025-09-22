ALTER TABLE cars
  ADD COLUMN brand_id INT,
  ADD CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brand(id);

UPDATE cars SET brand_id = (SELECT id FROM brand WHERE brand.name = cars.brand) WHERE brand IS NOT NULL;

ALTER TABLE cars DROP COLUMN brand; 