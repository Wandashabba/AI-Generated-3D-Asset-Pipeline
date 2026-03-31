// server/src/services/geminiService.js
// Google Gemini API integration — Educational summary generation
//
// Uses the @google/genai SDK for the Gemini 2.0 Flash model.
// Generates a concise 2-sentence educational summary about the given object.

import { GoogleGenAI } from '@google/genai';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

let genaiClient = null;

function getClient() {
  if (!genaiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new ApiError(500, 'GEMINI_API_KEY is not configured. Add it to your .env file.');
    }
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

/**
 * Generate a 2-sentence educational summary about an object.
 * @param {string} objectDescription - What the object is (e.g. "a yellow hard hat")
 * @returns {Promise<string>} - The educational summary
 */
export async function generateEducationalSummary(objectDescription) {
  const client = getClient();

  const prompt = `You are an educational assistant for a learning platform. 
Given the following object description, write exactly 2 sentences about it:
- Sentence 1: What the object is and its primary purpose or use.
- Sentence 2: An interesting fact, historical context, or safety/science detail about it.

Keep the language clear, engaging, and suitable for learners of all ages.
Do NOT include any preamble, bullet points, or formatting — just the two sentences.

Object: "${objectDescription}"`;

  logger.info('GeminiService', 'Generating educational summary', { objectDescription });

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const summary = response.text?.trim();

    if (!summary) {
      throw new ApiError(502, 'Gemini returned an empty response');
    }

    logger.info('GeminiService', 'Summary generated successfully', {
      length: summary.length,
    });

    return summary;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    logger.error('GeminiService', 'Gemini API call failed', {
      error: err.message,
    });

    // Return a fallback so the pipeline doesn't fail entirely
    logger.warn('GeminiService', 'Using fallback summary');
    return `This is a 3D model of ${objectDescription}. Explore it by rotating and zooming in the viewer above.`;
  }
}
