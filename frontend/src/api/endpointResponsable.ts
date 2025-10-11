import type { Responsable } from '../features/responsables/types/responsable';
import api from './axios';

export type { Responsable };

export const responsablesEndpoints = {
  // GET /api/academics - Obtener todos los responsables académicos
  getAll: () => {
    return api.get('/academics');
  },

  // GET /api/academics/{id} - Obtener un responsable específico
  getById: (id: number) => {
    return api.get(`/academics/${id}`);
  },

  // POST /api/academics - Crear un nuevo responsable
  create: (data: Responsable) => {
    return api.post('/academics', data);
  },

  // PUT /api/academics/{id} - Actualizar un responsable completo
  update: (id: number, data: Responsable) => {
    return api.put(`/academics/${id}`, data);
  },

  // PATCH /api/academics/{id} - Actualizar parcialmente un responsable
  patch: (id: number, data: Partial<Responsable>) => {
    return api.patch(`/academics/${id}`, data);
  },

  // DELETE /api/academics/{id} - Eliminar un responsable
  delete: (id: number) => {
    return api.delete(`/academics/${id}`);
  },
};

export default responsablesEndpoints;
