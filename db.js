import mongoose from "mongoose";
import { config } from "./src/config/env.js";

export const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`🟢 MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
