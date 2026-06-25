import { z } from "zod";

export const proyectoNameSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(80),
});
