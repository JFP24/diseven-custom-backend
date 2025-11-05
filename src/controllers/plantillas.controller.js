import mongoose from "mongoose";
import Plantilla from "../models/plantillas.models.js";
import Proyecto from "../models/proyectos.models.js";

export const guardarPlantilla = async (req, res) => {
  try {
    const { projectId, placeName, plateMode, preview, previewThumb, snapshot } = req.body;
    if (!projectId || !placeName || !snapshot) return res.status(400).json({ message: "Faltan campos" });

    // validar que el proyecto es del usuario
    const proyecto = await Proyecto.findOne({ _id: projectId, userId: req.user.id });
    if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

    const cleanPlace = placeName.trim();

    const yaExiste = await Plantilla.findOne({ projectId, placeName: cleanPlace });
    if (yaExiste) {
      return res.status(409).json({ message: "Ya existe una plantilla con ese lugar en este proyecto", data: yaExiste });
    }

    const nueva = await Plantilla.create({
      userId: req.user.id,
      projectId,
      placeName: cleanPlace,
      plateMode: plateMode || "sencilla",
      preview: preview ?? null,
      previewThumb: previewThumb ?? null,
      snapshot,
      savedAt: new Date(),
    });

    return res.status(201).json({ message: "Plantilla creada", data: nueva });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Duplicado por índice único" });
    return res.status(500).json({ message: "Error interno guardando plantilla" });
  }
};

export const listarPlantillasPorProyecto = async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: "projectId inválido" });

  // comprobar dueño del proyecto
  const proyecto = await Proyecto.findOne({ _id: projectId, userId: req.user.id });
  if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

  const plantillas = await Plantilla.find(
    { projectId },
    { placeName: 1, plateMode: 1, previewThumb: 1, savedAt: 1 }
  ).sort({ updatedAt: -1 });

  return res.status(200).json({ projectId, count: plantillas.length, plantillas });
};

export const obtenerPlantillaPorId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });

  // Solo plantillas del usuario
  const plantilla = await Plantilla.findOne({ _id: id, userId: req.user.id });
  if (!plantilla) return res.status(404).json({ message: "No encontrada" });

  return res.status(200).json({ message: "OK", data: plantilla });
};

export const actualizarPlantilla = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });

  const { projectId, placeName, plateMode, preview, previewThumb, snapshot } = req.body;
  if (!projectId || !placeName || !snapshot) return res.status(400).json({ message: "Faltan campos" });

  // validar proyecto y ownership
  const proyecto = await Proyecto.findOne({ _id: projectId, userId: req.user.id });
  if (!proyecto) return res.status(404).json({ message: "Proyecto no encontrado" });

  const updated = await Plantilla.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    {
      projectId,
      placeName: placeName.trim(),
      plateMode: plateMode || "sencilla",
      preview: preview ?? null,
      previewThumb: previewThumb ?? null,
      snapshot,
      savedAt: new Date(),
    },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Plantilla no encontrada" });
  return res.status(200).json({ message: "Plantilla actualizada", data: updated });
};

export const eliminarPlantilla = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });

  const borrada = await Plantilla.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!borrada) return res.status(404).json({ message: "Plantilla no encontrada" });
  return res.status(200).json({ message: "Plantilla eliminada", data: borrada._id });
};
