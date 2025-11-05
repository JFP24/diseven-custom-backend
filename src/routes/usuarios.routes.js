import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser, // opcional: sólo admin
} from "../controllers/usuarios.controller.js";

import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Listar todos los usuarios (solo admin)
router.get("/users", requireAuth, requireRole("admin"), getUsers);

// Obtener un usuario (el admin puede ver a cualquiera, o el propio user puede ver su perfil)
router.get("/users/:id", requireAuth, async (req, res, next) => {
  // si es admin, pasa directo
  if (req.user.role === "admin" || req.user.id === req.params.id) {
    return getUserById(req, res, next);
  }
  return res.status(403).json({ msg: "No tienes permisos para ver este usuario" });
});

// Actualizar usuario
router.put("/users/:id", requireAuth, async (req, res, next) => {
  // admin puede editar a cualquiera
  // usuario normal solo puede editarse a sí mismo
  if (req.user.role === "admin" || req.user.id === req.params.id) {
    return updateUser(req, res, next);
  }
  return res.status(403).json({ msg: "No tienes permisos para editar este usuario" });
});

// Eliminar usuario (solo admin por seguridad)
router.delete("/users/:id", requireAuth, requireRole("admin"), deleteUser);

// Crear usuario arbitrario (como panel admin creando otra cuenta)
router.post("/users", requireAuth, requireRole("admin"), createUser);

export default router;
