import React, { useState, useEffect } from "react";
import { InputField } from "../../../components/InputField";
import { SelectField } from "../../../components/SelectField";
import { type Olympian, type OlympianUpdate } from "../types";
import { useGetAreas } from "../../../api/areas";
import { useQuery } from "@tanstack/react-query";
import { getGrades } from "../../../api/grades";

interface EditOlympianModalProps {
  isOpen: boolean;
  olympian: Olympian | null;
  onClose: () => void;
  onSave: (id: number, data: OlympianUpdate) => Promise<void>;
}

export const EditOlympianModal = ({
  isOpen,
  olympian,
  onClose,
  onSave,
}: EditOlympianModalProps) => {
  // Obtener áreas y grados disponibles
  const { data: areas = [] } = useGetAreas();
  const { data: gradesResponse } = useQuery({
    queryKey: ["grades"],
    queryFn: getGrades,
  });
  const grades = gradesResponse?.data || [];

  const [formData, setFormData] = useState<OlympianUpdate>({
    area_id: undefined,
    grade_id: undefined,
    status: undefined,
    olympian: {
      full_name: "",
      identity_document: "",
      educational_institution: "",
      department: "",
      academic_tutor: "",
    },
  });

  useEffect(() => {
    if (olympian) {
      setFormData({
        area_id: olympian.area_id,
        grade_id: olympian.grade_id,
        status: olympian.status as "pending" | "approved" | "rejected",
        olympian: {
          full_name: olympian.olympian.full_name ?? "",
          identity_document: olympian.olympian.identity_document ?? "",
          educational_institution: olympian.olympian.educational_institution ?? "",
          department: olympian.olympian.department ?? "",
          academic_tutor: olympian.olympian.academic_tutor ?? "",
        },
      });
    }
  }, [olympian]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      olympian: {
        ...prev.olympian,
        [name]: value,
      },
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!olympian) return;
    console.log("Saving olympian edit:", formData);
    await onSave(olympian.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Editar inscrito</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Nombre completo"
            name="full_name"
            value={formData.olympian?.full_name ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Documento de identidad"
            name="identity_document"
            value={formData.olympian?.identity_document ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Institución educativa"
            name="educational_institution"
            value={formData.olympian?.educational_institution ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Departamento"
            name="department"
            value={formData.olympian?.department ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Tutor académico"
            name="academic_tutor"
            value={formData.olympian?.academic_tutor ?? ""}
            onChange={handleChange}
          />

          <SelectField
            label="Área"
            name="area_id"
            options={areas}
            value={formData.area_id ?? ""}
            onChange={handleSelectChange}
            placeholder="Seleccionar área"
          />

          <SelectField
            label="Grado"
            name="grade_id"
            options={grades}
            value={formData.grade_id ?? ""}
            onChange={handleSelectChange}
            placeholder="Seleccionar grado"
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
