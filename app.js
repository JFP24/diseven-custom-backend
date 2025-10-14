import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
//import routes from './src/routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
import morgan from 'morgan';
import compression from 'compression';

app.use(morgan('dev'));
app.use(compression());

// Rutas principales
//app.use('/api', routes);

export default app;
