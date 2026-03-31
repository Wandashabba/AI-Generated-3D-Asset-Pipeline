// server/server.js
// Entry point — loads environment and starts the server

import 'dotenv/config';
import app from './src/app.js';
import { logger } from './src/utils/logger.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info('Server', `🚀 API server running on http://localhost:${PORT}`);
  logger.info('Server', `Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('Server', `Meshy API: ${process.env.MESHY_API_KEY ? '✓ configured' : '✗ missing'}`);
  logger.info('Server', `Gemini API: ${process.env.GEMINI_API_KEY ? '✓ configured' : '✗ missing'}`);
});
