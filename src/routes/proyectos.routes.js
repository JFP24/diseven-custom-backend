import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { crearProyecto, listarProyectos, actualizarProyectoNombre, eliminarProyecto } from "../controllers/proyectos.controller.js";

const router = Router();

router.post("/crearProyecto", requireAuth, crearProyecto);
router.get("/proyectos", requireAuth, listarProyectos);
router.put("/proyecto/:id", requireAuth, actualizarProyectoNombre);
router.delete("/proyecto/:id", requireAuth, eliminarProyecto);

export default router;
