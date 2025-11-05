import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: [true, "email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      // hash bcrypt
      type: String,
      required: [true, "password es obligatorio"],
      minlength: 10,
      select: false, // <- IMPORTANTÍSIMO: no sale automáticamente en .find()
    },

    image: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    resetToken: {
      type: String,
      default: null,
      select: false, // tampoco quiero que esto salga por defecto
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Convierte el doc a objeto "seguro" para mandarlo al frontend
UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpiresAt;
  return obj;
};

const User = mongoose.model("User", UserSchema);

export default User;
