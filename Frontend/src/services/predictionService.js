import api from './api';
export const getPredictions = async () => {
  const { data } = await api.get('/predictions');
  return data;
};
