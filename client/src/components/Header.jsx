
import { useState } from 'react';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="w-full absolute top-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan opacity-20 animate-pulse-glow" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/20">
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M10 1L19 6.5V15.5L10 21L1 15.5V6.5L10 1Z" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
                <path d="M10 6L15 9V15L10 18L5 15V9L10 6Z" fill="white"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="text-primary-400 drop-shadow-md">Hex</span><span>Era</span>
            </h1>
            <p className="text-[10px] text-white/60 uppercase tracking-[0.15em] font-medium -mt-0.5 shadow-sm">
              3D Asset Generator
            </p>
          </div>
        </div>


        <nav className="hidden md:flex items-center gap-8 pl-8">
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="text-white/90 hover:text-white font-semibold tracking-wide text-sm flex items-center gap-1.5 py-4 transition-colors">
              Workspace
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary-400' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            

            {isDropdownOpen && (
              <div className="absolute top-[85%] -left-4 w-56 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in">
                <a href="#" className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-6 py-1 flex justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
                  Text to 3D Model
                </a>
                <a href="#" className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-6 py-1 flex justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                  Image to 3D Model
                </a>
                <a href="#" className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-6 py-1 flex justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-violet)" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
                  3D to Video
                </a>
                <a href="#" className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3">
                  <div className="w-6 py-1 flex justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-rose)" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                  Text to Image
                </a>
              </div>
            )}
          </div>
          
          <a href="#" className="text-white/70 hover:text-white font-medium text-sm transition-colors py-4">Explore</a>
          <a href="#" className="text-white/70 hover:text-white font-medium text-sm transition-colors py-4">Tutorials</a>
        </nav>


        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            <span className="text-xs font-semibold tracking-wide">Tripo3D</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-neon opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-neon"></span>
            </span>
            <span className="text-xs font-semibold text-white/80 hidden sm:inline tracking-wide drop-shadow-sm">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
