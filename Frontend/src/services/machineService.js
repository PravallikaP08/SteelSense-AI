import api from './api';
export const getMachines = async () => {
  const { data } = await api.get('/machines');
  return data;
};
