import { useEffect } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "../../../components/InputField";
import { SelectField } from "../../../components/SelectField";
import { inscriptionEditSchema } from "../schemas/InscriptionEditSchema";
import { type Inscription, type InscriptionUpdate } from "../types";
import type { ErrorInscription } from "../../../types/Error";

type Option = {
  label: string;
  value: number;
};

interface EditInscriptionModalProps {
  isOpen: boolean;
  inscription: Inscription | null;
  onClose: () => void;
  onSave: (id: number, data: Partial<InscriptionUpdate>) => Promise<void>;
  areaOptions: Option[];
  gradeOptions: Option[];
  groupOptions: Option[];
  statusOptions: { label: string; value: string }[];
  updateInscriptionError: AxiosError<ErrorInscription, any> | null;
}

type FormData = z.infer<typeof inscriptionEditSchema>;

export const EditInscriptionModal = ({
  isOpen,
  inscription,
  onClose,
  onSave,
  areaOptions,
  gradeOptions,
  groupOptions,
  statusOptions,
  updateInscriptionError,
}: EditInscriptionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(inscriptionEditSchema),
    defaultValues: {
      full_name: "",
      identity_document: "",
      educational_institution: "",
      department: "",
      academic_tutor: "",
      area_id: 0,
      grade_id: 0,
      group_id: undefined,
      status: "inscribed",
    },
  });

  // Convertir opciones al formato que espera SelectField
  const convertOptions = (options: Option[]) =>
    options.map(opt => ({ id: opt.value, name: opt.label }));

  const convertStatusOptions = (options: { label: string; value: string }[]) =>
    options.map(opt => ({ id: opt.value as any, name: opt.label }));

  useEffect(() => {
    if (inscription) {
      reset({
        full_name: inscription.olympian.full_name ?? "",
        identity_document: inscription.olympian.identity_document ?? "",
        educational_institution: inscription.olympian.educational_institution ?? "",
        department: inscription.olympian.department ?? "",
        academic_tutor: inscription.olympian.academic_tutor ?? "",
        area_id: inscription.area_id ?? 0,
        grade_id: inscription.grade_id ?? 0,
        group_id: inscription.group_id ?? undefined,
        status: inscription.status,
      });
    }
  }, [inscription, reset]);

  const onSubmit = async (data: FormData) => {
    if (!inscription) return;

    const dataToSend: Partial<InscriptionUpdate> = {
      olympian: {
        full_name: data.full_name,
        identity_document: data.identity_document,
        educational_institution: data.educational_institution,
        department: data.department,
        academic_tutor: data.academic_tutor,
      },
      area_id: data.area_id,
      grade_id: data.grade_id,
      group_id: data.group_id,
      status: data.status,
    };

    await onSave(inscription.id, dataToSend);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Editar inscripción</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Nombre completo"
              {...register("full_name")}
              error={errors.full_name?.message}
            />

            <InputField
              label="Documento de identidad"
              {...register("identity_document")}
              error={errors.identity_document?.message}
            />
          </div>

          <InputField
            label="Institución educativa"
            {...register("educational_institution")}
            error={errors.educational_institution?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Departamento"
              {...register("department")}
              error={errors.department?.message}
            />

            <InputField
              label="Tutor académico"
              {...register("academic_tutor")}
              error={errors.academic_tutor?.message}
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Área"
              {...register("area_id", { valueAsNumber: true })}
              error={errors.area_id?.message}
              options={convertOptions(areaOptions)}
              placeholder="Selecciona un área"
            />

            <SelectField
              label="Grado"
              {...register("grade_id", { valueAsNumber: true })}
              error={errors.grade_id?.message}
              options={convertOptions(gradeOptions)}
              placeholder="Selecciona un grado"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Grupo"
              {...register("group_id", { valueAsNumber: true })}
              error={errors.group_id?.message}
              options={[{ id: 0, name: "Sin grupo" }, ...convertOptions(groupOptions)]}
              placeholder="Selecciona un grupo"
            />

            <SelectField
              label="Estado"
              {...register("status")}
              error={errors.status?.message}
              options={convertStatusOptions(statusOptions)}
              placeholder="Selecciona un estado"
            />
          </div>

          {updateInscriptionError?.response?.data?.message && (
            <span className="text-sm text-center text-red-500">
              {updateInscriptionError.response.data.message}
            </span>
          )}

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};