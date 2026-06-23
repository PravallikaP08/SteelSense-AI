import api from './api';

export const getAlerts = async () => {
  const { data } = await api.get('/alerts');
  return data;
};

export const markAlertRead = async (id) => {
  const { data } = await api.put(`/alerts/${id}/read`);
  return data;
};

export const markAllAlertsRead = async () => {
  const { data } = await api.put('/alerts/mark-all-read');
  return data;
};
