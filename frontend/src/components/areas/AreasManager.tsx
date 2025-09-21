// frontend/src/components/areas/AreasManager.tsx

import React, { useState, useEffect } from 'react';
import { apiService, type Area } from '../../services/apiService';
// import AreasList from './AreasList';
// import AreaForm from './AreaForm';

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando áreas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administrar Áreas</h1>
              <p className="text-sm text-gray-600 mt-1">
                Lista de Áreas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Crear Nueva Área
              </p>
            </div>
            <button
              onClick={handleCreateArea}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              + Agregar Nueva
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Left side - Areas List */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            {/* Temporal - Lista simple */}
            <div className="space-y-2">
              {areas.map((area) => (
                <div key={area.id} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{area.nombre}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      area.estado === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {area.estado}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button 
                      onClick={() => handleEditArea(area)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(area.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Cambiar Estado
                    </button>
                    <button 
                      onClick={() => handleDeleteArea(area.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form or empty state */}
          <div className="w-1/2 p-6">
            {showForm ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {editingArea ? 'Editar Área' : 'Nueva Área'}
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const nombre = formData.get('nombre') as string;
                  const estado = formData.get('estado') as 'Activo' | 'Inactivo';
                  handleFormSubmit({ nombre, estado });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Área
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        defaultValue={editingArea?.nombre || ''}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Matemática"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        name="estado"
                        defaultValue={editingArea?.estado || 'Activo'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        {editingArea ? 'Actualizar' : 'Crear'}
                      </button>
                      <button
                        type="button"
                        onClick={handleFormCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Selecciona una acción</p>
                  <p className="text-sm">Haz clic en "Agregar Nueva" para crear un área</p>
                  <p className="text-sm">o edita un área existente de la lista</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasManager;