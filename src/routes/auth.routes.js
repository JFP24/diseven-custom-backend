import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/usuarios.models.js";

const router = Router();

// Registro (crear cuenta)
router.post("/auth/register", authLimiter, validate(registerSchema), register);

// Login (obtener token)
router.post("/auth/login", authLimiter, validate(loginSchema), login);

// Perfil actual (protegido)
router.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(
      req.user.id,
      "-password -resetToken -resetTokenExpiresAt"
    );
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.status(200).json(user);
  })
);

export default router;
