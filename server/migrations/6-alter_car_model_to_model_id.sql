ALTER TABLE cars
  ADD COLUMN model_id INT,
  ADD CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES model(id);

UPDATE cars SET model_id = (SELECT id FROM model WHERE model.name = cars.model AND model.brand_id = cars.brand_id) WHERE model IS NOT NULL;

ALTER TABLE cars DROP COLUMN model; 