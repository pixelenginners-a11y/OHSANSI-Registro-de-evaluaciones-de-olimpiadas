import React, { useState, useEffect } from "react";
import { InputField } from "../../../components/InputField";
import { type Olympian, type OlympianUpdate } from "../types";

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
  const [formData, setFormData] = useState<OlympianUpdate>({
    full_name: "",
    identity_document: "",
    legal_guardian_contact: "",
    educational_institution: "",
    department: "",
    school_grade: "",
    academic_tutor: "",
  });

  useEffect(() => {
    if (olympian) {
      setFormData({
        full_name: olympian.full_name ?? "",
        identity_document: olympian.identity_document ?? "",
        legal_guardian_contact: olympian.legal_guardian_contact ?? "",
        educational_institution: olympian.educational_institution ?? "",
        department: olympian.department ?? "",
        school_grade: olympian.school_grade ?? "",
        academic_tutor: olympian.academic_tutor ?? "",
      });
    }
  }, [olympian]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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
            value={formData.full_name ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Documento de identidad"
            name="identity_document"
            value={formData.identity_document ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Contacto del tutor legal"
            name="legal_guardian_contact"
            value={formData.legal_guardian_contact ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Institución educativa"
            name="educational_institution"
            value={formData.educational_institution ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Departamento"
            name="department"
            value={formData.department ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Grado escolar"
            name="school_grade"
            value={formData.school_grade ?? ""}
            onChange={handleChange}
          />

          <InputField
            label="Tutor académico"
            name="academic_tutor"
            value={formData.academic_tutor ?? ""}
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
