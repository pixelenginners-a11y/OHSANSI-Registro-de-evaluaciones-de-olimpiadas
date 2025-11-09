import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";
import { SelectForm } from "./SelectForm";
import { type CreateListingData } from "../features/lists/types/listing";

const createListingSchema = z.object({
  name: z.string()
    .min(1, "El nombre de la lista es obligatorio.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  area_id: z.string().min(1, "El área es obligatoria."),
  grade_id: z.string().min(1, "El grado es obligatorio."),

  type: z.string().min(1, "El tipo de lista es obligatorio."),

  description: z.string()
    .max(1000, "La descripción no puede superar los 1000 caracteres.")
    .optional()
    .default(""),

  is_published: z.boolean().optional().default(false),
  visibility: z.enum(["publico", "privado", "restringido"])
    .optional()
    .default("publico"),
});

type FormData = {
  name: string;
  area_id: string;
  grade_id: string;
  type: string;
  description?: string;
  is_published?: boolean;
  visibility?: 'publico' | 'privado' | 'restringido';
};

interface OptionType {
  label: string;
  value: string | number;
}

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateListingData) => Promise<void>;
  areaOptions: OptionType[];
  gradeOptions: OptionType[];
}

export const CreateListingModal = ({
  isOpen,
  onClose,
  onSave,
  areaOptions,
  gradeOptions,
}: CreateListingModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      name: "",
      area_id: "",
      grade_id: "",
      type: "",
      description: "",
      is_published: false,
      visibility: "publico",
    },
  });

  const onSubmit = async (data: FormData) => {
    const validTypes = ['', 'concursantes', 'clasificados', 'no_clasificados', 'desclasificados', 'premiados', 'certificados', 'ceremonia', 'publicacion'] as const;

    if (!validTypes.includes(data.type as any)) {
      console.error("Tipo de lista inválido");
      return;
    }

    const dataToSend: CreateListingData = {
      name: data.name,
      area_id: Number(data.area_id),
      grade_id: Number(data.grade_id),
      type: data.type as CreateListingData['type'],
      description: data.description,
      is_published: data.is_published,
      visibility: data.visibility,
    };

    console.log("Creando lista:", dataToSend);
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Crear Lista</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <InputField
            label="Nombre de la lista"
            {...register("name")}
            error={errors.name?.message}
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
            name="type"
            label="Tipo de lista"
            control={control}
            options={[
              { label: "Selecciona un tipo", value: "" },
              { label: "Concursantes", value: "concursantes" },
              { label: "Clasificados", value: "clasificados" },
              { label: "No Clasificados", value: "no_clasificados" },
              { label: "Desclasificados", value: "desclasificados" },
              { label: "Premiados", value: "premiados" },
              { label: "Certificados", value: "certificados" },
              { label: "Ceremonia", value: "ceremonia" },
              { label: "Publicación", value: "publicacion" },
            ]}
            placeholder="Selecciona un tipo"
            error={errors.type}
            className="w-full"
          />

          <InputField
            label="Descripción"
            {...register("description")}
            error={errors.description?.message}
          />

          {/* <SelectForm
            name="visibility"
            label="Visibilidad"
            control={control}
            options={[
              { label: "Público", value: "publico" },
              { label: "Privado", value: "privado" },
              { label: "Restringido", value: "restringido" },
            ]}
            placeholder="Selecciona visibilidad"
            error={errors.visibility}
            className="w-full"
          /> */}

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