import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { createCar, getCarById, getAllCars, updateCar, deleteCar, getCarsByUserId } from '../models/car';
import { pool } from '../db';
import { DriveType } from '@shared/drive-types';

// Helper function to safely convert to number
const safeParseInt = (value: any): number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? 0 : parsed;
};

const safeParseFloat = (value: any): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Car-related types
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
  brand_name?: string;
  model_name?: string;
  year_value?: number;
  drive_type_name?: string;
  drive_type_ee_name?: string;
  salonColor?: string;
  bodyType?: string;
  stereo?: string;
  carColor?: string;
  carColorType?: string;
  vehicleType?: string;
  inspectionValidityPeriod?: string;
}

export interface CarFilters {
  brand_id?: number;
  model_id?: number;
  model_name?: string;
  trim_level?: string;
  drive_type_id?: number[];
  seats?: number;
  doors?: number;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  power_min?: number;
  power_max?: number;
  engine_min?: number;
  engine_max?: number;
  fuel_city_min?: number;
  fuel_city_max?: number;
  fuel_highway_min?: number;
  fuel_highway_max?: number;
  fuel_average_min?: number;
  fuel_average_max?: number;
  co2_min?: number;
  co2_max?: number;
  fuel_type?: string[];
  transmission?: string[];
  color?: string;
  carColor?: string;
  country?: string;
  registered_country?: string;
  imported_from?: string;
  seller_type?: string;
  with_vat?: boolean;
  service_book?: boolean;
  inspection?: boolean;
  accident_free?: boolean;
  metallic_paint?: boolean;
  exchange_possible?: boolean;
  with_warranty?: boolean;
  equipment?: string[];
}

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token puudub.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Kehtetu token.' });
    }
    console.log('User:', user);
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ message: 'Ainult adminil on lubatud.' });
  }
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(process.cwd(), 'public/img/cars');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const id = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${id}${ext}`);
  }
});
const upload = multer({ storage });

// Create car (authenticated users can create cars)
router.post('/', authenticateToken, upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 },
  { name: 'image_5', maxCount: 1 },
  { name: 'image_6', maxCount: 1 },
  { name: 'image_7', maxCount: 1 },
  { name: 'image_8', maxCount: 1 },
]), async (req: any, res) => {
  try {
    let data = req.body;
    const reqWithFiles = req as typeof req & { files?: any };
    for (let i = 1; i <= 8; i++) {
      if (reqWithFiles.files && reqWithFiles.files[`image_${i}`]) {
        data[`image_${i}`] = `/img/cars/${reqWithFiles.files[`image_${i}`][0].filename}`;
      }
    }
    
    // Validate required fields
    if (!data.brand_id || data.brand_id === '') {
      return res.status(400).json({ message: 'Brand is required.' });
    }
    if (!data.model_id || data.model_id === '') {
      return res.status(400).json({ message: 'Model is required.' });
    }
    if (!data.year_id || data.year_id === '') {
      return res.status(400).json({ message: 'Year is required.' });
    }
    if (!data.drive_type_id || data.drive_type_id === '') {
      return res.status(400).json({ message: 'Drive type is required.' });
    }
    
    // Convert string IDs to numbers with safe parsing
    data.brand_id = safeParseInt(data.brand_id);
    data.model_id = safeParseInt(data.model_id);
    data.year_id = safeParseInt(data.year_id);
    data.drive_type_id = safeParseInt(data.drive_type_id);
    
    // Convert numeric fields with safe parsing
    data.mileage = data.mileage ? safeParseInt(data.mileage) : 0;
    data.price = data.price ? safeParseFloat(data.price) : 0;
    data.discountPrice = data.discountPrice ? safeParseFloat(data.discountPrice) : 0;
    
    // Convert empty strings to null for optional fields
    const optionalFields = ['plateNumber', 'month', 'power', 'displacement', 'technicalData', 'ownerCount', 'modelDetail', 'warranty', 'vatRefundable', 'vatRate', 'accident', 'vinCode', 'description', 'equipment', 'additionalInfo', 'phone', 'businessType', 'socialNetwork', 'email'];
    optionalFields.forEach(field => {
      if (data[field] === '') {
        data[field] = null;
      }
    });
    
    // Set cars to be approved by default (no admin approval needed)
    data.approved = true;
    // Set the user_id from the authenticated user
    data.user_id = req.user.id;
    
    // Calculate VAT if applicable
    if (data.vatRefundable === 'yes' && data.price && data.vatRate) {
      const basePrice = parseFloat(data.price);
      const vatRate = parseFloat(data.vatRate);
      if (!isNaN(basePrice) && !isNaN(vatRate)) {
        data.price = (basePrice + (basePrice * vatRate / 100)).toString();
      }
    }
    
    // Join tech_check and accessories arrays to comma-separated strings if present
    if (Array.isArray(data.tech_check)) data.tech_check = data.tech_check.join(',');
    if (Array.isArray(data.accessories)) data.accessories = data.accessories.join(',');
    
    const car = await createCar(data);
    res.status(201).json(car);
  } catch (err: any) {
    console.error('Car creation error:', err);
    res.status(400).json({ message: 'Car creation failed.', error: err.message });
  }
});

// Get all cars (admin only)
router.get('/', authenticateToken, async (_req, res) => {
  const cars = await getAllCars();
  res.json(cars);
});

// Get cars by user ID (authenticated user can only see their own cars)
router.get('/user/:userId', authenticateToken, async (req: any, res) => {
  try {
    const userId = Number(req.params.userId);

    console.log('userID:', userId);
    
    // Check if the authenticated user is requesting their own cars or is an admin
    if (req.user.id !== userId && !req.user.admin) {
      return res.status(403).json({ message: 'Access denied. You can only view your own cars.' });
    }
    
    const cars = await getCarsByUserId(userId);
    res.json(cars);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch user cars.', error: err.message });
  }
});

// Simple test endpoint
router.get('/public/ping', async (_req, res) => {
  res.json({ message: 'Car API is working!' });
});

// Test endpoint to check database connection and car count
router.get('/public/test', async (_req, res) => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [connectionTest]: any = await pool.query('SELECT 1 as test');
    console.log('Connection test:', connectionTest);
    
    // Test if cars table exists
    const [tableTest]: any = await pool.query('SHOW TABLES LIKE "cars"');
    console.log('Cars table exists:', tableTest.length > 0);
    
    // Test if brand table exists
    const [brandTableTest]: any = await pool.query('SHOW TABLES LIKE "brand"');
    console.log('Brand table exists:', brandTableTest.length > 0);
    
    // Test if model table exists
    const [modelTableTest]: any = await pool.query('SHOW TABLES LIKE "model"');
    console.log('Model table exists:', modelTableTest.length > 0);
    
    // Test if year table exists
    const [yearTableTest]: any = await pool.query('SHOW TABLES LIKE "year"');
    console.log('Year table exists:', yearTableTest.length > 0);
    
    // Test cars table structure
    const [carsStructure]: any = await pool.query('DESCRIBE cars');
    console.log('Cars table structure:', carsStructure);
    
    // Test getting cars
    const cars = await getAllCars();
    console.log('Total cars in database:', cars.length);
    
    res.json({ 
      message: 'Database connection successful',
      connectionTest: connectionTest[0],
      tablesExist: {
        cars: tableTest.length > 0,
        brand: brandTableTest.length > 0,
        model: modelTableTest.length > 0,
        year: yearTableTest.length > 0
      },
      carsStructure: carsStructure,
      totalCars: cars.length,
      approvedCars: cars.filter(car => car.approved === true).length,
      sampleCar: cars[0] || null
    });
  } catch (err: any) {
    console.error('Database test failed:', err);
    res.status(500).json({ message: 'Database test failed', error: err.message });
  }
});

// Get all approved cars (public - no authentication required)
router.get('/public/approved', async (_req, res) => {
  try {
    console.log('Fetching all approved cars...');
    
    // First, let's check if the approved column exists
    const [columns]: any = await pool.query('SHOW COLUMNS FROM cars LIKE "approved"');
    console.log('Approved column exists:', columns.length > 0);
    
    // Check if there are any cars at all
    const [allCars]: any = await pool.query('SELECT COUNT(*) as count FROM cars');
    console.log('Total cars in table:', allCars[0].count);
    
    // Check if there are any approved cars
    const [approvedCount]: any = await pool.query('SELECT COUNT(*) as count FROM cars WHERE approved = true');
    console.log('Approved cars count:', approvedCount[0].count);
    
    const [rows]: any = await pool.query(`
      SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
      FROM cars
      LEFT JOIN brand ON cars.brand_id = brand.id
      LEFT JOIN model ON cars.model_id = model.id
      LEFT JOIN year ON cars.year_id = year.id
      LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
      WHERE cars.approved = true
      ORDER BY cars.created_at DESC
    `);
    console.log('Approved cars found:', rows.length);
    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching approved cars:', err);
    res.status(500).json({ message: 'Failed to fetch approved cars.', error: err.message });
  }
});

// Get filtered cars (public - no authentication required)
router.get('/public/filtered', async (req, res) => {
  try {
    const {
      brand_id,
      model_id,
      model_name,
      trim_level,
      drive_type_id,
      seats,
      doors,
      price_min,
      price_max,
      year_min,
      year_max,
      mileage_min,
      mileage_max,
      power_min,
      power_max,
      engine_min,
      engine_max,
      fuel_city_min,
      fuel_city_max,
      fuel_highway_min,
      fuel_highway_max,
      fuel_average_min,
      fuel_average_max,
      co2_min,
      co2_max,
      fuel_type,
      transmission,
      color,
      carColor,
      country,
      registered_country,
      imported_from,
      seller_type,
      with_vat,
      service_book,
      inspection,
      accident_free,
      metallic_paint,
      exchange_possible,
      with_warranty,
      equipment,
      power_kw_min,
      power_kw_max
    } = req.query;

    let query = `
      SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
      FROM cars
      LEFT JOIN brand ON cars.brand_id = brand.id
      LEFT JOIN model ON cars.model_id = model.id
      LEFT JOIN year ON cars.year_id = year.id
      LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
      WHERE cars.approved = true
    `;
    
    const params: any[] = [];

    // Add filter conditions
    if (brand_id) {
      query += ' AND cars.brand_id = ?';
      params.push(brand_id);
    }

    if (model_id) {
      query += ' AND cars.model_id = ?';
      params.push(model_id);
    }

    if (model_name) {
      query += ' AND model.name LIKE ?';
      params.push(`%${model_name}%`);
    }

    if (trim_level) {
      query += ' AND cars.modelDetail LIKE ?';
      params.push(`%${trim_level}%`);
    }

    if (drive_type_id) {
      const driveTypeIds = Array.isArray(drive_type_id) ? drive_type_id : [drive_type_id];
      query += ` AND cars.drive_type_id IN (${driveTypeIds.map(() => '?').join(',')})`;
      params.push(...driveTypeIds);
    }

    if (seats) {
      query += ' AND cars.seats = ?';
      params.push(seats);
    }

    if (doors) {
      query += ' AND cars.doors = ?';
      params.push(doors);
    }

    if (price_min) {
      query += ' AND cars.price >= ?';
      params.push(price_min);
    }

    if (price_max) {
      query += ' AND cars.price <= ?';
      params.push(price_max);
    }

    if (year_min) {
      query += ' AND year.value >= ?';
      params.push(year_min);
    }

    if (year_max) {
      query += ' AND year.value <= ?';
      params.push(year_max);
    }

    if (mileage_min) {
      query += ' AND cars.mileage >= ?';
      params.push(mileage_min);
    }

    if (mileage_max) {
      query += ' AND cars.mileage <= ?';
      params.push(mileage_max);
    }

    if (power_min || power_kw_min) {
      query += ' AND CAST(REPLACE(cars.power, " kW", "") AS UNSIGNED) >= ?';
      params.push(power_min || power_kw_min);
    }

    if (power_max || power_kw_max) {
      query += ' AND CAST(REPLACE(cars.power, " kW", "") AS UNSIGNED) <= ?';
      params.push(power_max || power_kw_max);
    }

    if (engine_min) {
      query += ' AND CAST(REPLACE(cars.displacement, " cm³", "") AS UNSIGNED) >= ?';
      params.push(engine_min);
    }

    if (engine_max) {
      query += ' AND CAST(REPLACE(cars.displacement, " cm³", "") AS UNSIGNED) <= ?';
      params.push(engine_max);
    }

    if (fuel_city_min) {
      query += ' AND cars.fuelCityConsumption >= ?';
      params.push(fuel_city_min);
    }

    if (fuel_city_max) {
      query += ' AND cars.fuelCityConsumption <= ?';
      params.push(fuel_city_max);
    }

    if (fuel_highway_min) {
      query += ' AND cars.fuelHighwayConsumption >= ?';
      params.push(fuel_highway_min);
    }

    if (fuel_highway_max) {
      query += ' AND cars.fuelHighwayConsumption <= ?';
      params.push(fuel_highway_max);
    }

    if (fuel_average_min) {
      query += ' AND cars.fuelAverageConsumption >= ?';
      params.push(fuel_average_min);
    }

    if (fuel_average_max) {
      query += ' AND cars.fuelAverageConsumption <= ?';
      params.push(fuel_average_max);
    }

    if (co2_min) {
      query += ' AND cars.co2Emission >= ?';
      params.push(co2_min);
    }

    if (co2_max) {
      query += ' AND cars.co2Emission <= ?';
      params.push(co2_max);
    }

    if (fuel_type) {
      const fuelTypes = Array.isArray(fuel_type) ? fuel_type : [fuel_type];
      query += ` AND cars.fuelType IN (${fuelTypes.map(() => '?').join(',')})`;
      params.push(...fuelTypes);
    }

    if (transmission) {
      const transmissions = Array.isArray(transmission) ? transmission : [transmission];
      query += ` AND cars.transmission IN (${transmissions.map(() => '?').join(',')})`;
      params.push(...transmissions);
    }

    if (color) {
      query += ' AND cars.color LIKE ?';
      params.push(`%${color}%`);
    }

    if (carColor) {
      query += ' AND cars.carColor LIKE ?';
      params.push(`%${carColor}%`);
    }

    if (country) {
      query += ' AND cars.country = ?';
      params.push(country);
    }

    if (registered_country) {
      query += ' AND cars.registeredCountry = ?';
      params.push(registered_country);
    }

    if (imported_from) {
      query += ' AND cars.importedFrom = ?';
      params.push(imported_from);
    }

    if (seller_type) {
      query += ' AND cars.businessType = ?';
      params.push(seller_type);
    }

    if (with_vat === 'true') {
      query += ' AND cars.vatRefundable = "true"';
    }

    if (service_book === 'true') {
      query += ' AND cars.serviceBook = "true"';
    }

    if (inspection === 'true') {
      query += ' AND cars.inspection = "true"';
    }

    if (accident_free === 'true') {
      query += ' AND cars.accident = "false"';
    }

    if (metallic_paint === 'true') {
      query += ' AND cars.metallicPaint = "true"';
    }

    if (exchange_possible === 'true') {
      query += ' AND cars.exchangePossible = "true"';
    }

    if (with_warranty === 'true') {
      query += ' AND cars.warranty = "true"';
    }

    if (equipment) {
      const equipmentList = Array.isArray(equipment) ? equipment : [equipment];
      equipmentList.forEach(eq => {
        query += ' AND cars.equipment LIKE ?';
        params.push(`%${eq}%`);
      });
    }

    query += ' ORDER BY cars.created_at DESC';

    console.log('Filter query:', query);
    console.log('Filter params:', params);

    const [rows]: any = await pool.query(query, params);
    console.log('Filtered cars found:', rows.length);
    res.json(rows);
  } catch (err: any) {
    console.error('Filter error:', err);
    res.status(500).json({ message: 'Failed to fetch filtered cars.', error: err.message });
  }
});

// Get car by id (public - no authentication required, only approved cars)
router.get('/:id', async (req, res) => {
  try {
    const carId = Number(req.params.id);
    
    // Get car with approval check
    const [rows]: any = await pool.query(`
      SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
      FROM cars
      LEFT JOIN brand ON cars.brand_id = brand.id
      LEFT JOIN model ON cars.model_id = model.id
      LEFT JOIN year ON cars.year_id = year.id
      LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
      WHERE cars.id = ? AND cars.approved = true
    `, [carId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Car not found or not approved.' });
    }
    
    res.json(rows[0]);
  } catch (err: any) {
    console.error('Error fetching car:', err);
    res.status(500).json({ message: 'Failed to fetch car.', error: err.message });
  }
});

// Get car by id (admin only) - for admin panel
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  const car = await getCarById(Number(req.params.id));
  if (!car) return res.status(404).json({ message: 'Car not found.' });
  res.json(car);
});

// Get car by id for editing (user can fetch their own cars)
router.get('/edit/:id', authenticateToken, async (req: any, res) => {
  try {
    const carId = Number(req.params.id);
    const userId = req.user.id;
    
    // Get car with ownership check
    const [rows]: any = await pool.query(`
      SELECT cars.*, brand.name as brand_name, model.name as model_name, year.value as year_value, drive_type.name as drive_type_name, drive_type.ee_name as drive_type_ee_name
      FROM cars
      LEFT JOIN brand ON cars.brand_id = brand.id
      LEFT JOIN model ON cars.model_id = model.id
      LEFT JOIN year ON cars.year_id = year.id
      LEFT JOIN drive_type ON cars.drive_type_id = drive_type.id
      WHERE cars.id = ? AND cars.user_id = ?
    `, [carId, userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Car not found or access denied.' });
    }
    
    res.json(rows[0]);
  } catch (err: any) {
    console.error('Error fetching car for editing:', err);
    res.status(500).json({ message: 'Failed to fetch car.', error: err.message });
  }
});

// Update car (user can edit their own cars, admin can edit any car)
router.put('/:id', authenticateToken, upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 },
  { name: 'image_5', maxCount: 1 },
  { name: 'image_6', maxCount: 1 },
  { name: 'image_7', maxCount: 1 },
  { name: 'image_8', maxCount: 1 },
]), async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    // Get the car to check ownership
    const car = await getCarById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    // Check if user owns the car or is admin
    if (car.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own cars.' });
    }

    let data = req.body;
    const reqWithFiles = req as typeof req & { files?: any };
    for (let i = 1; i <= 8; i++) {
      if (reqWithFiles.files && reqWithFiles.files[`image_${i}`]) {
        data[`image_${i}`] = `/img/cars/${reqWithFiles.files[`image_${i}`][0].filename}`;
      }
    }
    
    // Validate required fields
    if (!data.brand_id || data.brand_id === '') {
      return res.status(400).json({ message: 'Brand is required.' });
    }
    if (!data.model_id || data.model_id === '') {
      return res.status(400).json({ message: 'Model is required.' });
    }
    if (!data.year_id || data.year_id === '') {
      return res.status(400).json({ message: 'Year is required.' });
    }
    if (!data.drive_type_id || data.drive_type_id === '') {
      return res.status(400).json({ message: 'Drive type is required.' });
    }
    
    // Convert string IDs to numbers with safe parsing
    data.brand_id = safeParseInt(data.brand_id);
    data.model_id = safeParseInt(data.model_id);
    data.year_id = safeParseInt(data.year_id);
    data.drive_type_id = safeParseInt(data.drive_type_id);
    
    // Convert numeric fields with safe parsing
    data.mileage = data.mileage ? safeParseInt(data.mileage) : 0;
    data.price = data.price ? safeParseFloat(data.price) : 0;
    data.discountPrice = data.discountPrice ? safeParseFloat(data.discountPrice) : 0;
    
    // Convert empty strings to null for optional fields
    const optionalFields = ['plateNumber', 'month', 'power', 'displacement', 'technicalData', 'ownerCount', 'modelDetail', 'warranty', 'vatRefundable', 'vatRate', 'accident', 'vinCode', 'description', 'equipment', 'additionalInfo', 'phone', 'businessType', 'socialNetwork', 'email'];
    optionalFields.forEach(field => {
      if (data[field] === '') {
        data[field] = null;
      }
    });
    
    // Calculate VAT if applicable
    if (data.vatRefundable === 'yes' && data.price && data.vatRate) {
      const basePrice = parseFloat(data.price);
      const vatRate = parseFloat(data.vatRate);
      if (!isNaN(basePrice) && !isNaN(vatRate)) {
        data.price = (basePrice + (basePrice * vatRate / 100)).toString();
      }
    }
    
    // Join tech_check and accessories arrays to comma-separated strings if present
    if (Array.isArray(data.tech_check)) data.tech_check = data.tech_check.join(',');
    if (Array.isArray(data.accessories)) data.accessories = data.accessories.join(',');
    
    const ok = await updateCar(id, data);
    if (!ok) return res.status(404).json({ message: 'Car update failed.' });
    res.json(await getCarById(id));
  } catch (err: any) {
    console.error('Update car error:', err);
    res.status(500).json({ message: 'Car update failed.', error: err.message });
  }
});

// Approve car (admin only)
router.patch('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const ok = await updateCar(id, { approved: true });
  if (!ok) return res.status(404).json({ message: 'Car approve failed.' });
  res.json(await getCarById(id));
});

// Reject car (admin only)
router.patch('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const ok = await updateCar(id, { approved: false });
  if (!ok) return res.status(404).json({ message: 'Car reject failed.' });
  res.json(await getCarById(id));
});

// Delete car (user can delete their own cars, admin can delete any car)
router.delete('/:id', authenticateToken, async (req: any, res) => {
  console.log('Delete Car');
  try {
    const carId = Number(req.params.id);
    const userId = req.user.id;

    // Get the car to check ownership
    const car = await getCarById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    // Check if user owns the car or is admin
    if (car.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own cars.' });
    }

    const ok = await deleteCar(carId);
    if (!ok) return res.status(404).json({ message: 'Car deletion failed.' });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete car error:', err);
    res.status(500).json({ message: 'Car deletion failed.', error: err.message });
  }
});

export default router; 