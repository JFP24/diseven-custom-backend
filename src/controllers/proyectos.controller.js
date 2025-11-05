import mongoose from "mongoose";
import Proyecto from "../models/proyectos.models.js";
import Plantilla from "../models/plantillas.models.js";

export const crearProyecto = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.user);
    console.log(name)
    if (!name?.trim()) return res.status(400).json({ message: "El nombre del proyecto es obligatorio" });
    const proyecto = await Proyecto.create({
      userId: req.user.id, // <<— del token
      name: name.trim(),
    });

    return res.status(201).json({ message: "Proyecto creado", data: proyecto });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Ya tienes un proyecto con ese nombre" });
    return res.status(500).json({ message: "Error interno creando proyecto" });
  }
};

export const listarProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.status(200).json({ data: proyectos });
};

export const actualizarProyectoNombre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });
  if (!name?.trim()) return res.status(400).json({ message: "Nombre obligatorio" });

  // solo del usuario
  const actualizado = await Proyecto.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { name: name.trim() },
    { new: true, runValidators: true }
  );
  if (!actualizado) return res.status(404).json({ message: "Proyecto no encontrado" });
  return res.status(200).json({ message: "Proyecto actualizado", data: actualizado });
};

export const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });

  // borrar SOLO si pertenece al usuario
  const borrado = await Proyecto.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!borrado) return res.status(404).json({ message: "Proyecto no encontrado" });

  await Plantilla.deleteMany({ projectId: id }); // cascada
  return res.status(200).json({ message: "Proyecto eliminado", data: borrado._id });
};
