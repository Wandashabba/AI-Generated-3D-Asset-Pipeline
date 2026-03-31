// server/src/routes/generate.js
// POST /api/generate — Main orchestration route
//
// This is the heart of the pipeline. It executes a multi-step process:
//   1. Validate input (text prompt or uploaded image)
//   2. Submit 3D generation task to Meshy.ai
//   3. Poll until the model is ready
//   4. Validate the output GLB
//   5. Generate an educational summary via Gemini
//   6. Return the combined result
//
// Error handling strategy:
//   - 3D generation failure → 502 with details
//   - Gemini failure → fallback summary (non-blocking)
//   - Input validation → 400 with message

import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { textTo3D, imageTo3D } from '../services/meshyService.js';
import { generateEducationalSummary } from '../services/geminiService.js';
import { processAsset } from '../services/assetProcessor.js';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * POST /api/generate
 *
 * Body (multipart/form-data):
 *   - prompt: string (text description) — required if no image
 *   - image: file (PNG/JPEG/WebP) — required if no prompt
 *   - artStyle: string (optional, default: 'realistic')
 *
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       glbUrl: string,
 *       thumbnailUrl: string | null,
 *       summary: string,
 *       processing: { autoCenter, autoScale, format },
 *       taskId: string,
 *       generatedFrom: 'text' | 'image'
 *     }
 *   }
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { prompt, artStyle } = req.body;
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

    // ── Step 2 & 3: Generate 3D model ──────────────────────
    let meshyResult;

    if (inputType === 'text') {
      meshyResult = await textTo3D(prompt, { artStyle });
    } else {
      meshyResult = await imageTo3D(imageFile.buffer, imageFile.mimetype, { artStyle });
    }

    logger.info('GenerateRoute', '3D generation complete', {
      taskId: meshyResult.taskId,
      glbUrl: meshyResult.glbUrl,
    });

    // ── Step 4: Validate & process the GLB ──────────────────
    const assetResult = await processAsset(meshyResult.glbUrl);

    // ── Step 5: Generate educational summary (non-blocking) ─
    // Even if Gemini fails, we still return the 3D model
    const summary = await generateEducationalSummary(description);

    // ── Step 6: Return combined result ──────────────────────
    logger.info('GenerateRoute', 'Pipeline complete', {
      taskId: meshyResult.taskId,
    });

    res.json({
      success: true,
      data: {
        glbUrl: assetResult.glbUrl,
        thumbnailUrl: meshyResult.thumbnailUrl,
        summary,
        processing: assetResult.processing,
        taskId: meshyResult.taskId,
        validated: assetResult.validated,
        generatedFrom: inputType,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/generate/health
 * Simple health check endpoint.
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      meshy: !!process.env.MESHY_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    },
  });
});

export default router;
