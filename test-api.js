// Simple test script to verify API connection
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

async function testAPI() {
  console.log('Testing API connection...');
  
  try {
    // Test ping endpoint
    const pingResponse = await apiClient.get('/api/ping');
    console.log('✅ Ping test passed:', pingResponse.data);
    
    // Test cars endpoint
    const carsResponse = await apiClient.get('/api/cars/public/approved');
    console.log('✅ Cars test passed:', carsResponse.data.length, 'cars found');
    
    // Test filtered cars endpoint
    const filteredResponse = await apiClient.get('/api/cars/public/filtered');
    console.log('✅ Filtered cars test passed:', filteredResponse.data.length, 'cars found');
    
    // Test database connection
    const testResponse = await apiClient.get('/api/cars/public/test');
    console.log('✅ Database test passed:', testResponse.data);
    
    // Test brands endpoint
    const brandsResponse = await apiClient.get('/api/brands');
    console.log('✅ Brands test passed:', brandsResponse.data.length, 'brands found');
    
    // Test models endpoint (all models)
    const modelsResponse = await apiClient.get('/api/models?brand_id=all');
    console.log('✅ Models test passed:', modelsResponse.data.length, 'models found');
    
    // Test models endpoint (specific brand)
    if (brandsResponse.data.length > 0) {
      const firstBrandId = brandsResponse.data[0].id;
      const brandModelsResponse = await apiClient.get(`/api/models?brand_id=${firstBrandId}`);
      console.log('✅ Brand models test passed:', brandModelsResponse.data.length, 'models found for brand', firstBrandId);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ API connection failed: Server not running');
      console.log('Make sure the Vite dev server is running with: npm run dev');
    } else if (error.response) {
      console.log('❌ API test failed:', error.response.status, error.response.statusText);
    } else {
      console.log('❌ API connection failed:', error.message);
    }
  }
}

testAPI(); 