// server/src/app.js
// Express application setup

import express from 'express';
import cors from 'cors';
import generateRouter from './routes/generate.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info('HTTP', `${req.method} ${req.path}`, {
    query: req.query,
    contentType: req.headers['content-type'],
  });
  next();
});

// ── Routes ────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'AI 3D Asset Pipeline API',
    version: '1.0.0',
    endpoints: {
      generate: 'POST /api/generate',
      health: 'GET /api/generate/health',
    },
  });
});

app.use('/api/generate', generateRouter);

// ── Error Handling ────────────────────────────────────────
app.use(errorHandler);

export default app;
