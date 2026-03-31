// client/src/components/ModelViewer.jsx
// React Three Fiber 3D viewer with OrbitControls, Stage, and auto-scaling
//
// Key design decisions:
//   - <Stage> from drei provides professional lighting and environment mapping
//   - <Center> auto-centers the model regardless of its original origin
//   - <OrbitControls> gives rotation, zoom, and pan with damping
//   - Suspense boundary shows a loading indicator while the GLB downloads

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center, useGLTF, Html, Environment } from '@react-three/drei';

/**
 * Inner component that loads and renders the GLB model.
 * useGLTF handles caching and async loading automatically.
 */
function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  return (
    <Center>
      <primitive
        ref={modelRef}
        object={scene}
        dispose={null}
      />
    </Center>
  );
}

/**
 * Loading spinner shown while GLB is downloading.
 * Uses drei's Html component to overlay HTML inside the Canvas.
 */
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-primary-500/30 border-t-primary-400 rounded-full animate-spin" />
        <p className="text-sm text-surface-200/60 whitespace-nowrap">Loading 3D model...</p>
      </div>
    </Html>
  );
}

/**
 * Empty state shown when no model is loaded.
 */
function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-2xl bg-surface-800/40 flex items-center justify-center text-4xl mb-4">
        🧊
      </div>
      <h3 className="text-lg font-semibold text-surface-200/60 mb-1">
        No Model Yet
      </h3>
      <p className="text-sm text-surface-200/30 max-w-xs">
        Generate a 3D model from the input panel to see it rendered here with full rotation and zoom controls.
      </p>
    </div>
  );
}

/**
 * Main 3D Viewer component.
 * @param {string|null} glbUrl - URL to the GLB model file
 */
export default function ModelViewer({ glbUrl }) {
  if (!glbUrl) {
    return (
      <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl glass overflow-hidden animate-fade-in-up">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl glass overflow-hidden viewer-canvas animate-fade-in-up">
      {/* Viewer Controls Hint */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-900/60 backdrop-blur-sm border border-surface-700/20">
        <span className="text-xs text-surface-200/50">🖱️ Drag to rotate • Scroll to zoom</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
      >
        {/* Lighting & Environment */}
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 8, 20]} />

        <Suspense fallback={<Loader />}>
          <Stage
            intensity={0.5}
            environment="city"
            adjustCamera={1.5}
            shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}
          >
            <Model url={glbUrl} />
          </Stage>
        </Suspense>

        {/* Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={20}
          enablePan={true}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}
