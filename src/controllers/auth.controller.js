import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/usuarios.models.js";

// Helper para generar JWT
function signToken(user) {
  // user: documento mongoose
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    "SECRET-KEY",
    {
      expiresIn: "7d", 
    }
  );
}

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password, image, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Faltan datos obligatorios (username, email, password)" });
    }

    
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ msg: "Ese email ya está registrado" });
    }

    // hashear pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear user
    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      image: image || null,
      role: role || "user", 
      isActive: true,
    });

    const token = signToken(newUser);

    return res.status(201).json({
      msg: "Usuario registrado correctamente",
      token,
      user: newUser.toSafeJSON(),
    });
  } catch (err) {
    console.error("Error register:", err);
    if (err.code === 11000) {
      return res.status(409).json({ msg: "Ese email ya está registrado" });
    }
    return res.status(500).json({ msg: "Error interno en registro" });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validaciones
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Faltan credenciales (email, password)" });
    }

    // buscamos el usuario e incluimos el password hash
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    })
      .select("+password") // <- forzamos incluir password
      .lean(); // .lean() para obtener objeto plano
      

    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // comparar contraseña
    const passOK = await bcrypt.compare(password, user.password);
    if (!passOK) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // si quieres, marcamos lastLoginAt
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // generamos token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
     "SECRET-KEY",
      {
        expiresIn: "7d",
      }
    );

    // limpiamos campos sensibles antes de responder
    const { password: _pw, resetToken, resetTokenExpiresAt, ...safeUser } = user;
      //console.log(safeUser)
    return res.status(200).json({
      msg: "Login exitoso",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Error login:", err);
    return res.status(500).json({ msg: "Error interno en login" });
  }
};
