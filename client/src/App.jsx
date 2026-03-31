// client/src/App.jsx
// Root application component — orchestrates the full pipeline UI

import { useCallback } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import InputPanel from './components/InputPanel';
import ModelViewer from './components/ModelViewer';
import StatusIndicator from './components/StatusIndicator';
import EducationalCard from './components/EducationalCard';
import { useGeneratePipeline } from './hooks/useGeneratePipeline';
import { PIPELINE_STATES } from './utils/constants';

export default function App() {
  const { state, result, error, generate, reset } = useGeneratePipeline();

  const isLoading = ![PIPELINE_STATES.IDLE, PIPELINE_STATES.COMPLETE, PIPELINE_STATES.ERROR].includes(state);
  const showResult = state === PIPELINE_STATES.COMPLETE && result;

  const handleGenerate = useCallback((prompt, imageFile) => {
    generate(prompt, imageFile);
  }, [generate]);

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />
      <Layout>
        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
            Text & Image to 3D
          </h2>
          <p className="text-surface-200/50 text-sm sm:text-base max-w-xl mx-auto">
            Describe any object or upload a reference image — our AI pipeline generates 
            a 3D model and writes an educational summary in seconds.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input + Status */}
          <div className="lg:col-span-4 space-y-6">
            <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />
            <StatusIndicator state={state} error={error} />

            {/* Reset Button (shown on error or complete) */}
            {(state === PIPELINE_STATES.ERROR || state === PIPELINE_STATES.COMPLETE) && (
              <button
                onClick={reset}
                className="w-full py-3 px-6 rounded-xl text-sm font-medium
                           bg-surface-800/60 text-surface-200/60
                           hover:bg-surface-700/60 hover:text-surface-200/80
                           border border-surface-700/30
                           transition-all duration-200 animate-fade-in-up"
                id="reset-button"
              >
                🔄 Generate Another
              </button>
            )}
          </div>

          {/* Right Column: 3D Viewer + Educational Card */}
          <div className="lg:col-span-8 space-y-6">
            <ModelViewer glbUrl={showResult ? result.glbUrl : null} />

            {showResult && (
              <EducationalCard
                summary={result.summary}
                generatedFrom={result.generatedFrom}
              />
            )}

            {/* Model Metadata (shown on complete) */}
            {showResult && (
              <div className="glass rounded-2xl p-5 animate-fade-in-up">
                <h3 className="text-sm font-semibold text-surface-200/80 mb-3">
                  Asset Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-surface-200/40 mb-1">Format</p>
                    <p className="text-sm text-surface-50 font-medium">GLB</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-200/40 mb-1">Source</p>
                    <p className="text-sm text-surface-50 font-medium capitalize">{result.generatedFrom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-200/40 mb-1">Validated</p>
                    <p className="text-sm text-surface-50 font-medium">
                      {result.validated ? '✓ Yes' : '— Skipped'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-200/40 mb-1">Processing</p>
                    <p className="text-sm text-surface-50 font-medium">
                      {result.processing?.autoCenter ? 'Centered' : ''} {result.processing?.autoScale ? '+ Scaled' : ''}
                    </p>
                  </div>
                </div>

                {/* Download Link */}
                <div className="mt-4 pt-4 border-t border-surface-700/20">
                  <a
                    href={result.glbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                               bg-primary-500/10 text-primary-300 text-sm font-medium
                               hover:bg-primary-500/20 transition-all duration-200
                               border border-primary-500/20"
                    id="download-glb"
                  >
                    ⬇️ Download GLB
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}
