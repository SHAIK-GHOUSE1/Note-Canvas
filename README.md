<div align="center">

# 🎨 NoteCanvas

</div>

---

## 📖 Overview

**NoteCanvas** is a lightweight, responsive digital whiteboard and drawing application crafted for seamless ideation, sketching, and diagrams. Designed with frosted glassmorphism, high-DPI canvas rendering, and smooth Bézier curve interpolation, NoteCanvas provides a distraction-free creative workspace that feels natural on both desktop and mobile devices.

---

## ✨ Key Features

### 🖌️ Precision Drawing Engine
- **Retina & High-DPI Crisp Rendering**: Automatically compensates for `window.devicePixelRatio` to prevent blurriness on 4K and Retina screens.
- **Natural Stroke Smoothing**: Employs quadratic Bézier curve interpolation to eliminate jagged lines and latency.
- **True Pixel Eraser**: Erases canvas pixels with `destination-out` blending, ensuring authentic eraser behavior across all canvas patterns.
- **Translucent Highlighter**: Soft alpha-blended highlighting tool for annotating diagrams and sketches.

### 📐 Geometric Shapes & Controls
- **Live Drag-to-Draw Shapes**: Draw Rectangles, Circles / Ellipses, Straight Lines, and Directional Arrows with real-time previewing.
- **Outline & Solid Fill Modes**: Easily toggle between hollow geometric wireframes and solid fills via the toolbar paint bucket.
- **Stroke Thickness Options**: 4 distinct stroke weights — Fine (2px), Normal (4px), Bold (8px), and Marker (14px).
- **Curated Color Palette**: Quick-access designer swatches plus a native RGB color picker for infinite custom shades.

### 📜 Canvas Papers & Viewport Controls
- **Flexible Grid Patterns**:
  - **Dots Grid**: Dotted notebook matrix inspired by GoodNotes and Miro.
  - **Square Grid**: Engineering graph paper layout.
  - **Ruled Paper**: Lined notebook paper for text-oriented notes.
  - **Blank Surface**: Clean, distraction-free drafting plane.
- **Viewport Navigation**: Pan & Hand tool (`grab` / `grabbing`) for moving freely around large canvases.
- **Responsive Zoom Engine**: Step zoom (40% to 200%), instant 100% reset, and auto-calculating **Fit to Screen**.

### 🌓 Theming & User Experience
- **Dark Mode & Light Mode**: Fluid WCAG-accessible themes with persistent storage in `localStorage`.
- **Frosted Glass Toolbars**: Modern backdrop blur styling with responsive placement.
- **Non-blocking Toasts**: Dynamic status messages for exports, resets, and clipboard operations.
- **Non-destructive History**: 30-step Undo / Redo history with safety confirmation on canvas wipes.

### 💾 Export & Sharing Suite
- **High-Resolution PNG**: Exports current canvas with proper theme background preservation.
- **Print-Ready PDF**: Generates formatted landscape A4 documents directly in-browser using `jspdf`.

---

## ⌨️ Keyboard Shortcuts

Speed up your creative workflow with built-in hotkeys:

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>⌘</kbd> + <kbd>Z</kbd> | **Undo** | Revert previous stroke or shape action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | **Redo** | Reapply undone stroke action |
| <kbd>P</kbd> | **Pen Tool** | Activate smooth freehand pen |
| <kbd>H</kbd> | **Highlighter** | Activate translucent highlight marker |
| <kbd>E</kbd> | **Eraser** | Activate pixel eraser |
| <kbd>R</kbd> | **Rectangle** | Select rectangle shape tool |
| <kbd>C</kbd> | **Circle** | Select circle / ellipse shape tool |
| <kbd>L</kbd> | **Line** | Select straight line tool |
| <kbd>A</kbd> | **Arrow** | Select directional arrow tool |
| <kbd>Esc</kbd> | **Dismiss** | Close active modals and dropdown menus |

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component architecture, responsive state management, and hooks |
| **Vite 8** | Next-generation frontend build tooling and lightning-fast HMR |
| **HTML5 Canvas API** | High-performance 2D hardware-accelerated raster graphics |
| **Lucide React** | Clean, accessible vector UI icons |
| **jsPDF** | Client-side vector and document generation for A4 exports |
| **Pure CSS Variables** | Fluid dark/light theme switching without runtime overhead |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (version 18 or higher recommended) and npm installed:
```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SHAIK-GHOUSE1/Note-Canvas.git
   cd note-canvas
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the project for production deployment:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
Note Canvas/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Brand graphics and icons
│   ├── components/
│   │   ├── DrawingBoard.jsx# HTML5 Canvas engine & stroke interpolation
│   │   ├── Header.jsx      # Top navigation, export controls & theme switch
│   │   ├── Toast.jsx       # Non-intrusive notification banner system
│   │   └── Workspace.jsx   # Studio toolbar, HUD controls & modal management
│   ├── App.css             # Main component styles & layout rules
│   ├── App.jsx             # Top-level state orchestration & PDF/PNG exports
│   ├── index.css           # Design tokens, themes, shadows & animations
│   └── main.jsx            # React root DOM mount
├── eslint.config.js        # Code quality & linting rules
├── index.html              # HTML5 entrypoint template
├── package.json            # Scripts and dependencies
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

---


