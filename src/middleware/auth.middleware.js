import jwt from "jsonwebtoken";
import User from "../models/usuarios.models.js";

// Verifica token y adjunta req.user
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    // esperamos formato "Bearer token"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Token no enviado o mal formado" });
    }

    const token = parts[1];

    let payload;
    try {
      payload = jwt.verify(token,"SECRET-KEY",);
      // payload = { id, role, iat, exp }
    } catch (err) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }

    // buscamos el usuario en base de datos
    const dbUser = await User.findById(payload.id, "-password -resetToken -resetTokenExpiresAt");
    if (!dbUser) {
      return res.status(401).json({ msg: "Usuario ya no existe" });
    }
    if (!dbUser.isActive) {
      return res.status(403).json({ msg: "Usuario inactivo" });
    }

    // opcional: invalidar tokens viejos si cambió la contraseña
    // ej: si passwordChangedAt > payload.iat => forzar relogin
    if (
      dbUser.passwordChangedAt &&
      Math.floor(new Date(dbUser.passwordChangedAt).getTime() / 1000) >
        payload.iat
    ) {
      return res.status(401).json({
        msg: "La contraseña fue cambiada. Inicia sesión nuevamente.",
      });
    }

    // guardamos info útil en la request
    req.user = {
      id: dbUser._id.toString(),
      role: dbUser.role,
      username: dbUser.username,
      email: dbUser.email,
    };

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ msg: "Error interno de autenticación" });
  }
};

// Middleware de autorización por rol mínimo
export const requireRole = (roleNeeded) => {
  return (req, res, next) => {
    // requireAuth tiene que haber corrido antes
    if (!req.user) {
      return res.status(500).json({ msg: "Falta requireAuth antes de requireRole" });
    }

    // ejemplo simple: sólo admin
    if (req.user.role !== roleNeeded) {
      return res.status(403).json({ msg: "No tienes permisos suficientes" });
    }

    next();
  };
};
