import { useState, useEffect } from 'react';
import { useUpdateArea } from '../hooks';
import type { Area } from '../types/area';
import { InputField } from '../../../components/InputField';
import { useGetResponsables } from '../../responsables/hooks';
import { Toast } from '../../../components/Toast';
import axios from 'axios';

interface EditAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
}

export const EditAreaModal = ({
  isOpen,
  onClose,
  area,
}: EditAreaModalProps) => {
  const [formData, setFormData] = useState<Area>({
    id: 0,
    name: '',
    description: '',
    active: true,
    responsable_id: null,
    medal_parameter: {
      id: 0,
      area_id: 0,
      gold: null,
      silver: null,
      bronze: null,
      honor_mentions: 0
    },
    is_group: false,
    group_min_size: 1,
    group_max_size: 1
  });
  const [showToast, setShowToast] = useState(false);
  const updateAreaMutation = useUpdateArea();
  const { data: responsables = [] } = useGetResponsables();

  // Cargar los datos del área cuando el modal se abre
  useEffect(() => {
    if (area && isOpen) {
      // Asegurar que group_min_size y group_max_size sean siempre números
      const safeGroupMinSize = (typeof area.group_min_size === 'number' && area.group_min_size > 0) ? area.group_min_size : 1;
      const safeGroupMaxSize = (typeof area.group_max_size === 'number' && area.group_max_size > 0) ? area.group_max_size : 1;

      console.log('Cargando área:', area);
      console.log('group_min_size original:', area.group_min_size, 'tipo:', typeof area.group_min_size);
      console.log('group_min_size seguro:', safeGroupMinSize, 'tipo:', typeof safeGroupMinSize);

      setFormData({
        ...area,
        medal_parameter: area.medal_parameter || {
          id: 0,
          area_id: area.id,
          gold: null,
          silver: null,
          bronze: null,
          honor_mentions: 0
        },
        group_min_size: safeGroupMinSize,
        group_max_size: safeGroupMaxSize
      });
    }
  }, [area, isOpen]);

  const getErrorMessage = (error: any): string => {
    if (axios.isAxiosError(error)) {
      // Error de validación del backend
      if (error.response?.data?.message) {
        return error.response.data.message;
      }

      // Errores de validación específicos
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages: string[] = [];

        if (errors.name) errorMessages.push(`Nombre: ${errors.name[0]}`);
        if (errors.description) errorMessages.push(`Descripción: ${errors.description[0]}`);
        if (errors.responsable_id) errorMessages.push(`Responsable: ${errors.responsable_id[0]}`);
        if (errors.is_group) errorMessages.push(`Área de grupo: ${errors.is_group[0]}`);
        if (errors.group_min_size) errorMessages.push(`Tamaño mínimo: ${errors.group_min_size[0]}`);
        if (errors.group_max_size) errorMessages.push(`Tamaño máximo: ${errors.group_max_size[0]}`);

        if (errorMessages.length > 0) {
          return errorMessages.join(' | ');
        }
      }

      // Errores HTTP específicos
      if (error.response?.status === 404) {
        return 'No se pudo encontrar el recurso solicitado';
      }
      if (error.response?.status === 403) {
        return 'No tienes permisos para realizar esta acción';
      }
      if (error.response?.status === 500) {
        return 'Error en el servidor. Por favor, contacta al administrador';
      }
      if (error.response?.status === 422) {
        return 'Los datos proporcionados no son válidos';
      }
    }

    // Error de red
    if (error.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
    }

    // Error genérico
    return 'Ocurrió un error inesperado. Por favor, intenta nuevamente';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de responsable
    if (!formData.responsable_id) {
      alert('Por favor, selecciona un responsable');
      return;
    }

    // Validación para áreas de grupo
    if (formData.is_group) {
      if (!formData.group_min_size || !formData.group_max_size) {
        alert('Por favor, completa el tamaño mínimo y máximo del grupo');
        return;
      }
      if (formData.group_min_size > formData.group_max_size) {
        alert('El tamaño mínimo no puede ser mayor que el tamaño máximo');
        return;
      }
      if (formData.group_min_size < 1) {
        alert('El tamaño mínimo debe ser al menos 1');
        return;
      }
    }

    const dataToSend = {
      id: formData.id,
      data: {
        name: formData.name,
        description: formData.description,
        active: formData.active,
        responsable_id: formData.responsable_id,
        is_group: formData.is_group,
        group_min_size: formData.group_min_size,
        group_max_size: formData.group_max_size,
        medalParameter: {
          gold: formData.medal_parameter?.gold ?? null,
          silver: formData.medal_parameter?.silver ?? null,
          bronze: formData.medal_parameter?.bronze ?? null,
          honor_mentions: formData.medal_parameter?.honor_mentions ?? 0
        }
      }
    };

    console.log('Datos completos del formulario:', formData);
    console.log('Datos a enviar al backend:', dataToSend);
    console.log('group_min_size:', formData.group_min_size, 'tipo:', typeof formData.group_min_size);
    console.log('group_max_size:', formData.group_max_size, 'tipo:', typeof formData.group_max_size);

    updateAreaMutation.mutate(dataToSend);
  };

  const handleCancel = () => {
    onClose();
  };

  // Cerrar el modal y mostrar mensaje cuando la actualización sea exitosa
  useEffect(() => {
    if (updateAreaMutation.isSuccess) {
      setShowToast(true);
      onClose();
      updateAreaMutation.reset();
    }
  }, [updateAreaMutation.isSuccess, onClose, updateAreaMutation]);

  if (!isOpen || !area) return (
    <>
      <Toast
        message="Área actualizada exitosamente"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Editar Área
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={updateAreaMutation.isPending}
          />

          <InputField
            label="Descripción"
            name="description"
            type="text"
            value={formData.description ?? ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={updateAreaMutation.isPending}
          />

          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="responsable_id" className="text-sm font-medium text-gray-700">
              Responsable <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.responsable_id || ''}
              onChange={(e) => setFormData({ ...formData, responsable_id: e.target.value ? +e.target.value : null })}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
              required
              disabled={updateAreaMutation.isPending}
            >
              <option value="">Seleccionar responsable</option>
              {responsables.filter(item => item !== null).map((r,index) => (
                <option key={index} value={r.id}>
                  {r.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Parámetros de Medallas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="gold" className="text-sm font-medium text-gray-700">
                  Oro
                </label>
                <input
                  id="gold"
                  name="gold"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.medal_parameter?.gold ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(+value) && +value >= 0)) {
                      setFormData({
                        ...formData,
                        medal_parameter: {
                          ...formData.medal_parameter!,
                          gold: value ? Math.floor(+value) : null
                        }
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  disabled={updateAreaMutation.isPending}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="silver" className="text-sm font-medium text-gray-700">
                  Plata
                </label>
                <input
                  id="silver"
                  name="silver"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.medal_parameter?.silver ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(+value) && +value >= 0)) {
                      setFormData({
                        ...formData,
                        medal_parameter: {
                          ...formData.medal_parameter!,
                          silver: value ? Math.floor(+value) : null
                        }
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  disabled={updateAreaMutation.isPending}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="bronze" className="text-sm font-medium text-gray-700">
                  Bronce
                </label>
                <input
                  id="bronze"
                  name="bronze"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.medal_parameter?.bronze ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(+value) && +value >= 0)) {
                      setFormData({
                        ...formData,
                        medal_parameter: {
                          ...formData.medal_parameter!,
                          bronze: value ? Math.floor(+value) : null
                        }
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  disabled={updateAreaMutation.isPending}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="honor_mentions" className="text-sm font-medium text-gray-700">
                  Menciones de Honor
                </label>
                <input
                  id="honor_mentions"
                  name="honor_mentions"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.medal_parameter?.honor_mentions ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (!isNaN(+value) && +value >= 0)) {
                      setFormData({
                        ...formData,
                        medal_parameter: {
                          ...formData.medal_parameter!,
                          honor_mentions: value ? Math.floor(+value) : 0
                        }
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  disabled={updateAreaMutation.isPending}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={updateAreaMutation.isPending}
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Área activa
            </label>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="is_group"
                checked={formData.is_group}
                onChange={(e) => setFormData({
                  ...formData,
                  is_group: e.target.checked,
                  group_min_size: 1,
                  group_max_size: e.target.checked ? formData.group_max_size : 1
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={updateAreaMutation.isPending}
              />
              <label htmlFor="is_group" className="ml-2 block text-sm font-medium text-gray-700">
                Área de grupo
              </label>
            </div>

            {formData.is_group && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div className="flex flex-col gap-1 mb-3">
                  <label htmlFor="group_min_size" className="text-sm font-medium text-gray-700">
                    Tamaño mínimo del grupo
                  </label>
                  <input
                    id="group_min_size"
                    name="group_min_size"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.group_min_size ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setFormData({
                          ...formData,
                          group_min_size: 1
                        });
                      } else if (!isNaN(+value) && +value >= 1) {
                        setFormData({
                          ...formData,
                          group_min_size: Math.floor(+value)
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    disabled={updateAreaMutation.isPending}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  <label htmlFor="group_max_size" className="text-sm font-medium text-gray-700">
                    Tamaño máximo del grupo
                  </label>
                  <input
                    id="group_max_size"
                    name="group_max_size"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.group_max_size ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setFormData({
                          ...formData,
                          group_max_size: 1
                        });
                      } else if (!isNaN(+value) && +value >= 1) {
                        setFormData({
                          ...formData,
                          group_max_size: Math.floor(+value)
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    disabled={updateAreaMutation.isPending}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {updateAreaMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-700 mb-1">
                Error al actualizar el área
              </p>
              <p className="text-sm text-red-600">
                {getErrorMessage(updateAreaMutation.error)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={updateAreaMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateAreaMutation.isPending}
            >
              {updateAreaMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
      </div>

      <Toast
        message="Área actualizada exitosamente"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </>
  );
};
