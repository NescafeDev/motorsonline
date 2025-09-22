import { useCallback } from 'react';
import { viewsService } from '../services/viewsService';

export const useViews = () => {
  const incrementView = useCallback(async (carId: number): Promise<void> => {
    try {
      await viewsService.incrementView(carId);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }, []);

  const getViewCount = useCallback(async (carId: number): Promise<number> => {
    try {
      return await viewsService.getViewCount(carId);
    } catch (error) {
      console.error('Failed to get view count:', error);
      return 0;
    }
  }, []);

  const getViewCounts = useCallback(async (carIds: number[]): Promise<{ [key: number]: number }> => {
    try {
      return await viewsService.getViewCounts(carIds);
    } catch (error) {
      console.error('Failed to get view counts:', error);
      return {};
    }
  }, []);

  return {
    incrementView,
    getViewCount,
    getViewCounts
  };
}; 