import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// aquí irían tus rutas reales
// app.use('/api', routes);

// ✅ rutas de verificación
app.get('/', (_req, res) => res.send('API Diseven OK'));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
