import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '185.7.252.206',
    user: 'vhost133032s1',
    password: 'OqqdFUAmuq+',
    database: 'vhost133032s1',
    multipleStatements: true
  });

  try {
    // Run all migrations in order
    const migrationFiles = [
      '1-create_user_table.sql',
      '2-alter_user_table.sql',
      '3-create_blog_table.sql',
      '4-create_car_table.sql',
      '5-alter_car_brand_to_brand_id.sql',
      '6-alter_car_model_to_model_id.sql',
      '7-create_year_table.sql',
      '8-alter_car_year_to_year_id.sql',
      '9-add-approved-to-cars.sql',
      '10-add-tech-check-accessories-to-cars.sql',
      '11-add-missing-filter-columns.sql',
      '12-create-drive-type-table.sql',
      '13-create-favorites-table.sql',
      '14-add-views-to-cars.sql',
      '15-update-approved-default.sql',
      '16-add-language-address-to-cars.sql'
    ];

    for (const migrationFile of migrationFiles) {
      console.log(`Running migration ${migrationFile}...`);
      const migrationPath = path.join(__dirname, 'migrations', migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      await connection.execute(migrationSQL);
      console.log(`Migration ${migrationFile} completed successfully!`);
    }

    // Add sample brand, model, and year data
    console.log('Adding sample brand, model, and year data...');
    
    // Add brands
    await connection.execute('INSERT IGNORE INTO brand (id, name) VALUES (1, "BMW"), (2, "Mercedes"), (3, "Audi"), (4, "Volkswagen")');
    
    // Add models with brand_id
    await connection.execute('INSERT IGNORE INTO model (id, name, brand_id) VALUES (1, "X5", 1), (2, "X3", 1), (3, "3 Series", 1), (4, "C-Class", 2), (5, "E-Class", 2), (6, "A4", 3), (7, "A6", 3), (8, "Golf", 4), (9, "Passat", 4)');
    
    // Add years
    await connection.execute('INSERT IGNORE INTO year (id, value) VALUES (1, 2020), (2, 2019), (3, 2018), (4, 2017), (5, 2016), (6, 2015)');

    // Add some sample car data for testing
    console.log('Adding sample car data...');
    const sampleCars = [
      {
        brand_id: 1,
        model_id: 1, // X5
        year_id: 1,
        drive_type_id: 1, // kabriolett
        category: 'sedaan',
        transmission: 'automaat',
        fuelType: 'bensiin',
        plateNumber: 'ABC123',
        month: '01',
        mileage: 50000,
        power: '150 kW',
        displacement: '2000 cm³',
        technicalData: 'Sample technical data',
        ownerCount: '1',
        modelDetail: 'Premium',
        price: 25000,
        discountPrice: 24000,
        warranty: 'true',
        vatRefundable: 'true',
        vatRate: '20',
        accident: 'false',
        vinCode: 'VIN123456789',
        description: 'Beautiful car in excellent condition',
        equipment: 'Navigation, Leather seats, Sunroof',
        additionalInfo: 'Well maintained',
        country: 'Eesti',
        phone: '+372 12345678',
        businessType: 'era',
        socialNetwork: 'Facebook',
        email: 'seller@example.com',
        image_1: '/img/Rectangle 34624924.png',
        approved: true,
        seats: 5,
        doors: 4,
        color: 'valge',
        registeredCountry: 'Eesti',
        importedFrom: 'Saksamaa',
        serviceBook: 'true',
        inspection: 'true',
        metallicPaint: 'true',
        exchangePossible: 'false',
        fuelCityConsumption: 8.5,
        fuelHighwayConsumption: 6.2,
        fuelAverageConsumption: 7.1,
        co2Emission: 165
      },
      {
        brand_id: 2,
        model_id: 4, // C-Class
        year_id: 2,
        drive_type_id: 11, // universaal
        category: 'universaal',
        transmission: 'manuaal',
        fuelType: 'diisel',
        plateNumber: 'XYZ789',
        month: '06',
        mileage: 80000,
        power: '120 kW',
        displacement: '1800 cm³',
        technicalData: 'Sample technical data 2',
        ownerCount: '2',
        modelDetail: 'Comfort',
        price: 18000,
        discountPrice: 17500,
        warranty: 'false',
        vatRefundable: 'true',
        vatRate: '20',
        accident: 'false',
        vinCode: 'VIN987654321',
        description: 'Reliable family car',
        equipment: 'Climate control, Parking sensors',
        additionalInfo: 'Good condition',
        country: 'Eesti',
        phone: '+372 87654321',
        businessType: 'äri',
        socialNetwork: 'Instagram',
        email: 'dealer@example.com',
        image_1: '/img/Rectangle 34624924.png',
        approved: true,
        seats: 5,
        doors: 5,
        color: 'sinine',
        registeredCountry: 'Eesti',
        importedFrom: 'Holland',
        serviceBook: 'true',
        inspection: 'true',
        metallicPaint: 'false',
        exchangePossible: 'true',
        fuelCityConsumption: 6.8,
        fuelHighwayConsumption: 5.1,
        fuelAverageConsumption: 5.8,
        co2Emission: 145
      }
    ];

    for (const car of sampleCars) {
      await connection.execute(`
        INSERT INTO cars (
          brand_id, model_id, year_id, drive_type_id, category, transmission, fuelType, plateNumber, month, mileage, power, displacement, technicalData, ownerCount, modelDetail, price, discountPrice, warranty, vatRefundable, vatRate, accident, vinCode, description, equipment, additionalInfo, country, phone, businessType, socialNetwork, email, image_1, approved, seats, doors, color, registeredCountry, importedFrom, serviceBook, inspection, metallicPaint, exchangePossible, fuelCityConsumption, fuelHighwayConsumption, fuelAverageConsumption, co2Emission
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        car.brand_id, car.model_id, car.year_id, car.drive_type_id, car.category, car.transmission, car.fuelType, car.plateNumber, car.month, car.mileage, car.power, car.displacement, car.technicalData, car.ownerCount, car.modelDetail, car.price, car.discountPrice, car.warranty, car.vatRefundable, car.vatRate, car.accident, car.vinCode, car.description, car.equipment, car.additionalInfo, car.country, car.phone, car.businessType, car.socialNetwork, car.email, car.image_1, car.approved, car.seats, car.doors, car.color, car.registeredCountry, car.importedFrom, car.serviceBook, car.inspection, car.metallicPaint, car.exchangePossible, car.fuelCityConsumption, car.fuelHighwayConsumption, car.fuelAverageConsumption, car.co2Emission
      ]);
    }

    console.log('Sample car data added successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration(); 