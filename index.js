// index.js
import app from "./app.js";
import { conectarDB } from "./db.js";
import { config } from "./src/config/env.js";

conectarDB().then(() => {
  app.listen(config.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
  });
});
