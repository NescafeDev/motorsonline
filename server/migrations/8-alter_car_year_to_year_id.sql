ALTER TABLE cars
  ADD COLUMN year_id INT,
  ADD CONSTRAINT fk_year FOREIGN KEY (year_id) REFERENCES year(id);

UPDATE cars SET year_id = (SELECT id FROM year WHERE year.value = cars.year) WHERE year IS NOT NULL;

ALTER TABLE cars DROP COLUMN year; 