import { z } from "zod";

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
    .email()
    .min(1, "El correo electrónico es obligatorio.")
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

  grades: z
    .array(z.union([z.string(), z.number()]))
    .min(1, "Debe seleccionar al menos un nivel."),
});