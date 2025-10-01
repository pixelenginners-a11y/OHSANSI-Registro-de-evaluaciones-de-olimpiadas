// frontend/src/components/areas/AreaPanel.tsx

import React from 'react';
import type { Area } from '../../../../../services/apiService';
import AreaForm from './AreaForm';
import EmptyState from './EmptyState';

interface AreaPanelProps {
  showForm: boolean;
  editingArea: Area | null;
  onSubmit: (areaData: Omit<Area, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const AreaPanel: React.FC<AreaPanelProps> = ({ 
  showForm, 
  editingArea, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <div className="w-1/2">
      {/* Section Header */}
      <div 
        className="px-6 py-4"
        style={{backgroundColor: '#EAE2B7'}}
      >
        <h2 
          className="text-3xl font-bold tracking-wide uppercase px-2 py-1 border-b-4"
          style={{
            color: '#003049',
            borderColor: editingArea ? '#F77F00' : '#D62828'
          }}
        >
          {showForm 
            ? (editingArea ? 'Editar Área' : 'Crear Nueva Área') 
            : 'Panel de Acciones'
          }
        </h2>
        <p className="text-base mt-2" style={{color: '#003049', opacity: 0.8}}>
          {showForm 
            ? (editingArea ? 'Modifica los datos del área seleccionada' : 'Completa los campos para crear una nueva área')
            : 'Selecciona una acción para gestionar las áreas'
          }
        </p>
      </div>
      
      {/* Panel Content */}
      <div className="p-6">
        {showForm ? (
          <AreaForm
            editingArea={editingArea}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default AreaPanel;