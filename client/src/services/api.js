// client/src/services/api.js
// API service layer — communicates with the Express backend

import axios from 'axios';
import { API_BASE } from '../utils/constants';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 300_000, // 5 min — Tripo3D typically generates in ~60-90s
});

/**
 * Generate a 3D asset from a text prompt.
 * @param {string} prompt - Text description of the object
 * @returns {Promise<object>} - { glbUrl, summary, thumbnailUrl, ... }
 */
export async function generateFromText(prompt) {
  const formData = new FormData();
  formData.append('prompt', prompt);

  try {
    const { data } = await client.post('/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!data.success) {
      throw new Error(data.error?.message || 'Generation failed');
    }

    return data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error.message);
    }
    throw err;
  }
}

/**
 * Generate a 3D asset from an uploaded image.
 * @param {File} imageFile - The image file
 * @param {string} [prompt] - Optional text description for the summary
 * @returns {Promise<object>} - { glbUrl, summary, thumbnailUrl, ... }
 */
export async function generateFromImage(imageFile, prompt = '') {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (prompt) formData.append('prompt', prompt);

  try {
    const { data } = await client.post('/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!data.success) {
      throw new Error(data.error?.message || 'Generation failed');
    }

    return data.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error.message);
    }
    throw err;
  }
}

/**
 * Check API health status.
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  const { data } = await client.get('/generate/health');
  return data;
}
