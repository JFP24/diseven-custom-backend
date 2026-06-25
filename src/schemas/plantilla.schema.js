import { z } from "zod";

// Acepta tanto la creación como la actualización de una plantilla.
export const plantillaSchema = z.object({
  projectId: z.string().trim().min(1, "projectId requerido"),
  placeName: z.string().trim().min(1, "Nombre del lugar requerido").max(100),
  plateMode: z.enum(["sencilla", "doble"]).optional().default("sencilla"),
  preview: z.string().nullable().optional(),
  previewThumb: z.string().nullable().optional(),
  snapshot: z.record(z.string(), z.any()).or(z.object({}).passthrough()),
});
