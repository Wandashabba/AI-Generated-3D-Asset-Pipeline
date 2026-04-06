
import { useCallback } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import InputPanel from './components/InputPanel';
import ModelViewer from './components/ModelViewer';
import StatusIndicator from './components/StatusIndicator';
import EducationalCard from './components/EducationalCard';
import ShowcaseCarousel from './components/ShowcaseCarousel';
import { useGeneratePipeline } from './hooks/useGeneratePipeline';
import { PIPELINE_STATES } from './utils/constants';
import bgVideo from './assets/3D-background.mp4';

export default function App() {
  const { state, result, error, generate, reset } = useGeneratePipeline();
  const isLoading = ![PIPELINE_STATES.IDLE, PIPELINE_STATES.COMPLETE, PIPELINE_STATES.ERROR].includes(state);
  const showResult = state === PIPELINE_STATES.COMPLETE && result;
  const handleGenerate = useCallback((prompt, imageFile) => generate(prompt, imageFile), [generate]);

  return (
    <div className="min-h-screen bg-surface-50 text-surface-950">
      <Header />
      <Layout>

        <div className="relative w-screen left-1/2 -translate-x-1/2 -mt-8 mb-12 overflow-hidden flex flex-col items-center justify-center py-32 sm:py-40 min-h-[70vh]">
          

          <div className="absolute inset-0 -z-20 w-full h-full">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover scale-105"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center animate-fade-in-up px-4 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>Text & Image to </span>
              <span className="text-accent-cyan drop-shadow-md">3D Models</span>
            </h2>

            <div className="flex justify-center w-full">
              <p className="text-white/90 text-sm sm:text-lg max-w-2xl text-center leading-relaxed font-medium drop-shadow-md">
                Describe any object or upload a reference image. HexEra generates a production-ready 3D model and educational summary in under a minute.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-sm text-white font-semibold tracking-wide">
                Fast Generation
              </div>
              <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-sm text-white font-semibold tracking-wide">
                PBR Textures
              </div>
              <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-sm text-white font-semibold tracking-wide">
                GLB Export
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ShowcaseCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-5 space-y-6">
            <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />
            <StatusIndicator state={state} error={error} />
            {(state === PIPELINE_STATES.ERROR || state === PIPELINE_STATES.COMPLETE) && (
              <button
                onClick={reset}
                className="w-full py-4 px-6 rounded-[16px] text-sm font-bold shadow-sm
                           bg-white text-surface-950 border border-surface-200
                           hover:bg-surface-50 hover:border-surface-300
                           transition-all duration-300 animate-fade-in"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Generate Another
              </button>
            )}
          </div>

          <div className="lg:col-span-7 space-y-6">
            <ModelViewer glbUrl={showResult ? result.glbUrl : null} />
            {showResult && <EducationalCard summary={result.summary} generatedFrom={result.generatedFrom} />}
            {showResult && (
              <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-surface-200 border border-surface-200/80 animate-fade-in-up">
                <h3 className="text-sm font-bold text-surface-500 mb-6 uppercase tracking-[0.1em]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Asset Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {[
                    { label: 'Format', value: 'GLB' },
                    { label: 'Source', value: result.generatedFrom },
                    { label: 'Validated', value: result.validated ? 'Yes' : 'Skipped' },
                    { label: 'Processing', value: 'Centered + Scaled' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[11px] text-surface-500 mb-2 uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-sm text-surface-950 font-bold capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-surface-100">
                  <a href={result.glbUrl} download="hexera-model.glb"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[14px]
                               bg-surface-950 text-white text-sm font-bold shadow-lg
                               hover:bg-surface-800 hover:shadow-xl active:scale-[0.98] transition-all"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download GLB
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 pb-12 text-center border-t border-surface-200 pt-10">
          <p className="text-sm font-bold text-surface-950 tracking-tight mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            HexEra
          </p>
          <p className="text-[11px] text-surface-500 tracking-wide font-medium">
            Powered by Tripo3D and Gemini AI
          </p>
        </div>
      </Layout>
    </div>
  );
}
