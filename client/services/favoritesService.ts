import axios from 'axios';


export const favoritesService = {
  // Add a car to favorites
  addToFavorites: async (carId: number): Promise<void> => {
    await axios.post(`/api/favorites/add/${carId}`);
  },

  // Remove a car from favorites
  removeFromFavorites: async (carId: number): Promise<void> => {
    await axios.delete(`/api/favorites/remove/${carId}`);
  },

  // Get user's favorite car IDs
  getUserFavorites: async (): Promise<number[]> => {
    const response = await axios.get(`/api/favorites/user`);
    return response.data.favoriteCarIds;
  },

  // Check if a car is in user's favorites
  checkIsFavorite: async (carId: number): Promise<boolean> => {
    const response = await axios.get(`/api/favorites/check/${carId}`);
    return response.data.isFavorite;
  },

  // Get favorite count for a specific car (public - no authentication required)
  getFavoriteCount: async (carId: number): Promise<number> => {
    const response = await axios.get(`/api/favorites/count/${carId}`);
    return response.data.favoriteCount;
  },

  // Toggle favorite status
  toggleFavorite: async (carId: number, isCurrentlyFavorite: boolean): Promise<boolean> => {
    if (isCurrentlyFavorite) {
      await axios.delete(`/api/favorites/remove/${carId}`);
      return false;
    } else {
      await axios.post(`/api/favorites/add/${carId}`);
      return true;
    }
  }
}; 