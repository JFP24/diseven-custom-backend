import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

// Genera un JWT a partir de un usuario (documento mongoose o plano)
export function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

// Verifica un JWT y devuelve el payload (lanza si es inválido/expirado)
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
