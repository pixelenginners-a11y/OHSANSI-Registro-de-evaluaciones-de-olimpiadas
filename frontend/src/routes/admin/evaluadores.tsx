import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import {
  type Column,
  type Area,
  type EvaluatorBase,
  type EvaluatorUpdate,
  type EvaluatorCreate,
  type Responsable,
  type ResponsableEdit,
  type ResponsableCreate,
} from '../../features/AdministratorUsers/index'
import { List } from '../../features/AdministratorUsers/components/List';
import { Select } from '../../components/Select';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { EditEvaluatorModal } from '../../components/EditEvaluatorModal';
import { CreateEvaluatorModal } from '../../components/CreateEvaluatorModal';
import { useGetEvaluators, useGetAreas, useSearchEvaluators, useDeleteEvaluator, useUpdateEvaluator, useCreateEvaluator } from "../../features/AdministratorUsers/hooks/index";

export const Route = createFileRoute('/admin/evaluadores')({
  component: RouteComponent,
})

function RouteComponent() {
  const columns: Column[] = [
    { key: "full_name", label: "Nombre Completo" },
    { key: "username", label: "Usuario" },
    { key: "phone", label: "Teléfono" },
    { key: "email", label: "Correo" },
    { key: "area", label: "Área" },
    { key: "active", label: "Estado" },
  ];

  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const [selectedEvaluator, setSelectedEvaluator] = useState<EvaluatorBase | Responsable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: fetchedData, isLoading, isError } = useGetEvaluators(page);
  const { data: areasData, isLoading: areasLoading, isError: areasError } = useGetAreas();
  const { data: searchResults } = useSearchEvaluators(query, filter);
  const { mutateAsync: deleteEvaluator } = useDeleteEvaluator();
  const { mutateAsync: updateEvaluator } = useUpdateEvaluator();
  const { mutateAsync: createEvaluator } = useCreateEvaluator();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  if (isLoading || areasLoading) return <div className="p-6">Cargando...</div>;
  if (isError || areasError) return <div className="p-6">Error al cargar los datos.</div>;

  const areaOptions = areasData.map((area: Area) => ({
    value: area.id,
    label: area.name
  }));

  const dataToShow = query || filter
    ? (searchResults?.data ?? [])
    : (fetchedData?.data ?? []);

  const handleEdit = (data: EvaluatorBase | Responsable): void => {
    setSelectedEvaluator(data);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, data: Partial<any>) => {
    await updateEvaluator({ id, data });
    setIsModalOpen(false);
  };

  const handleEditActive = async (id: string, data: EvaluatorUpdate | ResponsableEdit) => {
    await updateEvaluator({ id: Number(id), data: data as EvaluatorUpdate });
  }

  const handleSaveCreate = async (data: EvaluatorCreate | ResponsableCreate) => {
    await createEvaluator(data as EvaluatorCreate);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Evaluadores</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          placeholder="Buscar por nombre, usuario o correo..."
          className="w-full sm:flex-1"
        />
        <Select
          value={filter}
          onChange={(value) => setFilter(String(value))}
          options={areaOptions}
          className="w-full sm:w-auto"
        />
        <div className="w-full sm:w-auto flex justify-end">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary w-full sm:w-auto"
          >
            Nuevo Evaluador
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <List
          data={dataToShow}
          columns={columns}
          onDelete={deleteEvaluator}
          onEdit={handleEdit}
          editActive={handleEditActive}
        />
      </div>

      <div className="mt-auto flex items-center justify-between flex-wrap gap-2">
        {fetchedData.total !== undefined && (
          <div className="text-sm text-gray-600">
            Total: {fetchedData.total} registros
          </div>
        )}

        <Pagination
          links={fetchedData.links}
          currentPage={fetchedData.current_page}
          lastPage={fetchedData.last_page}
          onPageChange={(newPage) => setPage(newPage)}
        />
        <EditEvaluatorModal
          areaOptions={areaOptions}
          isOpen={isModalOpen}
          evaluator={selectedEvaluator}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
        <CreateEvaluatorModal
          areaOptions={areaOptions}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveCreate}
        />
      </div>
    </div>
  );
}
