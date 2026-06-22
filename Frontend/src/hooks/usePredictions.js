import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const usePredictions = () => {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      const { data } = await api.get('/predictions');
      return data;
    },
    refetchInterval: 5000,
  });
};
