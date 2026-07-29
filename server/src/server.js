import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE-EK ---
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));

// Stripe Webhook raw parser
app.use('/api/v1/webhook/stripe', express.raw({ type: 'application/json' }));

// JSON parser minden más végponthoz
app.use(express.json());

// --- VÉGPONTOK ---
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// --- GLOBÁLIS HIBAKEZELŐ ---
app.use((err, req, res, next) => {
  console.error('Fehler aufgetreten:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Ein interner Serverfehler ist aufgetreten.',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend-Server läuft auf http://localhost:${PORT}`);
});