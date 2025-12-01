import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../../../components/InputField";
import { MultiSelectForm } from "../../../components/MultiSelectForm";
import { createAreaSchema } from "../schemas/createAreaSchema";
import type { CreateAreaInput } from "../schemas/createAreaSchema";
import { useGetGrades } from "../../administrar-niveles/hooks";
import { useCreateArea } from "../hooks";

interface CreateAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAreaModal = ({ isOpen, onClose }: CreateAreaModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAreaInput>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: "",
      description: "",
      is_group: false,
      gold: 0,
      silver: 0,
      bronze: 0,
      honor_mentions: 0,
      grades: [],
    },
  });

  const { mutateAsync: createArea, error: errorCreate } = useCreateArea();
  const { data: gradesData } = useGetGrades();

  const gradeOptions = gradesData
    ? gradesData.map((grade) => ({
      label: grade.name,
      value: grade.id,
    }))
    : [];

  const onSubmit = async (data: CreateAreaInput) => {
    const dataToSend = {
      name: data.name,
      description: data.description,
      is_group: data.is_group,
      gold: data.gold ?? null,
      silver: data.silver ?? null,
      bronze: data.bronze ?? null,
      honor_mentions: data.honor_mentions ?? 0,
      grades: data.grades,
    };

    await createArea(dataToSend);
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
        <h2 className="text-lg font-semibold mb-4">Crear Nueva Área</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          <InputField
            label="Nombre"
            type="text"
            {...register("name")}
            error={errors.name?.message}
            required
            disabled={isSubmitting}
            placeholder="Nombre del área"
          />

          <InputField
            label="Descripción"
            type="text"
            {...register("description")}
            error={errors.description?.message}
            disabled={isSubmitting}
            placeholder="Descripción del área"
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

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Parámetros de Medallas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Oro"
                type="number"
                {...register("gold", { valueAsNumber: true })}
                error={errors.gold?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <InputField
                label="Plata"
                type="number"
                {...register("silver", { valueAsNumber: true })}
                error={errors.silver?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <InputField
                label="Bronce"
                type="number"
                {...register("bronze", { valueAsNumber: true })}
                error={errors.bronze?.message}
                disabled={isSubmitting}
                placeholder="0"
              />

              <InputField
                label="Menciones de Honor"
                type="number"
                {...register("honor_mentions", { valueAsNumber: true })}
                error={errors.honor_mentions?.message}
                disabled={isSubmitting}
                placeholder="0"
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="is_group"
                {...register("is_group")}
                className="w-4 h-4 text-primary-dark border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label
                htmlFor="is_group"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Área de grupo
              </label>
            </div>
          </div>

          {errorCreate?.response?.data?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-700 mb-1">
                Error al crear el área
              </p>
              <p className="text-sm text-red-600">{errorCreate.response.data.message}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={handleClose}
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
              {isSubmitting ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
