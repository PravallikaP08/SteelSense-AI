import api from './api';
export const getSensors = async () => {
  const { data } = await api.get('/sensors');
  return data;
};
