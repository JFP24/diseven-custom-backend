import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { config } from "./src/config/env.js";
import { apiLimiter } from "./src/middleware/rateLimit.middleware.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";

import Plantilla from "./src/routes/plantillas.routes.js";
import Proyecto from "./src/routes/proyectos.routes.js";
import Usuario from "./src/routes/usuarios.routes.js";
import Auth from "./src/routes/auth.routes.js";

const app = express();

// Necesario detrás de proxy (Render/Railway/Nginx) para rate-limit por IP real
app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS restringido al/los origen(es) del frontend
const allowAll = config.corsOrigins.includes("*");
app.use(
  cors({
    origin: allowAll ? true : config.corsOrigins,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(compression());

// Healthcheck
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// Rate limit general para toda la API
app.use("/api/v1", apiLimiter);

app.use("/api/v1", Plantilla);
app.use("/api/v1", Proyecto);
app.use("/api/v1", Usuario);
app.use("/api/v1", Auth);

// 404 y manejo de errores centralizado (siempre al final)
app.use(notFound);
app.use(errorHandler);

export default app;
