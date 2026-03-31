// client/src/components/StatusIndicator.jsx
// Pipeline progress indicator showing each step of the generation process

import { PIPELINE_STEPS, PIPELINE_STATES } from '../utils/constants';

/**
 * Determines the visual state of each step based on the current pipeline state.
 */
function getStepStatus(stepKey, currentState) {
  const stepOrder = PIPELINE_STEPS.map((s) => s.key);
  const currentIndex = stepOrder.indexOf(currentState);
  const stepIndex = stepOrder.indexOf(stepKey);

  if (currentState === PIPELINE_STATES.ERROR) {
    // Show all steps up to the current one as failed
    if (stepIndex <= currentIndex) return 'completed';
    if (stepIndex === currentIndex + 1) return 'error';
    return 'pending';
  }

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'pending';
}

export default function StatusIndicator({ state, error }) {
  if (state === PIPELINE_STATES.IDLE || state === PIPELINE_STATES.COMPLETE) {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-surface-200/80 mb-4 uppercase tracking-wider">
        Pipeline Progress
      </h3>

      <div className="space-y-3">
        {PIPELINE_STEPS.slice(0, -1).map((step) => {
          const status = getStepStatus(step.key, state);

          return (
            <div
              key={step.key}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500
                ${status === 'active' ? 'bg-primary-500/10 border border-primary-500/20' : ''}
                ${status === 'completed' ? 'opacity-60' : ''}
                ${status === 'pending' ? 'opacity-30' : ''}
                ${status === 'error' ? 'bg-red-500/10 border border-red-500/20' : ''}
              `}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                {status === 'completed' && (
                  <span className="text-emerald-400">✓</span>
                )}
                {status === 'active' && (
                  <span className="animate-pulse">{step.icon}</span>
                )}
                {status === 'pending' && (
                  <span className="text-surface-200/30">{step.icon}</span>
                )}
                {status === 'error' && (
                  <span className="text-red-400">✕</span>
                )}
              </div>

              {/* Step Label */}
              <span className={`
                text-sm font-medium
                ${status === 'active' ? 'text-primary-300' : ''}
                ${status === 'completed' ? 'text-surface-200/60' : ''}
                ${status === 'pending' ? 'text-surface-200/30' : ''}
                ${status === 'error' ? 'text-red-300' : ''}
              `}>
                {step.label}
              </span>

              {/* Active Spinner */}
              {status === 'active' && (
                <div className="ml-auto">
                  <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {state === PIPELINE_STATES.ERROR && error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-medium text-red-300">Generation Failed</p>
              <p className="text-xs text-red-300/70 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Time */}
      {state === PIPELINE_STATES.GENERATING_3D && (
        <p className="text-xs text-surface-200/30 mt-4 text-center">
          ⏱ 3D generation typically takes 1-3 minutes
        </p>
      )}
    </div>
  );
}
