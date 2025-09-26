import { pool } from '../db';

export interface Car {
  id: number;
  user_id?: number;
  brand_id: number;
  model_id: number;
  year_id: number;
  drive_type_id: number;
  approved: boolean;
  category: string;
  transmission: string;
  fuelType: string;
  plateNumber: string;
  month: string;
  mileage: number;
  power: string;
  displacement: string;
  technicalData: string;
  ownerCount: string;
  modelDetail: string;
  price: number;
  discountPrice: number;
  warranty: string;
  vatRefundable: string;
  vatRate: string;
  accident: string;
  vinCode: string;
  description: string;
  equipment: string;
  additionalInfo: string;
  country: string;
  phone: string;
  businessType: string;
  socialNetwork: string;
  email: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
  tech_check?: string;
  accessories?: string;
  seats?: number;
  doors?: number;
  color?: string;
  registeredCountry?: string;
  importedFrom?: string;
  serviceBook?: string;
  inspection?: string;
  metallicPaint?: string;
  exchangePossible?: string;
  fuelCityConsumption?: number;
  fuelHighwayConsumption?: number;
  fuelAverageConsumption?: number;
  co2Emission?: number;
  created_at?: string;
  updated_at?: string;
  language?: string;
  address?: string;
}

export async function createCar(car: Omit<Car, 'id'>): Promise<Car> {
  const [result]: any = await pool.query(
    `INSERT INTO cars (
      user_id, brand_id, model_id, year_id, drive_type_id, category, transmission, fuelType, plateNumber, month, mileage, power, displacement, technicalData, ownerCount, modelDetail, price, discountPrice, warranty, vatRefundable, vatRate, accident, vinCode, description, equipment, additionalInfo, country, phone, businessType, socialNetwork, email, image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, tech_check, accessories, language, address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [car.user_id, car.brand_id, car.model_id, car.year_id, car.drive_type_id, car.category, car.transmission, car.fuelType, car.plateNumber, car.month, car.mileage, car.power, car.displacement, car.technicalData, car.ownerCount, car.modelDetail, car.price, car.discountPrice, car.warranty, car.vatRefundable, car.vatRate, car.accident, car.vinCode, car.description, car.equipment, car.additionalInfo, car.country, car.phone, car.businessType, car.socialNetwork, car.email, car.image_1, car.image_2, car.image_3, car.image_4, car.image_5, car.image_6, car.image_7, car.image_8, car.tech_check, car.accessories, car.language, car.address]
  );
  return { id: result.insertId, ...car };
}

export async function getCarById(id: number): Promise<any | null> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    WHERE cars.id = ?
  `, [id]);
  if (rows.length === 0) return null;
  // Split tech_check and accessories into arrays if not nul
  return rows[0];
}

export async function getAllCars(): Promise<any[]> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    ORDER BY cars.created_at DESC
  `);
  // Split tech_check and accessories into arrays if not null
  return rows;
}

export async function getCarsByUserId(userId: number): Promise<any[]> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    WHERE cars.user_id = ?
    ORDER BY cars.created_at DESC
  `, [userId]);
  return rows;
}

export async function updateCar(id: number, car: Partial<Omit<Car, 'id'>>): Promise<boolean> {
  // Filter out joined fields that don't exist in the cars table
  const fieldsToExclude = ['brand_name', 'model_name', 'year_value', 'drive_type_name', 'drive_type_ee_name', 'favoriteCount'];
  
  const filteredCar = Object.keys(car)
    .filter(key => !fieldsToExclude.includes(key))
    .reduce((obj, key) => {
      const value = car[key];
      // Handle NaN values and convert them to null or 0
      if (value === 'NaN' || (typeof value === 'number' && isNaN(value))) {
        obj[key] = null;
      } else if (value == 'null' || value == '') {
        obj[key] = null;
      } else {
        obj[key] = value;
      }
      return obj;
    }, {} as any);
  
  const fields = Object.keys(filteredCar).map(key => `${key} = ?`).join(', ');
  const values = Object.values(filteredCar);
  if (!fields) return false;
  console.log('Update Car field:', fields);
  const [result]: any = await pool.query(
    `UPDATE cars SET ${fields}, updated_at = NOW() WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows > 0;
}

export async function deleteCar(id: number): Promise<boolean> {
  const [result]: any = await pool.query('DELETE FROM cars WHERE id = ?', [id]);
  return result.affectedRows > 0;
} 