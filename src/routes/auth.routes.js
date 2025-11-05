import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import User from "../models/usuarios.models.js";

const router = Router();

// Registro (crear cuenta)
router.post("/auth/register", register);

// Login (obtener token)
router.post("/auth/login", login);

// Perfil actual (protegido)
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
      "-password -resetToken -resetTokenExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error en /auth/me:", err);
    res.status(500).json({ msg: "Error interno al obtener perfil" });
  }
});

export default router;
