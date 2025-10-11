import z from "zod";

export const EmailSchema = z.email();
export const PhoneSchema = z.string().min(7).max(15).optional();
export const NameSchema = z.string().min(2).max(100);
export const DescriptionSchema = z.string().max(500).optional();

export const StatusSchema = z.enum(["inscrito", "clasificado", "descalificado", "ganador"]);
export const PhaseSchema = z.enum(["clasificatoria", "final"]);
export const BooleanSchema = z.boolean().default(true);