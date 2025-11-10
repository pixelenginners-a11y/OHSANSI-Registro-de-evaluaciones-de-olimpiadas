import React from 'react';
import type { Responsable } from '../../AdministratorUsers/types/responsible';

interface ResponsableSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
  responsables: Responsable[] | Record<string, Responsable>;
  areaId?: number | null; // ID del área en modo edición
  isLoading?: boolean;
  disabled?: boolean;
}

export const ResponsableSelector: React.FC<ResponsableSelectorProps> = ({
  value,
  onChange,
  responsables,
  areaId,
  isLoading = false,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value === '' ? null : Number(e.target.value);
    onChange(newValue);
  };

  const responsablesList = Array.isArray(responsables)
    ? responsables
    : Object.values(responsables || {}) as Responsable[];

  // Filtrar responsables según el modo:
  const availableResponsables = responsablesList.filter((responsable): responsable is Responsable => {
    if (!responsable || typeof responsable !== 'object' || !('id' in responsable)) {
      return false;
    }

    // MODO CREAR: Solo mostrar responsables sin área asignada
    if (!areaId) {
      return !responsable.area_id || responsable.area_id === null;
    }

    // MODO EDITAR: Solo mostrar responsables de ESTA área específica
    // Comparar area_id del responsable con el id del área actual
    return responsable.area_id === areaId;
  });

  return (
    <div>
      <label htmlFor="responsable_id" className="block text-sm font-medium text-gray-700 mb-1">
        Responsable
      </label>
      <select
        id="responsable_id"
        value={value ?? ''}
        onChange={handleChange}
        disabled={isLoading || disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Seleccione un responsable</option>
        {availableResponsables.length === 0 ? (
          <option value="" disabled>
            No hay responsables disponibles para esta área
          </option>
        ) : (
          availableResponsables.map((responsable) => (
            <option key={responsable.id} value={responsable.id}>
              {responsable.full_name}
            </option>
          ))
        )}
      </select>
      {Array.isArray(responsables) && responsables.length === 0 && (
        <p className="text-xs text-orange-600 mt-1">
          ⚠️ No se encontraron responsables. Verifica que existan en la base de datos.
        </p>
      )}
    </div>
  );
};
