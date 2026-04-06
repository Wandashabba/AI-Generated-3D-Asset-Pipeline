# Dev Log — AI-Generated 3D Asset Pipeline

> Technical decisions, rationale, and lessons learned during development.

---

## Day 1 — Architecture & Technology Choices

### Why React Three Fiber over raw Three.js?

Three.js is imperative: you create scenes, cameras, and renderers manually. This clashes with React's declarative paradigm. React Three Fiber (R3F) bridges the gap by expressing Three.js objects as React components, which means:

1. **State integration** — R3F components react to React state changes naturally. When a new `glbUrl` arrives, the component re-renders with the new model — no manual scene cleanup needed.
2. **Ecosystem** — `@react-three/drei` provides battle-tested abstractions: `<OrbitControls>`, `<Stage>` (professional lighting), `<Center>` (auto-centering), and `useGLTF` (async GLB loading with caching). These replaced ~200 lines of boilerplate.
3. **Suspense** — R3F integrates with React Suspense, giving us free loading states while GLB files download.

### Why Tripo3D over alternatives?

| Evaluated | Pros | Cons | Decision |
|-----------|------|------|----------|
| **Tripo3D** | Fast cloud GPU, PBR textures, simple REST API, GLB output | Credit-based pricing | ✅ Selected |
| **Meshy.ai** | Good quality, direct GLB output | ~60-120s generation time | Backup option |
| **Shap-E (HuggingFace)** | Free, open source | Requires GPU, very slow on CPU, lower quality | ❌ Rejected |
| **Point-E (OpenAI)** | Free | Very low quality, point clouds only | ❌ Rejected |

Tripo3D was chosen for its fast cloud GPU generation (~60-90s), high-quality PBR textured GLB output, and clean async API. The polling pattern (submit → poll task ID → get result) is straightforward and testable.

### Why Express over FastAPI?

Using JavaScript on both frontend and backend reduces context-switching. Express is battle-tested, has excellent middleware support, and the assessment values engineering depth — Express is transparent and debuggable. FastAPI would require Python, adding a second language to the stack.

### Why Google Gemini over OpenAI?

- **Free tier**: Gemini 2.0 Flash offers 15 RPM free — enough for development and demo.
- **Speed**: Flash model responds in <1s for short prompts.
- **No billing setup**: No credit card required for the API key.

### Why Tailwind CSS v4?

The user specifically requested Tailwind. v4 uses the new `@theme` directive instead of `tailwind.config.js`, which is cleaner and supports CSS-native customization. The `@tailwindcss/vite` plugin provides zero-config integration.

---

## Architecture Decisions

### Error Handling Strategy

The pipeline has a deliberate asymmetry in error handling:

- **3D Generation failure** → **Hard fail** (returns 502). There's no fallback for a missing 3D model — the entire point of the pipeline is lost.
- **Gemini failure** → **Soft fail** (returns fallback text). The educational summary is supplementary. A default message like "This is a 3D model of [object]" is returned so the user still gets their model.

This design ensures the product remains useful even when one service is degraded.

### GLB Processing: Server vs Client

I chose **client-side processing** via drei's `<Stage>` and `<Center>` components instead of server-side Three.js processing because:

1. No need to download the full GLB on the server (saves bandwidth and memory)
2. R3F/drei handles centering and scaling in the scene graph, not the file
3. The original GLB file remains unmodified for download

### Parallel Execution

The GLB download from Tripo3D and Gemini summary generation run in parallel via `Promise.all()`, reducing total pipeline time by overlapping these independent operations.

### State Machine in the Hook

The `useGeneratePipeline` hook uses a flat state machine (`idle → uploading → generating_3d → processing → generating_summary → complete`) with simulated steps. The server handles steps 2-4 as a single request, but the client shows them individually for UX transparency. The simulated delays (500-800ms) give users visual feedback that something is happening.

---

## API Design

### Why multipart/form-data for text-only requests?

Using `multipart/form-data` for both text-only and image requests means one endpoint handles both input types uniformly. The backend checks: image present? → image-to-3D. Text only? → text-to-3D. This simplifies the frontend API layer to a single `POST /api/generate`.

---

*This log will be updated as development continues.*
