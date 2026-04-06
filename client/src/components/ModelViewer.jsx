
import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ glbUrl }) {
  const containerRef = useRef(null);

  if (!glbUrl) {
    return (
      <div className="glass-card rounded-2xl w-full aspect-square md:aspect-video flex items-center justify-center relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-surface-200 opacity-50 absolute"></div>
          <div className="w-[450px] h-[450px] rounded-full border border-surface-200 opacity-30 absolute"></div>
        </div>

        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-100 to-cyan-100 animate-spin-slow opacity-50 blur-lg" />
            
            <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-surface-200 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-surface-300)" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>

            <div className="absolute top-[-10px] right-[-10px] w-4 h-4 rounded-full bg-accent-cyan shadow-sm animate-orbit" />
          </div>

          <div className="text-center bg-white/80 px-6 py-3 rounded-2xl backdrop-blur-md border border-surface-200 shadow-sm">
            <h3 className="text-surface-950 font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Awaiting Input
            </h3>
            <p className="text-surface-700 text-sm font-medium mt-1">
              Your generated 3D model will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl w-full aspect-square flex items-center justify-center overflow-hidden animate-fade-in relative bg-white border border-surface-300 shadow-md group">
      
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-surface-200 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-neon opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-neon"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-surface-950">Live Preview</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md border border-surface-200 text-surface-800 text-xs font-semibold shadow-sm flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5z"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>
          Scroll to Zoom
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md border border-surface-200 text-surface-800 text-xs font-semibold shadow-sm flex items-center gap-2">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M3 12h18"/><path d="M12 3c-2.5 0-4.5 4-4.5 9s2 9 4.5 9 4.5-4 4.5-9-2-9-4.5-9"/></svg>
           Drag to Rotate
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }} shadows>
           <color attach="background" args={['#F8FAFC']} />
           <ambientLight intensity={1.5} />
           <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
           <Suspense fallback={null}>
             <Stage environment="city" intensity={0.6}>
               <Center>
                 <Model url={glbUrl} />
               </Center>
             </Stage>
           </Suspense>
           <OrbitControls autoRotate autoRotateSpeed={2} enableDamping dampingFactor={0.05} makeDefault />
        </Canvas>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </div>
  );
}
