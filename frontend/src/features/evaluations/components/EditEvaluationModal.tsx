import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type EditEvaluationForm = {
  score: number;
  description?: string;
  status: "pendiente" | "clasificado" | "no_clasificado" | "desclasificado";
};

export type Evaluation = {
  id: number;
  full_name: string | null;
  identity_document: string | null;
  grade_name: string | null;
  area_name: string | null;
  group_name: string | null;
  phase: string | null;
  status: string | null;
  score: number | null;
  description: string | null;
  is_group: boolean;
};

const editEvaluationSchema = z.object({
  score: z
    .number({ message: "Debe ser un número" })
    .min(0, { message: "El puntaje mínimo es 0" })
    .max(100, { message: "El puntaje máximo es 100" }),
  description: z.string().max(255).optional(),
  status: z.enum(["pendiente", "clasificado", "no_clasificado", "desclasificado"]),
});

export interface EditEvaluationModalProps {
  evaluation: Evaluation;
  onClose: () => void;
  onSave: (data: EditEvaluationForm) => Promise<void> | void;
}

export const EditEvaluationModal: React.FC<EditEvaluationModalProps> = ({
  evaluation,
  onClose,
  onSave,
}) => {
  const defaultStatus: EditEvaluationForm["status"] =
    ["pendiente", "clasificado", "no_clasificado", "desclasificado"].includes(
      evaluation.status ?? ""
    )
      ? (evaluation.status as EditEvaluationForm["status"])
      : "pendiente";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditEvaluationForm>({
    resolver: zodResolver(editEvaluationSchema),
    defaultValues: {
      score: Number(evaluation.score ?? 0),
      description: evaluation.description ?? "",
      status: defaultStatus,
    },
  });

  const handleFormSubmit = async (data: EditEvaluationForm) => {
    await onSave(data);
    reset(data);
    onClose();
  };

  if (!evaluation) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Editar Evaluación: {evaluation.is_group ? evaluation.group_name : evaluation.full_name}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">

          <div>
            <label className="text-sm font-medium block mb-1">Puntaje</label>
            <input
              type="number"
              min={0}
              max={100}
              {...register("score", { valueAsNumber: true })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.score && (
              <p className="text-xs text-red-500 mt-1">{errors.score.message}</p>
            )}
          </div>


          <div>
            <label className="text-sm font-medium block mb-1">Descripción</label>
            <textarea
              {...register("description")}
              className="w-full border rounded px-2 py-1"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>


          <div>
            <label className="text-sm font-medium block mb-1">Estado</label>
            <select {...register("status")} className="w-full border rounded px-2 py-1">
              <option value="pendiente">Pendiente</option>
              <option value="clasificado">Clasificado</option>
              <option value="no_clasificado">No Clasificado</option>
              <option value="desclasificado">Desclasificado</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>


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
