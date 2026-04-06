
import { PIPELINE_STATES } from '../utils/constants';

export default function StatusIndicator({ state, error }) {
  if (state === PIPELINE_STATES.IDLE || state === PIPELINE_STATES.COMPLETE) return null;

  const steps = [
    { key: PIPELINE_STATES.GENERATING, label: 'Generating 3D Geometry' },
    { key: PIPELINE_STATES.DOWNLOADING, label: 'Processing GLB Asset' },
    { key: PIPELINE_STATES.ANALYZING, label: 'Creating Educational Summary' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === state);
  
  if (state === PIPELINE_STATES.ERROR) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6 animate-fade-in flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-rose-100 shadow-sm text-accent-rose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Generation Failed</h3>
          <p className="text-xs text-rose-700 font-medium leading-relaxed">{error || 'An unexpected error occurred. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in-up bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-surface-950 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse delay-200" />
          </div>
          Pipeline Active
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
          Step {Math.max(1, currentIndex + 1)} of 3
        </span>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-surface-200" />
        
        {steps.map((step, idx) => {
          const isActive = state === step.key;
          const isPast = currentIndex > idx;
          return (
            <div key={step.key} className={`flex items-center gap-4 relative z-10 transition-opacity duration-300 ${!isActive && !isPast ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${isPast ? 'bg-primary-500 border-primary-500 text-white' : 
                  isActive ? 'bg-white border-primary-500 text-primary-500 shadow-[0_0_15px_rgba(91,76,219,0.3)]' : 
                  'bg-white border-surface-300 text-transparent'}`}>
                {isPast ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> 
                        : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary-500' : 'bg-transparent'}`} />}
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-surface-950' : 'text-surface-700'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
