# 🧊 HexEra 3D Asset Pipeline

> A streamlined pipeline that transforms text descriptions or 2D images into production-ready 3D models with contextual summaries, built for the NexEra learning platform.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)
![Express](https://img.shields.io/badge/Express-4-000?logo=express)

---

## ✨ Features

- **Text-to-3D**: Describe any object and instantly receive a textured 3D model.
- **Image-to-3D**: Upload a reference image to generate a matching 3D asset.
- **Interactive Viewer**: Rotate, zoom, and pan the 3D model natively in the browser via React Three Fiber.
- **Contextual Summaries**: Automatic generation of educational context summarizing the object.
- **Auto-Processing**: Built-in GLB validation, auto-centering, and auto-scaling.
- **Error Handling**: Graceful fallbacks at every pipeline stage.

## 🏗️ Architecture

```
User Input → Express API → Generative Engine + Context Layer → GLB + Text → React Three Fiber Viewer
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| 3D Viewer | React Three Fiber, @react-three/drei |
| Backend | Node.js, Express |
| 3D Generation | Tripo3D API |
| Text Generation | Google Gemini 2.0 Flash |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- [Tripo3D API key](https://platform.tripo3d.ai) 
- [Google Gemini API key](https://aistudio.google.com/apikey) 

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd AI-Generated-3D-Asset-Pipeline

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (port 3001)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```
├── client/                # React Frontend (Vite)
│   └── src/
│       ├── components/    # UI components (ModelViewer, InputPanel, etc.)
│       ├── services/      # API service layer
│       └── utils/         # Constants and helpers
│
├── server/                # Node.js Backend (Express)
│   └── src/
│       ├── routes/        # API routes
│       ├── services/      # Business logic (Tripo3D, Gemini)
│       └── middleware/    # Error handling, file upload
│
└── docs/                  # Documentation
```

## 🚧 Limitations & Next Steps

### Current Limitations
- **Generation Time**: Complex text prompts or highly detailed images can take up to ~90 seconds to process.
- **GLB Size**: Some generated assets can be mathematically dense (high poly count), which may affect performance on lower-end devices.
- **Texture Control**: Users have limited control over the exact material properties (roughness, metalness) natively through the text prompt.
- **Model Orientation**: Image-to-3D relies tightly on the angle of the provided 2D image; some outputs may require manual rotation in the viewer to face forward perfectly.

### Next Steps & Future Enhancements
- [ ] **Asset Library**: Implement a database (e.g., PostgreSQL + Prisma) to store previously generated assets so users don't have to wait to see past generations.
- [ ] **Model Simplification**: Add a post-processing pipeline step using `glTF-Transform` to auto-decimate and compress the generated GLBs for mobile optimization.
- [ ] **Scene Editor**: Expand the viewer capabilities to allow users to assemble multiple generated models into a single "learning scene."
- [ ] **Advanced Prompt Control**: Expose explicit styling parameters (e.g. "Low Poly", "Photorealistic") to give users more control over the generation process.

## 📝 License

MIT
