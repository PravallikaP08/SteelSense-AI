import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data } = await api.get('/alerts');
      return data;
    },
    refetchInterval: 5000,
  });
};
