// client/src/components/Header.jsx
// App header with branding

export default function Header() {
  return (
    <header className="w-full glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-xl">
            🧊
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text tracking-tight">
              3D Asset Pipeline
            </h1>
            <p className="text-xs text-surface-200/60 -mt-0.5">
              AI-Powered Learning Platform
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-surface-200/80 hidden sm:inline">Pipeline Ready</span>
        </div>
      </div>
    </header>
  );
}
