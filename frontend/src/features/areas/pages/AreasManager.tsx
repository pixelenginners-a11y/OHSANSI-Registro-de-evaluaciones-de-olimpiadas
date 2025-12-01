import { useState, useEffect } from 'react';
import AreasTableHeader from '../components/AreasTableHeader';
import { AreaTableBody } from '../components/AreaTableBody';
import { DeleteAreaModal } from '../components/DeleteAreaModal';
import { CreateAreaModal } from '../components/CreateAreaModal';
import { UpdateAreaModal } from '../components/EditAreaModal';
import { Toast } from '../../../components/Toast';
import { useGetAreas, useDeleteArea } from '../hooks';
import type { Area, AreaWithGrades } from '../types/area';

const AreasManager = () => {
  const { data: areas, isLoading, isError } = useGetAreas();
  const deleteAreaMutation = useDeleteArea();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState<AreaWithGrades>({
    id: 0,
    name: '',
    description: '',
    grades: [],
    active: false,
    responsable_id: null,
    is_group: false,
    group_min_size: 0,
    group_max_size: 0,
    medal_parameter: null,
  });
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const handleEditClick = (area: AreaWithGrades) => {
    setAreaToEdit(area);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (area: Area) => {
    setAreaToDelete(area);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (areaToDelete) {
      deleteAreaMutation.mutate(areaToDelete.id);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAreaToDelete(null);
  };

  // Mostrar mensaje cuando la eliminación sea exitosa
  useEffect(() => {
    if (deleteAreaMutation.isSuccess) {
      setShowDeleteToast(true);
      deleteAreaMutation.reset();
    }
  }, [deleteAreaMutation.isSuccess, deleteAreaMutation]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestión de Áreas</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear Área
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <AreasTableHeader />
          <AreaTableBody
            areas={areas}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </table>
      </div>

      <DeleteAreaModal
        isOpen={isModalOpen}
        area={areaToDelete}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />

      <CreateAreaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UpdateAreaModal
        isOpen={isEditModalOpen}
        area={areaToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
      />

      <Toast
        message="Área eliminada exitosamente"
        type="success"
        isVisible={showDeleteToast}
        onClose={() => setShowDeleteToast(false)}
        duration={3000}
      />
    </div>
  );
};

export default AreasManager;
