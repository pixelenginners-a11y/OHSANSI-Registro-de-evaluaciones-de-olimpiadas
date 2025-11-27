import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InputField } from "./InputField";
import { SelectForm } from "./SelectForm";

import {
  inscriptionCreateSchema
} from "../features/administrar-inscritos/schemas/InscriptionCreateSchema";

import type { AxiosError } from "axios";
import type { ErrorInscription } from "../types/Error";
import type { InscriptionCreate } from "../features/administrar-inscritos/types/inscriptions";

type FormData = z.infer<typeof inscriptionCreateSchema>;

interface Option {
  value: number | string;
  label: string;
}

interface CreateInscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InscriptionCreate) => Promise<void>;
  areaOptions: Option[];
  gradeOptions: Option[];
  statusOptions: Option[];
  createError?: AxiosError<ErrorInscription, any> | null;
}

export const CreateInscriptionModal = ({
  isOpen,
  onClose,
  onSave,
  areaOptions,
  gradeOptions,
  statusOptions,
  createError
}: CreateInscriptionModalProps) => {

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(inscriptionCreateSchema),
    defaultValues: {
      olympian: {
        full_name: "",
        identity_document: "",
        educational_institution: "",
        department: "",
        academic_tutor: ""
      },
      area_id: "",
      grade_id: "",
      status: "",
      group_name: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    const payload: InscriptionCreate = {
      olympian: {
        full_name: data.olympian.full_name,
        identity_document: data.olympian.identity_document,
        educational_institution: data.olympian.educational_institution,
        department: data.olympian.department,
        academic_tutor: data.olympian.academic_tutor || ""
      },
      area_id: Number(data.area_id),
      grade_id: Number(data.grade_id),
      status: data.status === "" ? undefined : String(data.status),
      group_name: data.group_name || undefined
    };

    await onSave(payload);

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Nueva Inscripción</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          <InputField
            label="Nombre completo"
            {...register("olympian.full_name")}
            error={errors.olympian?.full_name?.message}
          />

          <InputField
            label="Documento de identidad"
            {...register("olympian.identity_document")}
            error={errors.olympian?.identity_document?.message}
          />

          <InputField
            label="Unidad educativa"
            {...register("olympian.educational_institution")}
            error={errors.olympian?.educational_institution?.message}
          />

          <InputField
            label="Departamento"
            {...register("olympian.department")}
            error={errors.olympian?.department?.message}
          />

          <InputField
            label="Tutor académico (opcional)"
            {...register("olympian.academic_tutor")}
            error={errors.olympian?.academic_tutor?.message}
          />

          <SelectForm
            name="area_id"
            label="Área"
            control={control}
            options={areaOptions}
            placeholder="Selecciona un área"
            error={errors.area_id}
            className="w-full"
          />

          <SelectForm
            name="grade_id"
            label="Grado"
            control={control}
            options={gradeOptions}
            placeholder="Selecciona un grado"
            error={errors.grade_id}
            className="w-full"
          />

          <SelectForm
            name="status"
            label="Estado"
            control={control}
            options={statusOptions}
            placeholder="Selecciona un estado"
            error={errors.status}
            className="w-full"
          />

          <InputField
            label="Grupo (opcional)"
            {...register("group_name")}
            error={errors.group_name?.message}
          />

          {createError?.response?.data?.message && (
            <span className="text-sm text-red-500 block text-center mt-2">
              {createError.response?.data?.message}
            </span>
          )}

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
