import { z } from "zod";
import { createAreaSchema } from "./createAreaSchema";

export const updateAreaSchema = createAreaSchema.partial();

export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
