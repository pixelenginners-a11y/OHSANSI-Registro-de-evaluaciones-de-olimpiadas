import { useState, useMemo } from "react";
import { OlympiansList } from "../components/OlympiansList";
import { CreateOlympianModal } from "../components/CreateOlympianModal";
import { EditOlympianModal } from "../components/EditOlympianModal";
import { Pagination } from "../components/Pagination";
import { ExportPDFButton } from "../components/ExportPDFButton";
import { useGetOlympians } from "../hooks/useOlympianQueries";
import { useDeleteOlympian, useCreateOlympian, useUpdateOlympian } from "../hooks/useOlympianMutations";
import type { Olympian, OlympianUpdate, OlympianCreate } from "../types";

export default function InscritosPage() {
  const { data: olympians = [], isLoading } = useGetOlympians();
  const { mutate: deleteOlympian } = useDeleteOlympian();
  const { mutateAsync: createOlympian } = useCreateOlympian();
  const { mutateAsync: updateOlympian } = useUpdateOlympian();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOlympian, setSelectedOlympian] = useState<Olympian | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Calcular los datos paginados
  const paginatedData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return olympians.slice(indexOfFirstItem, indexOfLastItem);
  }, [olympians, currentPage, itemsPerPage]);

  const handleEdit = (data: Olympian) => {
    setSelectedOlympian(data);
    setIsEditModalOpen(true);
  };

  const handleEditActive = (_id: string, _data: OlympianUpdate) => {
    // TODO: Implementar lógica de cambio de estado
  };

  const handleCreate = async (data: OlympianCreate) => {
    await createOlympian(data);
  };

  const handleUpdate = async (id: number, data: OlympianUpdate) => {
    await updateOlympian({ id, data });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Inscritos</h1>
        <div className="flex gap-3">
          <ExportPDFButton data={olympians} />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary"
          >
            Crear inscrito
          </button>
        </div>
      </div>

      <OlympiansList
        data={paginatedData}
        onDelete={deleteOlympian}
        onEdit={handleEdit}
        editActive={handleEditActive}
      />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={olympians.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateOlympianModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />

      <EditOlympianModal
        isOpen={isEditModalOpen}
        olympian={selectedOlympian}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOlympian(null);
        }}
        onSave={handleUpdate}
      />
    </div>
  );
}
