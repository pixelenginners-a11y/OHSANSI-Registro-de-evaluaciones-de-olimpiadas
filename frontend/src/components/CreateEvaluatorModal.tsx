import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ErrorEvaluator } from "../types/Error";
import { z } from "zod";
import { InputField } from "./InputField";
import { MultiSelectForm } from "./MultiSelectForm";
import { type EvaluatorCreate, type ResponsableCreate } from "../features/AdministratorUsers";
import { evaluatorCreateSchema } from "../features/AdministratorUsers/schemas/createEvaluatorSchema";

type FormData = z.infer<typeof evaluatorCreateSchema>;

type gradeOptions = {
  value: number;
  label: string;
}[];

interface CreateEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EvaluatorCreate | ResponsableCreate) => Promise<void>;
  gradeOptions: gradeOptions;
  createEvaluatorError: AxiosError<ErrorEvaluator, any> | null;
}

export const CreateEvaluatorModal = ({
  isOpen,
  onClose,
  onSave,
  gradeOptions,
  createEvaluatorError
}: CreateEvaluatorModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(evaluatorCreateSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      grades: [],
    }
  });

  const onSubmit = async (data: FormData) => {
    const dataToSend = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      grades: data.grades,
    };
    await onSave(dataToSend);
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
        <h2 className="text-lg font-semibold mb-4">Crear evaluador</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
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
            label="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="Ingresa una contraseña segura"
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

          {createEvaluatorError?.response?.data?.message && <span className="text-sm text-red-500">{createEvaluatorError.response?.data?.message}</span>}

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