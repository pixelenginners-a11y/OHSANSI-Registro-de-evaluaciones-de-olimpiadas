import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";
import { SelectForm } from "./SelectForm";
import { type Responsable } from "../features/AdministratorUsers";
import { responsableCreateSchema } from "../features/AdministratorUsers/schemas/createResponsibleSchema";
import type { AxiosError } from "axios";
import type { ErrorResponsable } from "../types/Error";

type FormData = z.infer<typeof responsableCreateSchema>;

interface AreaOption {
  label: string;
  value: string | number;
}

interface CreateResponsableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Responsable>) => Promise<void>;
  areaOptions: AreaOption[];
  createResponsableError?: AxiosError<ErrorResponsable, any> | null;
}

export const CreateResponsableModal = ({
  isOpen,
  onClose,
  onSave,
  areaOptions,
  createResponsableError
}: CreateResponsableModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(responsableCreateSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      area_id: "",
    }
  });

  const onSubmit = async (data: FormData) => {
    const dataToSend = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      area_id: Number(data.area_id),
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Nuevo Responsable</h2>

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

          <SelectForm
            name="area_id"
            label="Área"
            control={control}
            options={areaOptions}
            placeholder="Selecciona un área"
            error={errors.area_id}
            className="w-full"
          />

          <InputField
            label="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="Ingresa una contraseña segura"
          />

          {createResponsableError?.response?.data?.message && (
            <span className="text-sm text-center text-red-500 mt-2">
              {createResponsableError.response.data.message}
            </span>
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