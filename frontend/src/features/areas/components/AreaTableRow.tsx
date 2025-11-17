import type { Area } from '../types/area';

interface AreaTableRowProps {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (area: Area) => void;
}

export const AreaTableRow = ({ area, onEdit, onDelete }: AreaTableRowProps) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-900">{area.name}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {(area as any).responsable?.full_name ?? '-'}
      </td>
      <td className="px-6 py-4 text-sm text-center text-gray-900">
        {area.medal_parameter?.gold ?? '-'}
      </td>
      <td className="px-6 py-4 text-sm text-center text-gray-900">
        {area.medal_parameter?.silver ?? '-'}
      </td>
      <td className="px-6 py-4 text-sm text-center text-gray-900">
        {area.medal_parameter?.bronze ?? '-'}
      </td>
      <td className="px-6 py-4 text-sm text-center text-gray-900">
        {area.medal_parameter?.honor_mentions ?? '-'}
      </td>
      <td className="px-6 py-4 text-sm text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            area.active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {area.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm flex gap-2 justify-center">
        <button
          onClick={() => onEdit(area)}
          className="px-3 py-1 text-blue-600 hover:text-blue-800"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(area)}
          className="px-3 py-1 text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};
