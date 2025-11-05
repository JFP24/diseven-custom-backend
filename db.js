// db/conexion.js
import mongoose from 'mongoose';

export const conectarDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://disevenInventario:5G6B21jpQc5os9mz@inventariodiseven.ofaaybz.mongodb.net/  "  );
    console.log(`🟢 MongoDB Atlas conectado en: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error);
    process.exit(1);
  }
};
