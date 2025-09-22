// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      signup: '/api/auth/signup',
      test: '/api/auth/test',
    },
    blog: {
      list: '/api/blogs',
      create: '/api/blogs',
      update: (id: string) => `/api/blogs/${id}`,
      delete: (id: string) => `/api/blogs/${id}`,
    },
    cars: {
      list: '/api/cars',
      create: '/api/cars',
      update: (id: string) => `/api/cars/${id}`,
      delete: (id: string) => `/api/cars/${id}`,
    },
  },
};

// Helper function to make API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}; 