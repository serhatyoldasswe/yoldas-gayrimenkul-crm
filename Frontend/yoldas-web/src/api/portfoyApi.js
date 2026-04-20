import api from './axiosInstance';
export const portfoyApi = {
  getAll: () => api.get('/portfoyler'),
  getById: (id) => api.get(`/portfoyler/${id}`),
  create: (data) => api.post('/portfoyler', data),
  update: (id, data) => api.put(`/portfoyler/${id}`, data),
  delete: (id) => api.delete(`/portfoyler/${id}`),
};