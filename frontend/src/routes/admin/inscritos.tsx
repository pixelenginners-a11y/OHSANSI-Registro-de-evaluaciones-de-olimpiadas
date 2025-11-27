import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import {
  type Column,
  type Area,
} from '../../features/administrar-inscritos/types/inscriptions'
import { List } from '../../features/administrar-inscritos/components/List';
import { Select } from '../../components/Select';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { EditInscriptionModal } from '../../features/administrar-inscritos/components/EditInscriptionModal';
import { CreateInscriptionModal } from '../../components/CreateInscriptionModal';
import {
  useGetInscriptions,
  useSearchInscriptions,
  useDeleteInscription,
  useUpdateInscription,
  useCreateInscription
} from "../../features/administrar-inscritos/hooks";
import { useGetAreas } from '../../features/AdministratorUsers/hooks';
import { useGetGrades } from '../../features/administrar-niveles/hooks';
import { type Nivel } from '../../features/administrar-niveles/types';
import { type Inscription, type InscriptionUpdate, type InscriptionCreate } from '../../features/administrar-inscritos/types/inscriptions';

export const Route = createFileRoute('/admin/inscritos')({
  component: RouteComponent,
})

function RouteComponent() {
  const columns: Column[] = [
    { key: "full_name", label: "Nombre Completo" },
    { key: "identity_document", label: "Documento" },
    { key: "educational_institution", label: "Institución Educativa" },
    { key: "department", label: "Departamento" },
    { key: "area_name", label: "Área" },
    { key: "grade_name", label: "Grado" },
    { key: "group_name", label: "Grupo" },
    { key: "status", label: "Estado" },
  ];

  const [areaFilter, setAreaFilter] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: fetchedData, isLoading, isError } = useGetInscriptions(page);
  const { data: areasData, isLoading: areasLoading, isError: areasError } = useGetAreas();
  const { data: gradesData, isLoading: gradeLoading, isError: gradesError } = useGetGrades();
  const { data: searchResults } = useSearchInscriptions(query, areaFilter, gradeFilter);
  const { mutateAsync: deleteInscription } = useDeleteInscription();
  const { mutateAsync: updateInscription, error: updateInscriptionError } = useUpdateInscription();
  const { mutateAsync: createInscription, error: createInscriptionError } = useCreateInscription();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  if (isLoading || areasLoading || gradeLoading) return <div className="p-6">Cargando...</div>;
  if (isError || areasError || gradesError || !gradesData) return <div className="p-6">Error al cargar los datos.</div>;

  const gradeOptions = gradesData.map((grade: Nivel) => ({
    value: grade.id,
    label: grade.name,
  }));

  const areaOptions = areasData.map((area: Area) => ({
    value: area.id,
    label: area.name
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'inscribed', label: 'Inscrito' },
  ];

  // Opciones de grupos (podrías obtenerlas de una API o generarlas dinámicamente)
  const groupOptions = [
    { value: 59, label: 'constructores del futuro' },
    { value: 67, label: 'guardianes del bosque' },
    { value: 49, label: 'bioexploradores' },
    { value: 62, label: 'codigo libre' },
    { value: 61, label: 'robotics squad' },
  ];

  const dataToShow = query || areaFilter || gradeFilter || groupFilter || statusFilter
    ? (searchResults?.data ?? [])
    : (fetchedData?.data ?? []);

  const handleEdit = (data: Inscription): void => {
    setSelectedInscription(data);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, data: Partial<InscriptionUpdate>) => {
    await updateInscription({ id, data });
    setIsModalOpen(false);
  };

  const handleEditActive = async (id: string, data: InscriptionUpdate) => {
    await updateInscription({ id: Number(id), data });
  }

  const handleSaveCreate = async (data: InscriptionCreate) => {
    await createInscription(data);
    setIsCreateModalOpen(false);
  };

  const clearFilters = () => {
    setAreaFilter("");
    setGradeFilter("");
    setGroupFilter("");
    setStatusFilter("");
    setQuery("");
    setInputValue("");
  };

  const hasActiveFilters = areaFilter || gradeFilter || groupFilter || statusFilter || query;

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Inscripciones</h1>

      <div className="flex flex-col gap-3 mb-4">
        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar por nombre, documento, institución..."
            className="w-full sm:flex-1"
          />
          <div className="w-full sm:w-auto flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary w-full sm:w-auto"
            >
              Nueva Inscripción
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          <Select
            value={areaFilter}
            onChange={(value) => setAreaFilter(String(value))}
            options={areaOptions}
            placeholder="Filtrar por área"
            className="w-full"
          />
          <Select
            value={gradeFilter}
            onChange={(value) => setGradeFilter(String(value))}
            options={gradeOptions}
            placeholder="Filtrar por grado"
            className="w-full"
          />
          {/* <Select
            value={groupFilter}
            onChange={(value) => setGroupFilter(String(value))}
            options={groupOptions}
            placeholder="Filtrar por grupo"
            className="w-full"
          /> */}
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            options={statusOptions}
            placeholder="Filtrar por estado"
            className="w-full"
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 w-full"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <List
          data={dataToShow}
          columns={columns}
          onDelete={deleteInscription}
          onEdit={handleEdit}
          editActive={handleEditActive}
        />
      </div>

      <div className="mt-auto flex items-center justify-between flex-wrap gap-2">
        {fetchedData?.total !== undefined && (
          <div className="text-sm text-gray-600">
            Total: {fetchedData.total} registros
          </div>
        )}

        <Pagination
          links={fetchedData?.links || []}
          currentPage={fetchedData?.current_page || 1}
          lastPage={fetchedData?.last_page || 1}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <EditInscriptionModal
        areaOptions={areaOptions}
        gradeOptions={gradeOptions}
        groupOptions={groupOptions}
        statusOptions={statusOptions}
        isOpen={isModalOpen}
        inscription={selectedInscription}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        updateInscriptionError={updateInscriptionError}
      />

      <CreateInscriptionModal
        areaOptions={areaOptions}
        gradeOptions={gradeOptions}
        statusOptions={statusOptions}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        createError={createInscriptionError}
      />
    </div>
  );
}