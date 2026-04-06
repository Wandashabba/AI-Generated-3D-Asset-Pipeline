
import { useState, useRef, useCallback } from 'react';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

const EXAMPLE_PROMPTS = [
  { text: 'A yellow hard hat' },
  { text: 'A red fire extinguisher' },
  { text: 'A wooden acoustic guitar' },
  { text: 'A high-end microscope' },
  { text: 'A detailed desk globe' },
  { text: 'A professional stethoscope' },
];

export default function InputPanel({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState('text');
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
    setActiveTab('image');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const removeImage = useCallback(() => {
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveTab('text');
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!prompt.trim() && !imageFile) {
      setValidationError('Describe an object or upload an image to begin.');
      return;
    }
    setValidationError('');
    onGenerate(prompt.trim(), imageFile);
  }, [prompt, imageFile, onGenerate]);

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-surface-200 border border-surface-200/80 animate-fade-in-up">
      <div className="px-9 pt-9 pb-7 border-b border-surface-100">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[24px] font-bold text-surface-950 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Generate Asset
          </h2>
          <p className="text-sm text-surface-600 font-medium tracking-wide">High-Fidelity 3D Generation Engine</p>
        </div>
      </div>

      <div className="px-9 pt-8 flex gap-4 mb-8">
        <button type="button" onClick={() => setActiveTab('text')}
          className={`flex-1 py-3.5 px-6 rounded-[16px] text-sm font-bold transition-all duration-300 ${
            activeTab === 'text' ? 'bg-surface-950 text-white shadow-lg' : 'bg-surface-50 text-surface-700 border border-surface-200 hover:bg-surface-100'
          }`}>
          <span className="flex items-center justify-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Text Prompt
          </span>
        </button>
        <button type="button" onClick={() => setActiveTab('image')}
          className={`flex-1 py-3.5 px-6 rounded-[16px] text-sm font-bold transition-all duration-300 ${
            activeTab === 'image' ? 'bg-surface-950 text-white shadow-lg' : 'bg-surface-50 text-surface-700 border border-surface-200 hover:bg-surface-100'
          }`}>
          <span className="flex items-center justify-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Image Upload
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-9 pb-10 space-y-8">
        {activeTab === 'text' && (
          <div className="animate-fade-in">
            <div className="relative">
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                disabled={isLoading}
                placeholder='Describe the exact 3D object you wish to generate...'
                rows="4"
                className="w-full px-6 py-6 bg-surface-50 border border-surface-200 rounded-[20px] text-surface-950 text-base font-medium placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-surface-900 focus:bg-white resize-none transition-all shadow-inner disabled:opacity-50"
              />
              {prompt && !isLoading && (
                <button type="button" onClick={() => setPrompt('')} className="absolute right-5 top-5 text-surface-400 hover:text-surface-800 transition-colors" aria-label="Clear">✕</button>
              )}
            </div>
            <div className="mt-6">
              <p className="text-[12px] uppercase tracking-[0.1em] text-surface-500 mb-4 font-semibold">Suggested Prompts</p>
              <div className="flex flex-wrap gap-2.5">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button key={ex.text} type="button" onClick={() => setPrompt(ex.text)} disabled={isLoading}
                    className="px-5 py-2.5 text-[13px] font-semibold rounded-full bg-white text-surface-700 border border-surface-200 hover:bg-surface-100 hover:text-surface-950 hover:border-surface-300 transition-all shadow-sm">
                    {ex.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="animate-fade-in">
            {imagePreview ? (
              <div className="relative rounded-[20px] overflow-hidden border border-surface-200 shadow-sm group">
                <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                {!isLoading && (
                  <button type="button" onClick={removeImage} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg text-surface-950 hover:bg-surface-100 flex items-center justify-center font-bold transition-colors">✕</button>
                )}
              </div>
            ) : (
              <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => !isLoading && fileInputRef.current?.click()}
                className={`relative rounded-[20px] border-2 border-dashed p-12 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all bg-surface-50/50 ${isDragging ? 'border-surface-950 bg-surface-100' : 'border-surface-200 hover:border-surface-400 hover:bg-surface-50'} ${isLoading ? 'opacity-50' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-surface-200">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-700"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-base font-bold text-surface-950 tracking-tight">Select an image to upload</p>
                  <p className="text-[13px] text-surface-500 font-medium tracking-wide">or drag and drop it here</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={(e) => e.target.files[0] && handleImageSelect(e.target.files[0])} className="hidden" />
          </div>
        )}

        {validationError && <div className="text-surface-950 text-sm font-bold px-5 py-4 bg-surface-100 border border-surface-200 rounded-xl shadow-sm flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {validationError}</div>}

        <button type="submit" disabled={isLoading || (!prompt.trim() && !imageFile)}
          className={`w-full py-5 px-6 rounded-[16px] font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
            isLoading ? 'bg-surface-100 text-surface-400 cursor-not-allowed shadow-none border border-surface-200' : 'bg-surface-950 hover:bg-surface-800 hover:shadow-xl text-white active:scale-[0.98]'
          }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {isLoading ? (
            <><div className="w-2 h-2 rounded-full bg-surface-400 animate-pulse" /><div className="w-2 h-2 rounded-full bg-surface-400 animate-pulse delay-100" /><div className="w-2 h-2 rounded-full bg-surface-400 animate-pulse delay-200" /><span>Processing Asset...</span></>
          ) : (
            <>Generate 3D Model</>
          )}
        </button>
      </form>
    </div>
  );
}
