import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/usuarios.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SAFE_PROJECTION = "-password -resetToken -resetTokenExpiresAt";

// Crear usuario (solo admin)
export const createUser = asyncHandler(async (req, res) => {
  const { username, email, image, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Faltan datos obligatorios (username, email, password)" });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ msg: "Ya existe un usuario con ese email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    image: image || null,
    role: role || "user",
    isActive: true,
  });

  return res.status(201).json({
    msg: "Usuario creado correctamente",
    user: newUser.toSafeJSON(),
  });
});

// Listar todos los usuarios
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, SAFE_PROJECTION).sort({ createdAt: -1 });
  return res.status(200).json(users);
});

// Obtener un usuario por ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const user = await User.findById(id, SAFE_PROJECTION);
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  return res.status(200).json(user);
});

// Actualizar usuario (username, image, role*, password opcional)
// *El rol SOLO lo puede cambiar un admin (evita escalada de privilegios).
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const { username, image, role, password } = req.body;
  const updates = {};

  if (username !== undefined) updates.username = username.trim();
  if (image !== undefined) updates.image = image; // null limpia la imagen

  // Solo un admin puede modificar el rol.
  if (role !== undefined && req.user.role === "admin") {
    updates.role = role;
  }

  if (password !== undefined && password.trim() !== "") {
    if (password.trim().length < 8) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
    }
    updates.password = await bcrypt.hash(password, 10);
    updates.passwordChangedAt = new Date();
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ msg: "No se enviaron datos para actualizar" });
  }

  const updated = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    projection: SAFE_PROJECTION,
  });

  if (!updated) return res.status(404).json({ msg: "Usuario no encontrado" });

  return res.status(200).json({
    msg: "Usuario actualizado correctamente",
    user: updated,
  });
});

// Eliminar usuario (solo admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID inválido" });
  }

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ msg: "Usuario no encontrado" });

  return res.status(200).json({ msg: "Usuario eliminado exitosamente" });
});
