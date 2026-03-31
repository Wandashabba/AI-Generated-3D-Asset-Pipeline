// server/src/utils/logger.js
// Structured logging utility for the pipeline

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

function formatMessage(level, context, message, data) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    context,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(entry);
}

export const logger = {
  debug: (ctx, msg, data) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) console.debug(formatMessage('DEBUG', ctx, msg, data));
  },
  info: (ctx, msg, data) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) console.info(formatMessage('INFO', ctx, msg, data));
  },
  warn: (ctx, msg, data) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) console.warn(formatMessage('WARN', ctx, msg, data));
  },
  error: (ctx, msg, data) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) console.error(formatMessage('ERROR', ctx, msg, data));
  },
};
