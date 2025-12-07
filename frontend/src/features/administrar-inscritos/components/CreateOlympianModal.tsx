import React, { useState } from "react";
import { InputField } from "../../../components/InputField";
import { type OlympianCreate } from "../types";
import { usePhaseGuard } from '../../../hooks/usePhaseGuard';
import { useNavigate } from '@tanstack/react-router';

interface CreateOlympianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OlympianCreate) => Promise<void>;
}

export const CreateOlympianModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateOlympianModalProps) => {
  const [formData, setFormData] = useState<OlympianCreate>({
    full_name: "",
    identity_document: "",
    legal_guardian_contact: "",
    educational_institution: "",
    department: "",
    school_grade: "",
    academic_tutor: "",
  });

  const { allowed, loading } = usePhaseGuard('registrar_inscrito');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !allowed) {
      navigate({ to: '/public/fase-no-permitida' });
    }
  }, [allowed, loading, navigate]);

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

    console.log("Creating olympian with data:", formData);
    await onSave(formData);

    setFormData({
      full_name: "",
      identity_document: "",
      legal_guardian_contact: "",
      educational_institution: "",
      department: "",
      school_grade: "",
      academic_tutor: "",
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      full_name: "",
      identity_document: "",
      legal_guardian_contact: "",
      educational_institution: "",
      department: "",
      school_grade: "",
      academic_tutor: "",
    });
    onClose();
  };

  if (!isOpen) return null;
  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Crear inscrito</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField
            label="Nombre completo"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Documento de identidad"
            name="identity_document"
            value={formData.identity_document}
            onChange={handleChange}
            required
          />

          <InputField
            label="Contacto del tutor legal"
            name="legal_guardian_contact"
            value={formData.legal_guardian_contact}
            onChange={handleChange}
            required
          />

          <InputField
            label="Institución educativa"
            name="educational_institution"
            value={formData.educational_institution}
            onChange={handleChange}
            required
          />

          <InputField
            label="Departamento"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <InputField
            label="Grado escolar"
            name="school_grade"
            value={formData.school_grade}
            onChange={handleChange}
            required
          />

          <InputField
            label="Tutor académico"
            name="academic_tutor"
            value={formData.academic_tutor || ""}
            onChange={handleChange}
          />

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
