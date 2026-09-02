import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// --- MIDDLEWARE ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route nicht gefunden.",
    },
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('Fehler aufgetreten:', err.stack);

  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: 
        status === 500
          ? 'Ein interner Serverfehler ist aufgetreten.'
          : err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend-Server läuft auf http://localhost:${PORT}`);
});