import React, { useState, useEffect } from "react";
import { InputField } from "./InputField";
import { Select } from "./Select";
import { type EvaluatorBase, type Responsable } from "../features/AdministratorUsers";

interface AreaOption {
  label: string;
  value: string | number;
}

interface EditEvaluatorModalProps {
  isOpen: boolean;
  evaluator: EvaluatorBase | Responsable | null;
  onClose: () => void;
  onSave: (id: number, data: Partial<EvaluatorBase>) => Promise<void>;
  areaOptions: AreaOption[];
}

export const EditEvaluatorModal = ({
  isOpen,
  evaluator,
  onClose,
  onSave,
  areaOptions
}: EditEvaluatorModalProps) => {
  const [formData, setFormData] = useState<Partial<EvaluatorBase>>({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    area_id: "",
    active: true,
  });

  useEffect(() => {
    if (evaluator) {
      setFormData({
        full_name: evaluator.full_name ?? "",
        username: evaluator.username ?? "",
        email: evaluator.email ?? "",
        phone: evaluator.phone ?? "",
        area_id: Number(evaluator.area_id) || "",
        active: evaluator.active ?? true,
      });
    }
  }, [evaluator]);

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
      area_id: Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluator) return;
    console.log("Saving data edit:", formData);
    await onSave(evaluator.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Editar evaluador</h2>

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

          <InputField
            label="Teléfono"
            name="phone"
            value={formData.phone ?? ""}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
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