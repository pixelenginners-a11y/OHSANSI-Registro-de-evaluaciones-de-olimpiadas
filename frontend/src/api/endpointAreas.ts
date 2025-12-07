import type { Area } from '../features/areas/types/area';
import type { UpdateAreaInput } from '../features/areas/schemas/updateAreaSchema';
import api from './axios';

export type { Area };

export const areasEndpoints = {
  getAll: () => api.get('/areas'),
  getById: (id: number) => api.get(`/areas/${id}`),
  create: (data: Area) => api.post('/areas', data),
  update: (id: number, data: Area) => api.put(`/areas/${id}`, data),
  patch: (id: number, data: Partial<Area>) => api.patch(`/areas/${id}`, data),
  delete: (id: number) => api.delete(`/areas/${id}`),
};

export default areasEndpoints;
