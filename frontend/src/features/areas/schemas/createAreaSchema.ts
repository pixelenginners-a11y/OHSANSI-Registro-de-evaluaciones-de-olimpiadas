import { z } from "zod";

export const createAreaSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  is_group: z.boolean("El grupo es obligatorio"),

  gold: z
    .number()
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo"),

  silver: z
    .number()
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo"),

  bronze: z
    .number()
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo"),

  honor_mentions: z
    .number()
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo"),

  grades: z
    .array(
      z
        .number()
        .int("Cada grado debe ser un número entero")
        .positive("Los grados deben ser positivos")
    )
    .min(1, "Debe incluir al menos un grado")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Los grados no pueden repetirse"
    ),
});

export type CreateAreaInput = z.infer<typeof createAreaSchema>;

export type UpdateAreaSchema = typeof createAreaSchema;

export type UpdateArea = Partial<CreateAreaInput>;
