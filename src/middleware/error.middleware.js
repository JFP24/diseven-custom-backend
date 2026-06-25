import { isProd } from "../config/env.js";

// 404 — ruta no encontrada
export const notFound = (req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Manejo de errores centralizado
 
export const errorHandler = (err, req, res, next) => {
  // Log en servidor (no exponer detalles al cliente en producción)
  console.error("💥 Error:", err.message);
  if (!isProd) console.error(err.stack);

  // Errores conocidos de Mongo / Mongoose
  if (err.code === 11000) {
    return res.status(409).json({ message: "Recurso duplicado" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Identificador inválido" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Error interno del servidor" : err.message,
  });
};
