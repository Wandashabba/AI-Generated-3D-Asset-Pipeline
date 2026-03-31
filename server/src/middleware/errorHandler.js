// server/src/middleware/errorHandler.js
// Global error handling middleware

import { logger } from '../utils/logger.js';

/**
 * Custom API error class with status codes.
 * Use this in services to throw meaningful HTTP errors.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

/**
 * Express error-handling middleware (4-arg signature).
 * Catches thrown ApiErrors and unknown errors uniformly.
 */
export function errorHandler(err, req, res, _next) {
  // Determine the response shape
  const statusCode = err.statusCode || 500;
  const isOperational = err instanceof ApiError;

  logger.error('ErrorHandler', err.message, {
    statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    details: err.details,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Internal server error — please try again later.',
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
