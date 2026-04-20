import api from './axiosInstance';
export const analizApi = {
  getAnaliz: () => api.get('/analiz'),
};