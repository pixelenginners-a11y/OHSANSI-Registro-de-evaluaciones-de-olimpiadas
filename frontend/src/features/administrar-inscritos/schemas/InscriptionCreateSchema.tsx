import { z } from "zod";

export const inscriptionCreateSchema = z.object({
  olympian: z.object({
    full_name: z.string().min(1, "El nombre es obligatorio"),
    identity_document: z.string().min(1, "El documento de identidad es obligatorio"),
    educational_institution: z.string().min(1, "La unidad educativa es obligatoria"),
    department: z.string().min(1, "El departamento es obligatorio"),
    academic_tutor: z.string().optional().nullable(),
  }),

  area_id: z.union([z.string(), z.number()])
    .refine((v) => v !== "" && v !== null, {
      message: "El área es obligatoria",
    }),

  grade_id: z.union([z.string(), z.number()])
    .refine((v) => v !== "" && v !== null, {
      message: "El grado es obligatorio",
    }),

  status: z.union([z.string(), z.number()]).optional(),

  group_name: z.string().optional().nullable(),
});
