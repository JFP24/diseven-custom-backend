import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`❌ Falta la variable de entorno obligatoria: ${name}`);
    console.error("   Crea un archivo .env basándote en .env.example");
    process.exit(1);
  }
  return value;
}

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: required("MONGODB_URI"),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Lista de orígenes permitidos para CORS (separados por coma). "*" = todos.
  corsOrigins: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

export const isProd = config.nodeEnv === "production";
