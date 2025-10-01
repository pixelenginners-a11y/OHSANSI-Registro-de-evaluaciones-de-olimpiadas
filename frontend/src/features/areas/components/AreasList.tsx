// frontend/src/components/areas/AreasList.tsx

import React from 'react';
import type { Area } from '../../../../../services/apiService';
import AreaCard from './AreaCard';

interface AreasListProps {
  areas: Area[];
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

const AreasList: React.FC<AreasListProps> = ({ 
  areas, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  return (
    <div className="w-1/2 border-r border-gray-200">
      {/* Section Header */}
      <div 
        className="px-6 py-4"
        style={{backgroundColor: '#EAE2B7'}}
      >
        <h2 
          className="text-3xl font-bold tracking-wide uppercase px-2 py-1 border-b-4"
          style={{
            color: '#003049',
            borderColor: '#F77F00'
          }}
        >
          Lista de Áreas
        </h2>
        <p className="text-base mt-2" style={{color: '#003049', opacity: 0.8}}>
          {areas.length} área{areas.length !== 1 ? 's' : ''} registrada{areas.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Areas Content */}
      <div className="p-6">
        <div className="space-y-3">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreasList;