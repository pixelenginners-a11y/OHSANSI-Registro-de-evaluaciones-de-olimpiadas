import { useEffect } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";
import { MultiSelectForm } from "./MultiSelectForm";
import { evaluatorEditSchema } from "../features/AdministratorUsers/schemas/editEvaluatorSchema";
import { type EvaluatorBase, type EvaluatorUpdate } from "../features/AdministratorUsers";
import type { ErrorEvaluator } from "../types/Error";

type GradeOption = {
  label: string;
  value: number;
};

interface EditEvaluatorModalProps {
  isOpen: boolean;
  evaluator: EvaluatorBase;
  onClose: () => void;
  onSave: (id: number, data: Partial<EvaluatorUpdate>) => Promise<void>;
  gradeOptions: GradeOption[];
  updateEvaluatorError: AxiosError<ErrorEvaluator, any> | null;
}

type FormData = z.infer<typeof evaluatorEditSchema>;

export const EditEvaluatorModal = ({
  isOpen,
  evaluator,
  onClose,
  onSave,
  gradeOptions,
  updateEvaluatorError,
}: EditEvaluatorModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(evaluatorEditSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      grades: [],
      active: true,
    },
  });

  useEffect(() => {
    if (evaluator) {
      const parsedGradeIds =
        typeof evaluator.grade_ids === "string"
          ? JSON.parse(evaluator.grade_ids)
          : evaluator.grade_ids;

      reset({
        full_name: evaluator.full_name ?? "",
        username: evaluator.username ?? "",
        email: evaluator.email ?? "",
        phone: evaluator.phone ?? "",
        password: "",
        grades: Array.isArray(parsedGradeIds)
          ? parsedGradeIds.map((grade: number | string) => Number(grade))
          : [],
        active: evaluator.active ?? true,
      });
    }
  }, [evaluator, reset]);

  const onSubmit = async (data: FormData) => {
    if (!evaluator) return;

    const dataToSend: Partial<EvaluatorUpdate> & { password?: string } = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      grades: data.grades,
      active: data.active,
    };

    if (data.password && data.password.trim() !== "") {
      dataToSend.password = data.password;
    }
    await onSave(evaluator.id, dataToSend);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Editar evaluador</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <InputField
            label="Nombre completo"
            {...register("full_name")}
            error={errors.full_name?.message}
          />

          <InputField
            label="Nombre de usuario"
            {...register("username")}
            error={errors.username?.message}
          />

          <InputField
            label="Correo electrónico"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <InputField
            label="Teléfono"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <InputField
            label="Contraseña (dejar vacío para mantener actual)"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="Nueva contraseña (opcional)"
          />

          <MultiSelectForm
            name="grades"
            label="Grados"
            control={control}
            options={gradeOptions}
            placeholder="Selecciona los grados"
            error={errors.grades}
            className="w-full"
          />

          {updateEvaluatorError?.response?.data?.message && (
            <span className="text-sm text-center text-red-500">
              {updateEvaluatorError.response.data.message}
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
