import type { Area } from '../features/areas/types/area';
import api from './axios';

export type { Area };

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const areasEndpoints = {
  // GET /api/areas - Obtener todas las áreas
  getAll: () => {
    return api.get('/areas', { headers: getAuthHeaders() });
  },

  // GET /api/areas/{id} - Obtener un área específica
  getById: (id: number) => {
    return api.get(`/areas/${id}`, { headers: getAuthHeaders() });
  },

  // POST /api/areas - Crear una nueva área
  create: (data: Area) => {
    return api.post('/areas', data, { headers: getAuthHeaders() });
  },

  // PUT /api/areas/{id} - Actualizar un área completa
  update: (id: number, data: Area) => {
    return api.put(`/areas/${id}`, data, { headers: getAuthHeaders() });
  },

  // PATCH /api/areas/{id} - Actualizar parcialmente un área
  patch: (id: number, data: Partial<Area>) => {
    return api.patch(`/areas/${id}`, data, { headers: getAuthHeaders() });
  },

  // DELETE /api/areas/{id} - Eliminar un área
  delete: (id: number) => {
    return api.delete(`/areas/${id}`, { headers: getAuthHeaders() });
  },
};

export default areasEndpoints;
