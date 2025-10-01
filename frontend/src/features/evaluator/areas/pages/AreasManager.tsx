// frontend/src/components/areas/AreasManager.tsx - VERSIÓN REFACTORIZADA

import React, { useState, useEffect } from 'react';
import { apiService, type Area } from '../../../../services/apiService';
import AreasList from '../components/AreasList';
import AreaPanel from '../components/AreaPanel';

const AreasManager: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAreas();
      if (response.success) {
        setAreas(response.data);
      } else {
        setError('Error al cargar las áreas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleCreateArea = () => {
    setEditingArea(null);
    setShowForm(true);
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDeleteArea = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta área?')) {
      return;
    }

    try {
      const response = await apiService.deleteArea(id);
      if (response.success) {
        await loadAreas();
      } else {
        alert('Error al eliminar el área');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await apiService.toggleAreaStatus(id);
      if (response.success) {
        await loadAreas();
      } else {
        alert('Error al cambiar el estado');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const handleFormSubmit = async (areaData: Omit<Area, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      let response;
      if (editingArea) {
        response = await apiService.updateArea(editingArea.id, areaData);
      } else {
        response = await apiService.createArea(areaData);
      }

      if (response.success) {
        setShowForm(false);
        setEditingArea(null);
        await loadAreas();
      } else {
        alert('Error al guardar el área');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingArea(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{backgroundColor: '#EAE2B7'}}>
        <div className="text-xl" style={{color: '#003049'}}>Cargando áreas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{backgroundColor: '#EAE2B7'}}>
        <div className="text-xl" style={{color: '#D62828'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#EAE2B7'}}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Header */}
          <div className="border-b border-gray-100 p-6" style={{backgroundColor: '#003049'}}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Administrar Áreas</h1>
                <p className="text-white/80">
                  Gestión completa de áreas de competencia
                </p>
              </div>
              <button
                onClick={handleCreateArea}
                style={{backgroundColor: '#F77F00'}}
                className="hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                + Agregar Nueva
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex">
            <AreasList
              areas={areas}
              onEdit={handleEditArea}
              onDelete={handleDeleteArea}
              onToggleStatus={handleToggleStatus}
            />
            
            <AreaPanel
              showForm={showForm}
              editingArea={editingArea}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasManager;