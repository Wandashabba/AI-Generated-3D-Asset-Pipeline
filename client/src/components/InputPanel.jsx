// client/src/components/InputPanel.jsx
// Text prompt input + image upload with drag-and-drop

import { useState, useRef, useCallback } from 'react';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

const EXAMPLE_PROMPTS = [
  'a yellow hard hat',
  'a red fire extinguisher',
  'a wooden acoustic guitar',
  'a microscope',
  'a desk globe',
  'a stethoscope',
];

export default function InputPanel({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = useCallback((file) => {
    setValidationError('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setValidationError('Please upload a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setValidationError('Image must be under 10 MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!prompt.trim() && !imageFile) {
      setValidationError('Please enter a description or upload an image.');
      return;
    }
    setValidationError('');
    onGenerate(prompt.trim(), imageFile);
  }, [prompt, imageFile, onGenerate]);

  const handleExampleClick = useCallback((example) => {
    setPrompt(example);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-1 text-surface-50">
        Generate 3D Asset
      </h2>
      <p className="text-sm text-surface-200/60 mb-5">
        Describe an object or upload a reference image
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Text Input */}
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-surface-200/80 mb-2">
            Text Description
          </label>
          <div className="relative">
            <input
              id="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "a yellow hard hat"'
              disabled={isLoading}
              className="w-full px-4 py-3 bg-surface-900/80 border border-surface-700/50 rounded-xl
                         text-surface-50 placeholder:text-surface-200/30
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            />
            {prompt && !isLoading && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-200/40 hover:text-surface-200/80 transition-colors"
                aria-label="Clear prompt"
              >
                ✕
              </button>
            )}
          </div>

          {/* Example Prompts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLE_PROMPTS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="px-3 py-1 text-xs rounded-full bg-surface-800/60 text-surface-200/60
                           hover:bg-primary-500/20 hover:text-primary-300
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-200 border border-surface-700/30"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-700/30" />
          <span className="text-xs text-surface-200/40 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-surface-700/30" />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-surface-200/80 mb-2">
            Reference Image
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-surface-700/30">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-48 object-cover"
              />
              {!isLoading && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-900/80 
                             text-surface-200/80 hover:text-white hover:bg-red-500/80
                             flex items-center justify-center transition-all duration-200"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`
                relative rounded-xl border-2 border-dashed p-8
                flex flex-col items-center justify-center gap-3
                cursor-pointer transition-all duration-300
                ${isDragging
                  ? 'border-primary-400 bg-primary-500/10'
                  : 'border-surface-700/40 hover:border-surface-200/30 hover:bg-surface-800/30'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="w-12 h-12 rounded-xl bg-surface-800/60 flex items-center justify-center text-2xl">
                📁
              </div>
              <div className="text-center">
                <p className="text-sm text-surface-200/60">
                  <span className="text-primary-400 font-medium">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-surface-200/30 mt-1">
                  PNG, JPEG, or WebP (max 10 MB)
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => e.target.files[0] && handleImageSelect(e.target.files[0])}
            className="hidden"
            id="image-upload"
          />
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 text-accent-rose text-sm animate-fade-in-up">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (!prompt.trim() && !imageFile)}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                     bg-gradient-to-r from-primary-600 to-primary-500
                     hover:from-primary-500 hover:to-primary-400
                     active:scale-[0.98]
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                     text-white shadow-lg shadow-primary-500/20
                     transition-all duration-200
                     flex items-center justify-center gap-2"
          id="generate-button"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate 3D Model
            </>
          )}
        </button>
      </form>
    </div>
  );
}
