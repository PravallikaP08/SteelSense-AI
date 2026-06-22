import api from './api';
export const getAlerts = async () => {
  const { data } = await api.get('/alerts');
  return data;
};
