import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'dotenv/config';
import Plantilla from "./src/routes/plantillas.routes.js"
import Proyecto from "./src/routes/proyectos.routes.js"
import Usuario from "./src/routes/usuarios.routes.js"
import Auth from "./src/routes/auth.routes.js"

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());



app.use('/api/v1', Plantilla);
app.use('/api/v1', Proyecto);
app.use('/api/v1', Usuario);
app.use('/api/v1', Auth);

export default app;
