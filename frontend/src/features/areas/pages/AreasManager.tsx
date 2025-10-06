import { useState } from 'react';
import AreaCard from '../components/AreaCard';
import AreaFormModal from '../components/AreaFormModal';
import type { Area } from '../types/area';
import {
  useGetAreas,
  useCreateArea,
  useUpdateArea,
  useDeleteArea
} from '../hooks';

const AreasManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Queries
  const { data: areas = [], isLoading, error } = useGetAreas();

  // Mutations
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const handleOpenCreate = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  const handleSubmit = (data: { name: string; description: string | null; active: boolean }) => {
    if (selectedArea) {
      updateArea.mutate(
        { id: selectedArea.id, data },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createArea.mutate(data, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta área?')) {
      deleteArea.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar las áreas</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary-1 text-white rounded hover:bg-primary-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-primary-dark mb-2">
            Gestión de Áreas Olímpicas
          </h1>
          <p className="text-sm text-gray-500">
            Administra las áreas académicas y sus logros
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={handleOpenCreate}
            className="px-6 py-2.5 bg-secondary-1 hover:bg-primary-dark text-white text-sm font-medium rounded transition-colors duration-200"
          >
            + Nueva Área
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Cargando áreas...</div>
          </div>
        ) : areas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay áreas registradas</p>
            <button
              onClick={handleOpenCreate}
              className="px-6 py-2.5 bg-secondary-1 hover:bg-primary-dark text-white text-sm font-medium rounded transition-colors duration-200"
            >
              Crear primera área
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {areas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <AreaFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          area={selectedArea}
          isLoading={createArea.isPending || updateArea.isPending}
          />
      </div>
    </div>
  );
};

export default AreasManager;