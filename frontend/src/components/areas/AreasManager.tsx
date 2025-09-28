// frontend/src/components/areas/AreasManager.tsx

import React, { useState, useEffect } from 'react';
import { apiService, type Area } from '../../services/apiService';

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
            {/* Left side - Areas List */}
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
                    <div 
                      key={area.id} 
                      className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md border-l-4"
                      style={{
                        backgroundColor: '#EAE2B7',
                        borderColor: '#003049',
                        borderLeftColor: '#F77F00'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium" style={{color: '#003049'}}>{area.nombre}</span>
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
                            onClick={() => handleEditArea(area)}
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
                            onClick={() => handleToggleStatus(area.id)}
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
                            onClick={() => handleDeleteArea(area.id)}
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
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Form or empty state */}
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
              
              {/* Form Content */}
              <div className="p-6">
                {showForm ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const nombre = formData.get('nombre') as string;
                    const estado = formData.get('estado') as 'Activo' | 'Inactivo';
                    handleFormSubmit({ nombre, estado });
                  }}>
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
                          onClick={handleFormCancel}
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
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                        style={{backgroundColor: '#EAE2B7', borderColor: '#F77F00'}}
                      >
                        <svg className="w-8 h-8" style={{color: '#F77F00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-base mb-2 font-medium" style={{color: '#003049'}}>¿Qué deseas hacer?</p>
                      <p className="text-sm" style={{color: '#003049', opacity: 0.7}}>Haz clic en "Agregar Nueva" para crear un área</p>
                      <p className="text-sm" style={{color: '#003049', opacity: 0.7}}>o selecciona "Editar" en cualquier área de la lista</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasManager;
