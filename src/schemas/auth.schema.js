import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(2, "Mínimo 2 caracteres").max(60),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(200),
  image: z.string().url().optional().nullable(),
  // role lo ignoramos en el body por seguridad (se asigna "user" por defecto)
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});
