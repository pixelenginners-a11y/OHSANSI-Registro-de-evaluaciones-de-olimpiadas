import React, { useState, useEffect } from "react";
import { InputField } from "./InputField";
import { Select } from "./Select";
import { type Responsable } from "../features/AdministratorUsers";

interface AreaOption {
  label: string;
  value: string | number;
}

interface EditResponsableModalProps {
  isOpen: boolean;
  responsable: Responsable | null;
  onClose: () => void;
  onSave: (id: number, data: Partial<Responsable>) => Promise<void>;
  areaOptions: AreaOption[];
}

export const EditResponsableModal = ({
  isOpen,
  responsable,
  onClose,
  onSave,
  areaOptions
}: EditResponsableModalProps) => {
  const [formData, setFormData] = useState<Partial<Responsable>>({
    full_name: "",
    username: "",
    email: "",
    area_id: "",
    phone: "",
    active: true,
  });

  useEffect(() => {
    if (responsable) {
      setFormData({
        full_name: responsable.full_name ?? "",
        username: responsable.username ?? "",
        email: responsable.email ?? "",
        area_id: Number(responsable.area_id) || "",
        phone: responsable.phone ?? "",
        active: responsable.active ?? true,
      });
    }
  }, [responsable]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (value: string | number) => {
    setFormData((prev) => ({ ...prev, area_id: Number(value) }));
    console.log("Selected area ID:", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsable) return;
    console.log("Saving data:", formData);
    await onSave(responsable.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Editar responsable</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Nombre completo"
            name="full_name"
            value={formData.full_name ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Nombre de usuario"
            name="username"
            value={formData.username ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email ?? ""}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <Select
              value={formData.area_id ? String(formData.area_id) : ""}
              onChange={(area) => handleAreaChange(area)}
              options={areaOptions}
              placeholder="Selecciona un área"
              className="w-full"
            />
          </div>

          <InputField
            label="Teléfono"
            name="phone"
            value={formData.phone ?? ""}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
