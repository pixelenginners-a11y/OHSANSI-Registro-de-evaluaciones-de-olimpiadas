// frontend/src/components/areas/AreaForm.tsx

import React from 'react';
import type { Area } from '../../../../../services/apiService';

interface AreaFormProps {
  editingArea: Area | null;
  onSubmit: (areaData: Omit<Area, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const AreaForm: React.FC<AreaFormProps> = ({ editingArea, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nombre = formData.get('nombre') as string;
    const estado = formData.get('estado') as 'Activo' | 'Inactivo';
    onSubmit({ nombre, estado });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#003049'}}>
            Nombre del Área
          </label>
          <input
            type="text"
            name="nombre"
            defaultValue={editingArea?.nombre || ''}
            required
            className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
            style={{
              borderColor: '#003049',
              backgroundColor: '#EAE2B7',
              color: '#003049'
            }}
            placeholder="Ej: Matemática"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: '#003049'}}>
            Estado
          </label>
          <select
            name="estado"
            defaultValue={editingArea?.estado || 'Activo'}
            className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
            style={{
              borderColor: '#003049',
              backgroundColor: '#EAE2B7',
              color: '#003049'
            }}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-white hover:opacity-90"
            style={{backgroundColor: '#F77F00'}}
          >
            {editingArea ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2"
            style={{
              borderColor: '#D62828',
              color: '#D62828',
              backgroundColor: 'transparent'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default AreaForm;