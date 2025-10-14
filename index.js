import app from './app.js';
// import connectDB from './db.js';

// Configuración sin .env
const PORT = 3000;
const HOST = '0.0.0.0';

// connectDB();

app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
});
