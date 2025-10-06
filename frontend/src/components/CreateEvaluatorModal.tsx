import React, { useState } from "react";
import { InputField } from "./InputField";
import { Select } from "./Select";
import { type EvaluatorCreate, type ResponsableCreate } from "../features/AdministratorUsers";

interface AreaOption {
  label: string;
  value: string | number;
}

interface CreateEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EvaluatorCreate | ResponsableCreate) => Promise<void>;
  areaOptions: AreaOption[];
}

export const CreateEvaluatorModal = ({
  isOpen,
  onClose,
  onSave,
  areaOptions
}: CreateEvaluatorModalProps) => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    area_id: undefined as number | undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAreaChange = (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      area_id: value ? Number(value) : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Creating evaluator with data:", formData);
    await onSave(formData);

    setFormData({
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      area_id: undefined,
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      area_id: undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Crear evaluador</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Nombre completo"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <InputField
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.area_id ? String(formData.area_id) : ""}
              onChange={handleAreaChange}
              options={areaOptions}
              placeholder="Selecciona un área"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};