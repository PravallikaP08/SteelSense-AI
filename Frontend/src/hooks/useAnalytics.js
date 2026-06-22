import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics');
      return data;
    },
    refetchInterval: 5000,
  });
};
