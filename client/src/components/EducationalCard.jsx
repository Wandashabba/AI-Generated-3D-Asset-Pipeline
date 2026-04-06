
export default function EducationalCard({ summary, generatedFrom }) {
  if (!summary) return null;

  return (
    <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in-up bg-white shadow-sm border border-surface-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border border-primary-200 shadow-sm text-primary-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-surface-950 uppercase tracking-[0.1em]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Educational Insights
          </h3>
          <p className="text-[10px] text-surface-700 font-semibold mt-0.5">Contextual Analysis</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-200">
          <p className="text-sm text-surface-800 leading-relaxed font-medium">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
