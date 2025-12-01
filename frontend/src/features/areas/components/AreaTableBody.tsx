import type { Area, AreaWithGrades } from '../types/area';
import { AreaTableRow } from './AreaTableRow';

interface AreaTableBodyProps {
  areas: AreaWithGrades[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (area: AreaWithGrades) => void;
  onDelete: (area: Area) => void;
}

export const AreaTableBody = ({
  areas,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: AreaTableBodyProps) => {
  if (isLoading) {
    return (
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
            Cargando áreas...
          </td>
        </tr>
      </tbody>
    );
  }

  if (isError) {
    return (
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td colSpan={7} className="px-6 py-8 text-center text-red-500">
            No se pudieron cargar las áreas
          </td>
        </tr>
      </tbody>
    );
  }

  if (!areas || areas.length === 0) {
    return (
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
            No hay áreas registradas
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200">
      {areas.map((area) => (
        <AreaTableRow
          key={area.id}
          area={area}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
};
