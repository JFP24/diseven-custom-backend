# DISEVEN Custom · Backend

API REST para el diseñador de placas DISEVEN. Node.js + Express 5 + MongoDB (Mongoose) con autenticación JWT.

## Requisitos
- Node.js 18+
- Una base de datos MongoDB (Atlas o local)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y completa los valores
npm run dev            # desarrollo (nodemon)
# o
npm start              # producción
```

## Variables de entorno (`.env`)

| Variable        | Descripción                                            |
|-----------------|--------------------------------------------------------|
| `PORT`          | Puerto del servidor (def. 3000)                        |
| `NODE_ENV`      | `development` / `production`                           |
| `MONGODB_URI`   | Cadena de conexión a MongoDB                           |
| `JWT_SECRET`    | Secreto para firmar tokens (largo y aleatorio)         |
| `JWT_EXPIRES_IN`| Caducidad del token (def. `7d`)                        |
| `CORS_ORIGIN`   | Orígenes permitidos, separados por coma (`*` = todos)  |

Genera un `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Estructura

```
app.js                      # configuración de Express (middlewares, rutas)
index.js                    # arranque (conecta DB y levanta el servidor)
db.js                       # conexión a MongoDB
src/
  config/env.js             # carga y valida variables de entorno
  controllers/              # lógica de cada recurso
  middleware/               # auth, validación, rate limit, errores
  models/                   # esquemas Mongoose
  routes/                   # definición de endpoints
  schemas/                  # validación de entrada (zod)
  utils/                    # token JWT, asyncHandler
```

## Endpoints (prefijo `/api/v1`)

### Auth
| Método | Ruta             | Protegido | Descripción            |
|--------|------------------|-----------|------------------------|
| POST   | `/auth/register` | —         | Crear cuenta           |
| POST   | `/auth/login`    | —         | Iniciar sesión         |
| GET    | `/auth/me`       | ✅        | Perfil del usuario     |

### Proyectos
| Método | Ruta               | Descripción              |
|--------|--------------------|--------------------------|
| POST   | `/crearProyecto`   | Crear proyecto           |
| GET    | `/proyectos`       | Listar mis proyectos     |
| PUT    | `/proyecto/:id`    | Renombrar proyecto       |
| DELETE | `/proyecto/:id`    | Eliminar (cascada)       |

### Plantillas
| Método | Ruta                       | Descripción                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/crearPlantilla`          | Guardar plantilla                 |
| GET    | `/plantillas/:projectId`   | Listar plantillas de un proyecto  |
| GET    | `/plantilla/:id`           | Obtener una plantilla             |
| PUT    | `/plantilla/:id`           | Actualizar plantilla              |
| DELETE | `/plantilla/:id`           | Eliminar plantilla                |

### Usuarios (solo admin salvo el propio perfil)
| Método | Ruta          | Descripción           |
|--------|---------------|-----------------------|
| GET    | `/users`      | Listar (admin)        |
| GET    | `/users/:id`  | Ver (admin o propio)  |
| PUT    | `/users/:id`  | Editar (admin o propio) |
| DELETE | `/users/:id`  | Eliminar (admin)      |
| POST   | `/users`      | Crear (admin)         |

### Otros
| Método | Ruta       | Descripción     |
|--------|------------|-----------------|
| GET    | `/health`  | Estado del API  |

Todas las rutas protegidas requieren cabecera `Authorization: Bearer <token>`.

## Seguridad
- Contraseñas con bcrypt; el campo `password` no se devuelve nunca.
- JWT con secreto en entorno (no en el código).
- CORS restringido, `helmet`, rate limiting (estricto en auth).
- Validación de entrada con `zod`.
- Control de propiedad: cada usuario solo accede a sus propios proyectos y plantillas.
- El rol solo lo puede cambiar un admin.
