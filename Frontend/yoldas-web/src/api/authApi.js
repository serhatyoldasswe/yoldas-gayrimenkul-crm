import api from './axiosInstance';
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  kayit: (data) => api.post('/auth/kayit', data),
};