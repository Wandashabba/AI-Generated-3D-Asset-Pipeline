// server/src/services/meshyService.js
// Meshy.ai API integration — Text-to-3D & Image-to-3D
//
// Architecture:
//   1. Submit a generation task (text or image prompt)
//   2. Poll the task status until SUCCEEDED / FAILED / EXPIRED
//   3. Return the GLB download URL
//
// Docs: https://docs.meshy.ai

import axios from 'axios';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const MESHY_BASE = 'https://api.meshy.ai/openapi/v2';
const POLL_INTERVAL_MS = 5_000;      // 5 seconds between polls
const MAX_POLL_DURATION_MS = 300_000; // 5 minutes max wait

function meshyClient() {
  const apiKey = process.env.MESHY_API_KEY;
  if (!apiKey || apiKey === 'your_meshy_api_key_here') {
    throw new ApiError(500, 'MESHY_API_KEY is not configured. Add it to your .env file.');
  }
  return axios.create({
    baseURL: MESHY_BASE,
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 30_000,
  });
}

/**
 * Poll a Meshy task until it resolves.
 * @param {string} taskId - The Meshy task ID
 * @param {string} taskType - 'text-to-3d' or 'image-to-3d'
 * @param {(progress: number) => void} onProgress - Optional progress callback
 * @returns {Promise<object>} - Completed task object
 */
async function pollTask(taskId, taskType, onProgress) {
  const client = meshyClient();
  const endpoint = `/${taskType}/${taskId}`;
  const startTime = Date.now();

  logger.info('MeshyService', `Polling task ${taskId}`, { taskType });

  while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
    const { data } = await client.get(endpoint);

    logger.debug('MeshyService', `Task ${taskId} status: ${data.status}`, {
      progress: data.progress,
    });

    if (onProgress && typeof data.progress === 'number') {
      onProgress(data.progress);
    }

    switch (data.status) {
      case 'SUCCEEDED':
        logger.info('MeshyService', `Task ${taskId} completed`, {
          duration: Date.now() - startTime,
        });
        return data;

      case 'FAILED':
        throw new ApiError(502, `3D generation failed: ${data.task_error?.message || 'Unknown error'}`, {
          taskId,
          taskError: data.task_error,
        });

      case 'EXPIRED':
        throw new ApiError(504, '3D generation task expired. Please try again.', { taskId });

      default:
        // PENDING, IN_PROGRESS — keep polling
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  throw new ApiError(504, `3D generation timed out after ${MAX_POLL_DURATION_MS / 1000}s`, { taskId });
}

/**
 * Generate a 3D model from a text prompt.
 * @param {string} prompt - Text description (e.g. "a yellow hard hat")
 * @param {object} options - Optional overrides
 * @returns {Promise<{glbUrl: string, thumbnailUrl: string, taskId: string}>}
 */
export async function textTo3D(prompt, options = {}) {
  const client = meshyClient();

  logger.info('MeshyService', 'Submitting text-to-3D task', { prompt });

  // Step 1: Create the task
  const { data } = await client.post('/text-to-3d', {
    mode: 'preview',              // 'preview' is faster; 'refine' for production
    prompt,
    art_style: options.artStyle || 'realistic',
    should_remesh: true,          // Ensure clean topology
  });

  const taskId = data.result;
  logger.info('MeshyService', `Task created: ${taskId}`);

  // Step 2: Poll until complete
  const result = await pollTask(taskId, 'text-to-3d', options.onProgress);

  // Step 3: Extract GLB URL
  const glbUrl = result.model_urls?.glb;
  if (!glbUrl) {
    throw new ApiError(502, 'Meshy returned no GLB URL', { taskId, modelUrls: result.model_urls });
  }

  return {
    glbUrl,
    thumbnailUrl: result.thumbnail_url || null,
    taskId,
  };
}

/**
 * Generate a 3D model from an uploaded image.
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} mimeType - Image MIME type
 * @param {object} options - Optional overrides
 * @returns {Promise<{glbUrl: string, thumbnailUrl: string, taskId: string}>}
 */
export async function imageTo3D(imageBuffer, mimeType, options = {}) {
  const client = meshyClient();

  // Convert buffer to base64 data URI for the API
  const base64 = imageBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  logger.info('MeshyService', 'Submitting image-to-3D task', {
    imageSize: imageBuffer.length,
    mimeType,
  });

  const { data } = await client.post('/image-to-3d', {
    image_url: dataUri,
    should_remesh: true,
  });

  const taskId = data.result;
  logger.info('MeshyService', `Image task created: ${taskId}`);

  const result = await pollTask(taskId, 'image-to-3d', options.onProgress);

  const glbUrl = result.model_urls?.glb;
  if (!glbUrl) {
    throw new ApiError(502, 'Meshy returned no GLB URL', { taskId });
  }

  return {
    glbUrl,
    thumbnailUrl: result.thumbnail_url || null,
    taskId,
  };
}
