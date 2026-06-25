import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { proyectoNameSchema } from "../schemas/proyecto.schema.js";
import {
  crearProyecto, listarProyectos, actualizarProyectoNombre, eliminarProyecto
} from "../controllers/proyectos.controller.js";

const router = Router();

router.post("/crearProyecto", requireAuth, validate(proyectoNameSchema), crearProyecto);
router.get("/proyectos", requireAuth, listarProyectos);
router.put("/proyecto/:id", requireAuth, validate(proyectoNameSchema), actualizarProyectoNombre);
router.delete("/proyecto/:id", requireAuth, eliminarProyecto);

export default router;
