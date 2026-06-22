import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useMachines = () => {
  return useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      const { data } = await api.get('/machines');
      return data;
    },
    refetchInterval: 5000,
  });
};
