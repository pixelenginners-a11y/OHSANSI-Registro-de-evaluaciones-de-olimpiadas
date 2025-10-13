import { z } from "zod";

// Schema para EDITAR (password opcional)
export const evaluatorEditSchema = z.object({
  full_name: z
    .string()
    .min(1, "El nombre completo es obligatorio.")
    .max(100, "El nombre completo no puede superar 100 caracteres."),

  username: z
    .string()
    .min(1, "El nombre de usuario es obligatorio.")
    .regex(/^[A-Za-z0-9_-]+$/, "Solo se permiten letras, números, guiones y guiones bajos.")
    .max(50, "El nombre de usuario no puede superar 50 caracteres."),

  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("El correo electrónico no es válido.")
    .max(100, "El correo electrónico no puede superar 100 caracteres."),

  phone: z
    .string()
    .max(20, "El teléfono no puede superar 20 caracteres.")
    .refine(
      (val) => val === "" || /^\d{7,}$/.test(val.replace(/\D/g, "")),
      "El teléfono debe tener al menos 7 dígitos."
    ),

  password: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(val),
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
    ),

  area_id: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== undefined && val !== null,
      "Debe seleccionar un área válida."
    ),

  active: z.boolean(),
});

// Schema para CREAR (password obligatorio)
export const evaluatorCreateSchema = z.object({
  full_name: z
    .string()
    .min(1, "El nombre completo es obligatorio.")
    .max(100, "El nombre completo no puede superar 100 caracteres."),

  username: z
    .string()
    .min(1, "El nombre de usuario es obligatorio.")
    .regex(/^[A-Za-z0-9_-]+$/, "Solo se permiten letras, números, guiones y guiones bajos.")
    .max(50, "El nombre de usuario no puede superar 50 caracteres."),

  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("El correo electrónico no es válido.")
    .max(100, "El correo electrónico no puede superar 100 caracteres."),

  phone: z
    .string()
    .max(20, "El teléfono no puede superar 20 caracteres.")
    .refine(
      (val) => val === "" || /^\d{7,}$/.test(val.replace(/\D/g, "")),
      "El teléfono debe tener al menos 7 dígitos."
    ),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
    ),

  area_id: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== undefined && val !== null,
      "Debe seleccionar un área válida."
    ),

  active: z.boolean(),
});

export type EvaluatorEditFormData = z.infer<typeof evaluatorEditSchema>;
export type EvaluatorCreateFormData = z.infer<typeof evaluatorCreateSchema>;