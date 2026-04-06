// server/src/routes/generate.js
// POST /api/generate — Main orchestration route
//
// Pipeline steps:
//   1. Validate input (text prompt or uploaded image)
//   2. Generate 3D model via Tripo3D (cloud GPU)
//   3. Download the GLB and convert to data URI
//   4. Generate an educational summary via Gemini (in parallel)
//   5. Return the combined result

import { Router } from 'express';
import axios from 'axios';
import { upload } from '../middleware/upload.js';
import { textTo3D, imageTo3D } from '../services/tripoService.js';
import { generateEducationalSummary } from '../services/geminiService.js';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * Download a GLB file from a URL and return it as a base64 data URI.
 */
async function glbUrlToDataUri(glbUrl) {
  logger.info('GenerateRoute', 'Downloading GLB from Tripo3D');

  const response = await axios.get(glbUrl, {
    responseType: 'arraybuffer',
    timeout: 60_000,
  });

  const buffer = Buffer.from(response.data);
  logger.info('GenerateRoute', `GLB downloaded: ${(buffer.length / 1024).toFixed(1)} KB`);

  return `data:model/gltf-binary;base64,${buffer.toString('base64')}`;
}

/**
 * POST /api/generate
 *
 * Body (multipart/form-data):
 *   - prompt: string — required if no image
 *   - image: file (PNG/JPEG/WebP) — required if no prompt
 *
 * Response:
 *   {
 *     success: true,
 *     data: { glbUrl, thumbnailUrl, summary, processing, taskId, generatedFrom }
 *   }
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;

    // ── Step 1: Validate input ──────────────────────────────
    if (!prompt && !imageFile) {
      throw new ApiError(400, 'Please provide either a text prompt or an image.');
    }

    const inputType = imageFile ? 'image' : 'text';
    const description = prompt || 'uploaded image object';

    logger.info('GenerateRoute', `Pipeline started (${inputType})`, {
      prompt: prompt || null,
      hasImage: !!imageFile,
    });

    // ── Step 2: Generate 3D model via Tripo3D ───────────────
    let tripoResult;

    if (inputType === 'text') {
      tripoResult = await textTo3D(prompt);
    } else {
      tripoResult = await imageTo3D(imageFile.buffer, imageFile.mimetype);
    }

    logger.info('GenerateRoute', '3D generation complete', { taskId: tripoResult.taskId });

    // ── Step 3 & 4: Download GLB + Generate summary IN PARALLEL
    const [glbDataUri, summary] = await Promise.all([
      glbUrlToDataUri(tripoResult.glbUrl),
      generateEducationalSummary(description),
    ]);

    // ── Step 5: Return combined result ──────────────────────
    logger.info('GenerateRoute', 'Pipeline complete', { taskId: tripoResult.taskId });

    res.json({
      success: true,
      data: {
        glbUrl: glbDataUri,
        thumbnailUrl: tripoResult.thumbnailUrl || null,
        summary,
        processing: { autoCenter: true, autoScale: true, format: 'glb' },
        taskId: tripoResult.taskId,
        validated: true,
        generatedFrom: inputType,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/generate/health
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      tripo3d: !!process.env.TRIPO_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    },
  });
});

export default router;
