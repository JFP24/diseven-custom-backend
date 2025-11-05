import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/usuarios.models.js";

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { username, email, image, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Faltan datos obligatorios (username, email, password)" });
    }

    // ¿Email ya existe?
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ msg: "Ya existe un usuario con ese email" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
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
  } catch (error) {
    console.error("Error createUser:", error);

    // choque de índice único en Mongo (email duplicado)
    if (error.code === 11000) {
      return res.status(409).json({ msg: "Ese email ya está registrado" });
    }

    return res.status(500).json({ msg: "Error interno al crear usuario" });
  }
};

// Listar todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -resetToken -resetTokenExpiresAt")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getUsers:", error);
    return res.status(500).json({ msg: "Error interno al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // validar id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const user = await User.findById(
      id,
      "-password -resetToken -resetTokenExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getUserById:", error);
    return res.status(500).json({ msg: "Error interno al obtener usuario" });
  }
};

// Actualizar usuario (username, image, role, password opcional)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const { username, image, role, password } = req.body;

    // armamos objeto dinámico con solo lo que vino
    const updates = {};

    if (username !== undefined) updates.username = username.trim();
    if (image !== undefined) updates.image = image; // puede ser null para limpiar imagen
    if (role !== undefined) updates.role = role;
    if (password !== undefined && password.trim() !== "") {
      updates.password = await bcrypt.hash(password, 10);
      updates.passwordChangedAt = new Date();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msg: "No se enviaron datos para actualizar" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, projection: "-password -resetToken -resetTokenExpiresAt" }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
      user: updated,
    });
  } catch (error) {
    console.error("Error updateUser:", error);
    return res.status(500).json({ msg: "Error interno al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleteUser:", error);
    return res.status(500).json({ msg: "Error interno al eliminar usuario" });
  }
};
