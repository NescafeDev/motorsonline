import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favoritesService } from '../services/favoritesService';

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favoriteCarIds, setFavoriteCarIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's favorites on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavoriteCarIds([]);
    }
  }, [isAuthenticated]);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const favorites = await favoritesService.getUserFavorites();
      setFavoriteCarIds(favorites);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (carId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      // You could show a login prompt here
      return false;
    }

    try {
      const isCurrentlyFavorite = favoriteCarIds.includes(carId);
      const newFavoriteStatus = await favoritesService.toggleFavorite(carId, isCurrentlyFavorite);
      
      if (newFavoriteStatus) {
        setFavoriteCarIds(prev => [...prev, carId]);
      } else {
        setFavoriteCarIds(prev => prev.filter(id => id !== carId));
      }
      
      return newFavoriteStatus;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return false;
    }
  }, [isAuthenticated, favoriteCarIds]);

  const isFavorite = useCallback((carId: number): boolean => {
    return favoriteCarIds.includes(carId);
  }, [favoriteCarIds]);

  const getFavoriteCount = useCallback(async (carId: number): Promise<number> => {
    try {
      return await favoritesService.getFavoriteCount(carId);
    } catch (error) {
      console.error('Failed to get favorite count:', error);
      return 0;
    }
  }, []);

  return {
    favoriteCarIds,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    loadFavorites
  };
}; 