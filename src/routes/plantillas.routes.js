import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { plantillaSchema } from "../schemas/plantilla.schema.js";
import {
  guardarPlantilla, listarPlantillasPorProyecto, obtenerPlantillaPorId,
  actualizarPlantilla, eliminarPlantilla
} from "../controllers/plantillas.controller.js";

const router = Router();

router.post("/crearPlantilla", requireAuth, validate(plantillaSchema), guardarPlantilla);
router.get("/plantillas/:projectId", requireAuth, listarPlantillasPorProyecto);
router.get("/plantilla/:id", requireAuth, obtenerPlantillaPorId);
router.put("/plantilla/:id", requireAuth, validate(plantillaSchema), actualizarPlantilla);
router.delete("/plantilla/:id", requireAuth, eliminarPlantilla);

export default router;
