import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";
import { SelectForm } from "./SelectForm";
import { type Responsable } from "../features/AdministratorUsers";
import { responsableEditSchema } from "../features/AdministratorUsers/schemas/editResponsibleSchema";

type FormData = z.infer<typeof responsableEditSchema>;

interface AreaOption {
  label: string;
  value: string | number;
}

interface EditResponsableModalProps {
  isOpen: boolean;
  responsable: Responsable | null;
  onClose: () => void;
  onSave: (id: number, data: Partial<Responsable>) => Promise<void>;
  areaOptions: AreaOption[];
}

export const EditResponsableModal = ({
  isOpen,
  responsable,
  onClose,
  onSave,
  areaOptions
}: EditResponsableModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(responsableEditSchema),
    values: responsable ? {
      full_name: responsable.full_name ?? "",
      username: responsable.username ?? "",
      email: responsable.email ?? "",
      phone: responsable.phone ?? "",
      password: "",
      area_id: responsable.area_id ? Number(responsable.area_id) : "",
      active: responsable.active ?? true,
    } : undefined
  });

  const onSubmit = async (data: FormData) => {
    if (!responsable) return;

    const dataToSend: Partial<Responsable> & { password?: string } = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      area_id: Number(data.area_id),
      active: data.active,
    };

    if (data.password && data.password.trim() !== "") {
      dataToSend.password = data.password;
    }

    console.log("Saving data:", dataToSend);
    await onSave(responsable.id, dataToSend);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Editar responsable</h2>

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

          <SelectForm
            name="area_id"
            label="Área"
            control={control}
            options={areaOptions}
            placeholder="Selecciona un área"
            error={errors.area_id}
            className="w-full"
          />

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