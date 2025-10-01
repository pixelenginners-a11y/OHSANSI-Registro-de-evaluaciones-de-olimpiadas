// frontend/src/components/areas/AreaCard.tsx

import React from 'react';
import type { Area } from '../../../services/apiService';

interface AreaCardProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div 
      className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md border-l-4"
      style={{
        backgroundColor: '#EAE2B7',
        borderColor: '#003049',
        borderLeftColor: '#F77F00'
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium" style={{color: '#003049'}}>
            {area.nombre}
          </span>
          <span 
            className="ml-3 px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{
              backgroundColor: area.estado === 'Activo' ? '#F77F00' : '#D62828'
            }}
          >
            {area.estado}
          </span>
        </div>
        <div className="space-x-3">
          <button 
            onClick={() => onEdit(area)}
            className="px-3 py-1 rounded transition-all duration-200 hover:shadow-sm text-sm font-medium border"
            style={{
              color: '#F77F00',
              borderColor: '#F77F00',
              backgroundColor: 'transparent'
            }}
          >
            Editar
          </button>
          <button 
            onClick={() => onToggleStatus(area.id)}
            className="px-3 py-1 rounded transition-all duration-200 hover:shadow-sm text-sm font-medium border"
            style={{
              color: '#003049',
              borderColor: '#003049',
              backgroundColor: 'transparent'
            }}
          >
            Cambiar Estado
          </button>
          <button 
            onClick={() => onDelete(area.id)}
            className="px-3 py-1 rounded transition-all duration-200 hover:shadow-sm text-sm font-medium border"
            style={{
              color: '#D62828',
              borderColor: '#D62828',
              backgroundColor: 'transparent'
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaCard;