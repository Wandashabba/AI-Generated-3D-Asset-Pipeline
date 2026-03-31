// server/src/middleware/upload.js
// Multer configuration for image uploads

import multer from 'multer';
import path from 'path';
import { ApiError } from './errorHandler.js';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage(); // Keep in memory for forwarding to APIs

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_TYPES.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
