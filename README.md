# 🧊 AI-Generated 3D Asset Pipeline

> AI-powered pipeline that generates 3D models from text descriptions or images, with educational summaries — built for a learning platform.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)
![Express](https://img.shields.io/badge/Express-4-000?logo=express)
![Tripo3D](https://img.shields.io/badge/Tripo3D-3D_Gen-purple)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-blue?logo=google)

---

## ✨ Features

- **Text-to-3D**: Describe any object and get a 3D model in under a minute
- **Image-to-3D**: Upload a reference image to generate a matching 3D asset
- **Interactive Viewer**: Rotate, zoom, and pan the 3D model with React Three Fiber
- **Educational Summaries**: AI-generated 2-sentence educational content about the object
- **Auto-Processing**: GLB validation, auto-centering, and auto-scaling
- **Error Handling**: Graceful fallbacks at every pipeline stage

## 🏗️ Architecture

```
User Input → Express API → Tripo3D (3D Gen) + Gemini (Summary) → GLB + Text → React Three Fiber Viewer
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
- [Tripo3D API key](https://platform.tripo3d.ai) (free tier available)
- [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)

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
│       ├── hooks/         # Custom React hooks
│       ├── services/      # API service layer
│       └── utils/         # Constants and helpers
│
├── server/                # Node.js Backend (Express)
│   └── src/
│       ├── routes/        # API routes
│       ├── services/      # Business logic (Tripo3D, Gemini)
│       ├── middleware/     # Error handling, file upload
│       └── utils/         # Logging
│
└── docs/                  # Documentation
    └── DEV_LOG.md         # Technical decisions log
```

## 🔧 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/generate` | Generate 3D asset + educational summary |
| `GET` | `/api/generate/health` | Health check with service status |

## 📝 License

MIT
