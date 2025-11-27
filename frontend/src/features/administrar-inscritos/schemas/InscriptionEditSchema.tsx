import { z } from "zod";

export const inscriptionEditSchema = z.object({
  full_name: z.string().min(1, "El nombre completo es requerido"),
  identity_document: z.string().min(1, "El documento de identidad es requerido"),
  educational_institution: z.string().min(1, "La institución educativa es requerida"),
  department: z.string().min(1, "El departamento es requerido"),
  academic_tutor: z.string().optional(),
  area_id: z.number().min(1, "El área es requerida"),
  grade_id: z.number().min(1, "El grado es requerido"),
  group_id: z.number().optional().nullable(),
  status: z.enum(["pending", "approved", "rejected", "inscribed"]),
});
