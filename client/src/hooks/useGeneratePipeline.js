// client/src/hooks/useGeneratePipeline.js
// Custom hook managing the multi-step generation pipeline state machine

import { useState, useCallback } from 'react';
import { generateFromText, generateFromImage } from '../services/api';
import { PIPELINE_STATES } from '../utils/constants';

/**
 * Hook return shape:
 * {
 *   state: string,        // Current pipeline state
 *   result: object|null,  // { glbUrl, summary, thumbnailUrl, ... }
 *   error: string|null,   // Error message
 *   generate: (prompt, imageFile?) => Promise<void>,
 *   reset: () => void,
 * }
 */
export function useGeneratePipeline() {
  const [state, setState] = useState(PIPELINE_STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setState(PIPELINE_STATES.IDLE);
    setResult(null);
    setError(null);
  }, []);

  const generate = useCallback(async (prompt, imageFile = null) => {
    try {
      setError(null);
      setResult(null);

      // Step 1: Submitting
      setState(PIPELINE_STATES.UPLOADING);

      // Brief delay so the user can see the uploading state
      await new Promise((r) => setTimeout(r, 500));

      // Step 2: Generating 3D
      setState(PIPELINE_STATES.GENERATING_3D);

      let data;
      if (imageFile) {
        data = await generateFromImage(imageFile, prompt);
      } else {
        data = await generateFromText(prompt);
      }

      // Step 3: Processing (server already did this, but we show the step)
      setState(PIPELINE_STATES.PROCESSING);
      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Summary was generated server-side in parallel
      setState(PIPELINE_STATES.GENERATING_SUMMARY);
      await new Promise((r) => setTimeout(r, 600));

      // Step 5: Complete
      setState(PIPELINE_STATES.COMPLETE);
      setResult(data);
    } catch (err) {
      setState(PIPELINE_STATES.ERROR);

      // Extract the most useful error message
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'An unexpected error occurred. Please try again.';

      setError(message);
      console.error('[Pipeline Error]', err);
    }
  }, []);

  return { state, result, error, generate, reset };
}
