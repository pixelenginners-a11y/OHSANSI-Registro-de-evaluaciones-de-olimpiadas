// frontend/src/components/areas/EmptyState.tsx

import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
          style={{backgroundColor: '#EAE2B7', borderColor: '#F77F00'}}
        >
          <svg 
            className="w-8 h-8" 
            style={{color: '#F77F00'}} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </div>
        <p className="text-base mb-2 font-medium" style={{color: '#003049'}}>
          ¿Qué deseas hacer?
        </p>
        <p className="text-sm" style={{color: '#003049', opacity: 0.7}}>
          Haz clic en "Agregar Nueva" para crear un área
        </p>
        <p className="text-sm" style={{color: '#003049', opacity: 0.7}}>
          o selecciona "Editar" en cualquier área de la lista
        </p>
      </div>
    </div>
  );
};

export default EmptyState;