import api from './axiosInstance';
export const musteriApi = {
  getAll: (params = {}) => api.get('/musteriler', { params }),
  getById: (id) => api.get(`/musteriler/${id}`),
  create: (data) => api.post('/musteriler', data),
  update: (id, data) => api.put(`/musteriler/${id}`, data),
  delete: (id) => api.delete(`/musteriler/${id}`),
};