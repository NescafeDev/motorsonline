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
  images?: string[];
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
  salonColor?: string;
  bodyType?: string;
  stereo?: string;
  valuveljed?: string;
  carColor?: string;
  carColorType?: string;
  vehicleType?: string;
  inspectionValidityPeriod?: string;
  major?: string;
  lastMaintenance?: string;
  lastInspection?: string;
}

export async function createCar(car: Omit<Car, 'id'>): Promise<Car> {
  // Serialize images array to JSON string
  const imagesJson = car.images ? JSON.stringify(car.images) : null;
  
  const [result]: any = await pool.query(
    `INSERT INTO cars (
      user_id, brand_id, model_id, year_id, drive_type_id, category, transmission, fuelType, plateNumber, month, mileage, power, displacement, technicalData, ownerCount, modelDetail, price, discountPrice, warranty, vatRefundable, vatRate, accident, vinCode, description, equipment, additionalInfo, images, tech_check, accessories, salonColor, bodyType, stereo, carColor, carColorType, vehicleType, inspectionValidityPeriod, seats, doors, valuveljed, major, lastMaintenance, lastInspection, serviceBook 
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [car.user_id, car.brand_id, car.model_id, car.year_id, car.drive_type_id, car.category, car.transmission, car.fuelType, car.plateNumber, car.month, car.mileage, car.power, car.displacement, car.technicalData, car.ownerCount, car.modelDetail, car.price, car.discountPrice, car.warranty, car.vatRefundable, car.vatRate, car.accident, car.vinCode, car.description, car.equipment, car.additionalInfo, imagesJson, car.tech_check, car.accessories, car.salonColor, car.bodyType, car.stereo, car.carColor, car.carColorType, car.vehicleType, car.inspectionValidityPeriod, car.seats, car.doors, car.valuveljed, car.major, car.lastMaintenance, car.lastInspection, car.serviceBook]
  );
  return { id: result.insertId, ...car };
}

export async function getCarById(id: number): Promise<any | null> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name,
           contacts.phone, contacts.businessType, contacts.socialNetwork, contacts.email, contacts.address, contacts.website, contacts.language, contacts.country
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    LEFT JOIN contacts ON cars.user_id = contacts.user_id
    WHERE cars.id = ?
  `, [id]);
  if (rows.length === 0) return null;
  
  const car = rows[0];
  // Parse images JSON and filter out empty strings
  if (car.images) {
    try {
      car.images = JSON.parse(car.images).filter((img: string) => img && img.trim() !== '');
    } catch (e) {
      car.images = [];
    }
  } else {
    car.images = [];
  }
  
  return car;
}

export async function getAllCars(): Promise<any[]> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name,
           contacts.phone, contacts.businessType, contacts.socialNetwork, contacts.email, contacts.address, contacts.website, contacts.language, contacts.country
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    LEFT JOIN contacts ON cars.user_id = contacts.user_id
    ORDER BY cars.created_at DESC
  `);
  
  // Parse images JSON for each car
  return rows.map((car: any) => {
    if (car.images) {
      try {
        car.images = JSON.parse(car.images).filter((img: string) => img && img.trim() !== '');
      } catch (e) {
        car.images = [];
      }
    } else {
      car.images = [];
    }
    return car;
  });
}

export async function getCarsByUserId(userId: number): Promise<any[]> {
  const [rows]: any = await pool.query(`
    SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name,
           contacts.phone, contacts.businessType, contacts.socialNetwork, contacts.email, contacts.address, contacts.website, contacts.language, contacts.country
    FROM cars
    LEFT JOIN brand ON cars.brand_id = brand.id
    LEFT JOIN model ON cars.model_id = model.id
    LEFT JOIN year ON cars.year_id = year.id
    LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
    LEFT JOIN contacts ON cars.user_id = contacts.user_id
    WHERE cars.user_id = ?
    ORDER BY cars.created_at DESC
  `, [userId]);
  
  // Parse images JSON for each car
  return rows.map((car: any) => {
    if (car.images) {
      try {
        car.images = JSON.parse(car.images).filter((img: string) => img && img.trim() !== '');
      } catch (e) {
        car.images = [];
      }
    } else {
      car.images = [];
    }
    return car;
  });
}

export async function updateCar(id: number, car: Partial<Omit<Car, 'id'>>): Promise<boolean> {
  // Filter out joined fields that don't exist in the cars table
  const fieldsToExclude = ['imageIndices', 'brand_name', 'model_name', 'year_value', 'drive_type_name', 'drive_type_ee_name', 'favoriteCount', 'stereo_input'];
  
  const filteredCar = Object.keys(car)
    .filter(key => !fieldsToExclude.includes(key))
    .reduce((obj, key) => {
      const value = car[key];
      // Handle images array serialization
      if (key === 'images' && Array.isArray(value)) {
        obj[key] = JSON.stringify(value);
      }
      // Handle NaN values and convert them to null or 0
      else if (value === 'NaN' || (typeof value === 'number' && isNaN(value))) {
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