import bcrypt from "bcryptjs";
import User from "../models/usuarios.models.js";
import { signToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /auth/register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, image } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ msg: "Ese email ya está registrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    image: image || null,
    role: "user", // el rol nunca se toma del body
    isActive: true,
  });

  const token = signToken(newUser);

  return res.status(201).json({
    msg: "Usuario registrado correctamente",
    token,
    user: newUser.toSafeJSON(),
  });
});

// POST /auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true })
    .select("+password")
    .lean();

  if (!user) {
    return res.status(401).json({ msg: "Credenciales inválidas" });
  }

  const passOK = await bcrypt.compare(password, user.password);
  if (!passOK) {
    return res.status(401).json({ msg: "Credenciales inválidas" });
  }

  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

  const token = signToken(user);

  // limpiamos campos sensibles antes de responder
  const { password: _pw, resetToken: _rt, resetTokenExpiresAt: _rte, ...safeUser } = user;

  return res.status(200).json({ msg: "Login exitoso", token, user: safeUser });
});
