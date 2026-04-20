import api from './axiosInstance';
export const ilanApi = {
  getAll: (params = {}) => api.get('/ilanlar', { params }),
  getById: (id) => api.get(`/ilanlar/${id}`),
  create: (data) => api.post('/ilanlar', data),
  update: (id, data) => api.put(`/ilanlar/${id}`, data),
  delete: (id) => api.delete(`/ilanlar/${id}`),
};