// client/src/utils/constants.js
// App-wide constants

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const PIPELINE_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  GENERATING_3D: 'generating_3d',
  PROCESSING: 'processing',
  GENERATING_SUMMARY: 'generating_summary',
  COMPLETE: 'complete',
  ERROR: 'error',
};

export const PIPELINE_STEPS = [
  { key: PIPELINE_STATES.UPLOADING, label: 'Submitting request', icon: '📤' },
  { key: PIPELINE_STATES.GENERATING_3D, label: 'Generating 3D model', icon: '🧊' },
  { key: PIPELINE_STATES.PROCESSING, label: 'Processing GLB asset', icon: '⚙️' },
  { key: PIPELINE_STATES.GENERATING_SUMMARY, label: 'Writing educational summary', icon: '📝' },
  { key: PIPELINE_STATES.COMPLETE, label: 'Complete!', icon: '✅' },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
