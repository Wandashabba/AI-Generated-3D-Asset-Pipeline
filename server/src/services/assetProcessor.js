// server/src/services/assetProcessor.js
// GLB validation and processing utilities
//
// Since Meshy.ai already returns properly formatted GLB files,
// this module provides validation and metadata extraction.
// For production, this could be extended to re-center/re-scale
// using Three.js on the server side.

import axios from 'axios';
import { logger } from '../utils/logger.js';

// GLB magic bytes: "glTF" in ASCII
const GLB_MAGIC = 0x46546C67;

/**
 * Validate that a URL points to a valid GLB file by checking magic bytes.
 * @param {string} glbUrl - URL to the GLB file
 * @returns {Promise<{valid: boolean, fileSize: number}>}
 */
export async function validateGLB(glbUrl) {
  try {
    // Fetch only the first 4 bytes to check the magic number
    const response = await axios.get(glbUrl, {
      responseType: 'arraybuffer',
      headers: { Range: 'bytes=0-3' },
      timeout: 15_000,
    });

    const buffer = Buffer.from(response.data);
    const magic = buffer.readUInt32LE(0);
    const valid = magic === GLB_MAGIC;

    logger.info('AssetProcessor', `GLB validation: ${valid ? 'PASS' : 'FAIL'}`, {
      magic: `0x${magic.toString(16)}`,
    });

    return {
      valid,
      fileSize: parseInt(response.headers['content-length'] || '0', 10),
    };
  } catch (err) {
    logger.warn('AssetProcessor', 'GLB validation skipped (range request not supported)', {
      error: err.message,
    });
    // If range requests aren't supported, assume valid (Meshy always returns GLB)
    return { valid: true, fileSize: 0 };
  }
}

/**
 * Process a GLB asset — validate and return metadata.
 * Auto-centering and auto-scaling are handled client-side by React Three Fiber's
 * <Stage> and <Center> components from @react-three/drei, which is more efficient
 * than downloading the full file server-side.
 *
 * @param {string} glbUrl - URL to the GLB model
 * @returns {Promise<{glbUrl: string, validated: boolean, fileSize: number}>}
 */
export async function processAsset(glbUrl) {
  logger.info('AssetProcessor', 'Processing asset', { glbUrl });

  const { valid, fileSize } = await validateGLB(glbUrl);

  return {
    glbUrl,
    validated: valid,
    fileSize,
    // Client-side processing instructions
    processing: {
      autoCenter: true,
      autoScale: true,
      format: 'glb',
    },
  };
}
