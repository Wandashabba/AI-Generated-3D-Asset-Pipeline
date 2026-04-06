// server/src/services/tripoService.js
// Tripo3D API integration — Text-to-3D & Image-to-3D
//
// Architecture:
//   1. Submit a generation task (text or image prompt)
//   2. Poll the task status until success / failed
//   3. Return the GLB download URL
//
// Docs: https://platform.tripo3d.ai/docs

import axios from 'axios';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const TRIPO_BASE = 'https://api.tripo3d.ai/v2/openapi';
const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_DURATION_MS = 300_000;

function tripoClient() {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, 'TRIPO_API_KEY is not configured. Add it to your .env file.');
  }
  return axios.create({
    baseURL: TRIPO_BASE,
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 30_000,
  });
}

async function pollTask(taskId, onProgress) {
  const client = tripoClient();
  const startTime = Date.now();

  logger.info('TripoService', `Polling task ${taskId}`);

  while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
    const { data } = await client.get(`/task/${taskId}`);
    const task = data.data;

    logger.debug('TripoService', `Task ${taskId} status: ${task.status}`, {
      progress: task.progress,
    });

    if (onProgress && typeof task.progress === 'number') {
      onProgress(task.progress);
    }

    switch (task.status) {
      case 'success':
        logger.info('TripoService', `Task ${taskId} completed`, {
          duration: Date.now() - startTime,
          outputKeys: Object.keys(task.output || {}),
        });
        return task;

      case 'failed':
        throw new ApiError(502, `3D generation failed: ${task.error?.message || 'Unknown error'}`, { taskId });

      case 'cancelled':
        throw new ApiError(502, '3D generation task was cancelled.', { taskId });

      default:
        // queued, running — keep polling
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  throw new ApiError(504, `3D generation timed out after ${MAX_POLL_DURATION_MS / 1000}s`, { taskId });
}

/**
 * Generate a 3D model from a text prompt.
 * @param {string} prompt
 * @param {object} options
 * @returns {Promise<{glbUrl: string, thumbnailUrl: string, taskId: string}>}
 */
export async function textTo3D(prompt, options = {}) {
  const client = tripoClient();

  logger.info('TripoService', 'Submitting text-to-3D task', { prompt });

  const { data } = await client.post('/task', {
    type: 'text_to_model',
    prompt,
  });

  const taskId = data.data.task_id;
  logger.info('TripoService', `Task created: ${taskId}`);

  const result = await pollTask(taskId, options.onProgress);

  // Tripo v2 returns GLB at output.pbr_model (string) or output.model
  const glbUrl = result.output?.pbr_model || result.output?.model;
  if (!glbUrl) {
    throw new ApiError(502, 'Tripo3D returned no GLB URL', { taskId, outputKeys: Object.keys(result.output || {}) });
  }

  return {
    glbUrl: typeof glbUrl === 'string' ? glbUrl : glbUrl,
    thumbnailUrl: result.output?.rendered_image || null,
    taskId,
  };
}

/**
 * Generate a 3D model from an uploaded image.
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 * @param {object} options
 * @returns {Promise<{glbUrl: string, thumbnailUrl: string, taskId: string}>}
 */
export async function imageTo3D(imageBuffer, mimeType, options = {}) {
  const client = tripoClient();

  logger.info('TripoService', 'Uploading image for image-to-3D', { mimeType });

  // Step 1: Upload the image to get a token
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: mimeType });
  formData.append('file', blob, 'upload.png');

  const uploadRes = await client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const imageToken = uploadRes.data.data.image_token;

  // Step 2: Submit image-to-3D task
  const { data } = await client.post('/task', {
    type: 'image_to_model',
    file: { type: 'jpg', file_token: imageToken },
  });

  const taskId = data.data.task_id;
  logger.info('TripoService', `Image task created: ${taskId}`);

  const result = await pollTask(taskId, options.onProgress);

  const glbUrl = result.output?.pbr_model || result.output?.model;
  if (!glbUrl) {
    throw new ApiError(502, 'Tripo3D returned no GLB URL', { taskId, outputKeys: Object.keys(result.output || {}) });
  }

  return {
    glbUrl: typeof glbUrl === 'string' ? glbUrl : glbUrl,
    thumbnailUrl: result.output?.rendered_image || null,
    taskId,
  };
}
