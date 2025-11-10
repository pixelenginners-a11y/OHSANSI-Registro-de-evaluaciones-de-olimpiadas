import { useState, useEffect, useCallback } from 'react';
import type { Area } from '../types/area';
import type { Responsable } from '../../AdministratorUsers/types/responsible';
import { ResponsableSelector } from './ResponsableSelector';

type AreaFormData = {
  name: string;
  description: string;
  active: boolean;
  responsable_id: string;
  is_group: boolean;
  group_min_size: string;
  group_max_size: string;
};

type AreaFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string | null; active: boolean; responsable_id: number | null; is_group: boolean; group_min_size: number | null; group_max_size: number | null }) => void;
  area?: Area | null;
  isLoading?: boolean;
  responsables: Responsable[];
};

const INITIAL_FORM_STATE: AreaFormData = {
  name: '',
  description: '',
  active: true,
  responsable_id: '',
  is_group: false,
  group_min_size: '',
  group_max_size: '',
};

const AreaFormModal = ({ isOpen, onClose, onSubmit, area, isLoading, responsables }: AreaFormModalProps) => {
  const [formData, setFormData] = useState<AreaFormData>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM_STATE);
      return;
    }

    if (area) {
      setFormData({
        name: area.name,
        description: area.description || '',
        active: area.active,
        responsable_id: area.responsable_id?.toString() || '',
        is_group: area.is_group,
        group_min_size: area.group_min_size?.toString() || '',
        group_max_size: area.group_max_size?.toString() || '',
      });
    }
  }, [area, isOpen]);

  const handleChange = useCallback((field: keyof AreaFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

      setFormData(prev => ({ ...prev, [field]: value }));
    };
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      active: formData.active,
      responsable_id: formData.responsable_id ? parseInt(formData.responsable_id) : null,
      is_group: formData.is_group,
      group_min_size: formData.group_min_size ? parseInt(formData.group_min_size) : null,
      group_max_size: formData.group_max_size ? parseInt(formData.group_max_size) : null,
    });
  }, [formData, onSubmit]);

  if (!isOpen) return null;

  const isEditMode = Boolean(area);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md h-[90%] overflow-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-primary-dark">
            {isEditMode ? 'Editar Área' : 'Nueva Área'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleChange('name')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ej: Matemáticas"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={3}
              placeholder="Descripción del área olímpica..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={handleChange('active')}
              disabled={isLoading}
              className="w-4 h-4 text-secondary-1 border-gray-300 rounded focus:ring-secondary-1 disabled:cursor-not-allowed"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Área activa
            </label>
          </div>

          <ResponsableSelector
            value={formData.responsable_id ? parseInt(formData.responsable_id) : null}
            onChange={(value) => setFormData(prev => ({ ...prev, responsable_id: value?.toString() || '' }))}
            responsables={responsables}
            areaId={area?.id}
            isLoading={isLoading}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_group"
              checked={formData.is_group}
              onChange={handleChange('is_group')}
              disabled={isLoading}
              className="w-4 h-4 text-secondary-1 border-gray-300 rounded focus:ring-secondary-1 disabled:cursor-not-allowed"
            />
            <label htmlFor="is_group" className="ml-2 text-sm text-gray-700">
              Es un área grupal
            </label>
          </div>

          {formData.is_group && (
            <>
              <div>
                <label htmlFor="group_min_size" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño mínimo del grupo
                </label>
                <input
                  type="number"
                  id="group_min_size"
                  value={formData.group_min_size}
                  onChange={handleChange('group_min_size')}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tamaño mínimo"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="group_max_size" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño máximo del grupo
                </label>
                <input
                  type="number"
                  id="group_max_size"
                  value={formData.group_max_size}
                  onChange={handleChange('group_max_size')}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tamaño máximo"
                  min="1"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-secondary-1 text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaFormModal;
