import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useSensors = () => {
  return useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const { data } = await api.get('/sensors');
      return data;
    },
    refetchInterval: 3000,
  });
};
