import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const viewsService = {
  // Increment view count for a specific car (public - no authentication required)
  incrementView: async (carId: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/api/views/increment/${carId}`);
  },

  // Get view count for a specific car (public - no authentication required)
  getViewCount: async (carId: number): Promise<number> => {
    const response = await axios.get(`${API_BASE_URL}/api/views/count/${carId}`);
    return response.data.viewCount;
  },

  // Get view counts for multiple cars (public - no authentication required)
  getViewCounts: async (carIds: number[]): Promise<{ [key: number]: number }> => {
    const response = await axios.post(`${API_BASE_URL}/api/views/counts`, { carIds });
    return response.data.viewCounts;
  }
}; 