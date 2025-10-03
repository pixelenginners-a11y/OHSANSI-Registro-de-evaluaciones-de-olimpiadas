import api from './axios';

export interface Area {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const areasEndpoints = {
  // GET /api/areas - Obtener todas las áreas
  getAll: () => {
    return api.get('/areas');
  },

  // GET /api/areas/{id} - Obtener un área específica
  getById: (id: number) => {
    return api.get(`/areas/${id}`);
  },

  // POST /api/areas - Crear una nueva área
  create: (data: Area) => {
    return api.post('/areas', data);
  },

  // PUT /api/areas/{id} - Actualizar un área completa
  update: (id: number, data: Area) => {
    return api.put(`/areas/${id}`, data);
  },

  // PATCH /api/areas/{id} - Actualizar parcialmente un área
  patch: (id: number, data: Partial<Area>) => {
    return api.patch(`/areas/${id}`, data);
  },

  // DELETE /api/areas/{id} - Eliminar un área
  delete: (id: number) => {
    return api.delete(`/areas/${id}`);
  },
};

export default areasEndpoints;
