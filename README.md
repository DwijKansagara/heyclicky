# HeyClicky for Windows (100% Free & Open Source)
### Powered exclusively by Google Gemini (`@google/genai`)

> **Created by Dwij Kansagara**  
> **MIT Licensed — Open Source (based on `farzaa/clicky` by Farza Majeed).**  
> *While the official commercial release is paid for full features ($30–$60/mo), this open-source Windows native build unlocks every feature 100% free forever with zero subscriptions, zero paywalls, and zero artificial caps.*

---

## 🌟 Overview & Core Philosophy

HeyClicky is an AI companion designed from the ground up to break artificial intelligence out of uninspired chat boxes and terminal interfaces. It lives directly on your computer screen next to your cursor:
- Ask out loud and it sees your screen with zero delay.
- Teaches you any application step-by-step (Excel, Blender, Premiere Pro, DaVinci Resolve, VS Code, FL Studio, Windows Settings).
- Draws structured 2D annotations (circles, rings, arrows, highlights) that track content as you scroll.
- Visualizes complex ideas with real-time interactive 3D WebGL scenes.
- Dictates into any focused text field across 117 languages with terminal command safety.
- Spawns parallel background Agent Buddies to research, write, and build deliverables.
- Drives your computer autonomously (HeyClicky Drive) with persistent permission and an instant hard kill-switch.

---

## 🔑 100% Free Forever & Google Gemini Engine

HeyClicky for Windows replaces Claude, ElevenLabs, and AssemblyAI completely with the **Google Gemini API (`@google/genai`)** combined with free local speech fallbacks.

- **Bring Your Own Key (BYOK)**: Works with any free or paid key from [Google AI Studio](https://aistudio.google.com/apikey).
- **Smart Model Routing**:
  - **Gemini Flash / Gemini Live**: Ultra-low-latency voice conversation, vision capture, quick on-screen pointing, and real-time 2D drawing.
  - **Gemini Pro**: Deep multi-step reasoning, complex app walkthroughs, agent buddy task planning, and interactive 3D scene generation.
- **Enterprise-Grade Security**: API keys are encrypted locally using Windows DPAPI (`electron.safeStorage`) — keys are never bundled, transmitted to intermediate proxies, or hardcoded.

---

## 🚀 Key Capabilities & Micro-Interactions

### 1. Windows Floating Island (Not a Mac Notch)
A sleek, rounded floating island positioned just below the top of each Windows 10/11 display. Automatically moves to the active hovered monitor on multi-display setups. Opens and closes with buttery spring transitions and zero black flashes.

### 2. Animated Cursor Companion
A glowing companion following your physical cursor on a spring (~0.2s response, 0.6 damping):
- **Character Skins**: Classic Clicky (`^ ω ^`), Happy Buddy (`{ ^-^ }`), Skeptical Poppy (`(¬_¬)`), Coco Bear (`ʕ•ᴥ•ʔ`), and Shrugger (`¯\_(ツ)_/¯`).
- **Bezier Flight**: Soars along a quadratic parabolic arc to target UI elements, scaling up to ~1.3x at flight apex and settling on landing with an informative speech bubble.
- **Hide Floating Cursor**: When hidden in settings, your buddy says `"okay see you <3"` and gracefully fades out.

### 3. Screen-Aware System Dictation & Terminal Safety
- Supports **117 spoken languages** with automatic grammar refinement.
- **Terminal Newline Safety**: Automatically collapses dangerous newlines inside terminal contexts (PowerShell, Command Prompt, WSL, bash) so dictation never accidentally executes destructive commands.
- **In-Place Editing**: Asking Clicky to make text shorter or warmer rewrites drafts in-place without spawning a job.
- **Custom Dictionary**: Add your personal and organization vocabulary in Settings.

### 4. Real-Time 2D Drawing & Scroll-Tracking Spatial Anchors (v1.1.7 Parity)
- Renders semantic circles, rings, highlights, arrows, and user screen ink.
- **Scroll Tracking**: Anchors annotations to their viewport/window so they smoothly track vertical and horizontal scrolling or map drags, while ignoring unrelated sidebar scrolling.
- **Interactive 3D Visualizer**: Real-time Three.js draggable/rotatable 3D models with clickable parts.
- Clear button is visible ONLY while active drawings remain.

### 5. Voice-Spawned Parallel Agent Buddies
- Run concurrent background tasks with dedicated cards, live plans, and real file deliverables.
- **20-Minute Watchdog**: Automatically halts unresponsive or hung jobs after 20 minutes with a clear explanation, while allowing healthy long-running jobs to proceed cleanly.
- Checkpoint persistence allows resuming tasks from previous milestones.

### 6. HeyClicky Drive (Autonomous Computer Control)
- **One-Time Persistent Permission**: Request PC control permission once (or during onboarding) and select **"Allow Always"**. Subsequent sessions begin immediately without repeat popups.
- **Active-Drive Status Pill**: Visible indicator and glowing border during autonomous control.
- **Instant Hard Kill-Switch**: Physical mouse movement, speaking, or pressing `Escape` immediately aborts Drive control with **zero late queued clicks or keystrokes**.

### 7. Companion Chromium Browser Extension
Manifest V3 companion extension for Chrome, Edge, Brave, Arc, and Vivaldi communicating via authenticated local WebSocket (`ws://127.0.0.1:49152`). Runs agent tasks in an isolated **HeyClicky Tasks** tab group beside your normal tabs. Strictly safeguards passwords, credit cards, and OTPs, and filters prompt injections.

### 8. Connectors & Custom MCP
- Connect personal and work accounts for Gmail, Google Calendar, Google Sheets, Notion, and local files.
- Native Model Context Protocol (MCP) client supporting local `stdio` command servers and remote `SSE` HTTP servers.

### 9. Unlimited Routines & v1.1.7 Morning Suggestions
- Schedule timezone-aware routines with single post-sleep catchup.
- **Morning Suggestions**: Clean proposed jobs under the floating island. Hovering reveals a yellow-pad plan with deliverables and estimated time.
- **Next-Step Pills**: Actionable follow-ups after answers with an automatic 1-hour rest interval after 8 consecutive untapped rows.

---

## 📂 Monorepo Architecture

```
heyclicky/
├── LICENSE                        # Preserved MIT License from farzaa/clicky + attribution
├── README.md                      # Complete documentation & guide
├── TRACEABILITY_MATRIX.md         # Upstream Swift to Windows traceability matrix
├── packages/
│   └── shared/                    # TypeScript schemas, Gemini engine, parsers, primitives
├── apps/
│   ├── desktop/                   # Electron + React + TypeScript Windows desktop application
│   ├── extension/                 # Companion Chromium browser extension (Manifest V3)
│   └── web/                       # 1:1 HeyClicky replica website (React + Vite + Tailwind + Framer)
├── reference/
│   └── clicky-upstream/           # Upstream farzaa/clicky reference repository
├── tests/
│   └── acceptance-matrix.test.mjs # 13-gate test suite (A–M)
└── .github/
    └── workflows/
        └── release-windows.yml    # Automated Windows installer build & GitHub Releases
```

---

## 🛠️ Build & Installation Guide

### Prerequisites
- Windows 10 or 11
- Node.js v20+ or v22+ (tested with Node v24.19.0)
- npm v10+

### 1. Clone & Install
```bash
git clone https://github.com/DwijKansagara/heyclicky.git
cd heyclicky
npm install
```

### 2. Run the 1:1 Website Locally
```bash
npm run dev:web
# Live at http://localhost:3000
```

### 3. Run the Windows Desktop App in Development
```bash
npm run dev:desktop
```

### 4. Run the Acceptance Test Suite
```bash
npm test
```

### 5. Package Windows Installer (`.exe`)
```bash
npm run package:windows
# Generates installer in apps/desktop/dist/HeyClicky Setup 1.1.7.exe
```

---

## 🧪 Acceptance Matrix (A–M) Verified Results

| Gate | Description | Status | Verification Detail |
|---|---|---|---|
| **A** | Install & Start | **PASS** | Clean Windows 10/11 install, NSIS `.exe` configuration, DPAPI encryption, startup control |
| **B** | Voice & Gemini Routing | **PASS** | Gemini Flash for low-latency voice/vision; Gemini Pro for deep reasoning; audio fallback |
| **C** | Privacy First | **PASS** | Zero idle screen/mic capture, local encrypted storage, transparent disclosures |
| **D** | Multi-Monitor Overlay | **PASS** | DPI-aware bounds, negative coordinate mapping, quadratic Bezier curve with 1.3x scale apex |
| **E** | Guided Walkthroughs | **PASS** | Step-by-step numbered beacons, spoken cues, target verification before advancing |
| **F** | 2D Drawing & 3D Models | **PASS** | Scroll-tracking viewport anchors, clear button visibility, interactive Three.js 3D visualizer |
| **G** | Dictation & Safety | **PASS** | 117 languages, auto-grammar, custom dictionary, terminal newline safety collapse |
| **H** | Parallel Agent Buddies | **PASS** | Multi-job state machine, checkpoint retry, real file deliverables, 20-min watchdog |
| **I** | Browser & Drive Control | **PASS** | Isolated task tab group, **Persistent "Allow Always" Permission**, instant mouse/voice/Esc kill-switch |
| **J** | Routines & Suggestions | **PASS** | Morning suggestions with yellow-pad plan hover, next-step pills with 8-row pause logic |
| **K** | Motion & Detail | **PASS** | Smooth floating island expansion without black flashes, 5 cursor skins (`^ ω ^`, `{ ^-^ }`, `(¬_¬)`) |
| **L** | Accessibility & i18n | **PASS** | Full keyboard navigation, high-contrast markers, reduced motion, screen reader labels |
| **M** | Cost & Reliability | **PASS** | Zero paywalls, BYOK Google Gemini key, rate-limit backoff, honest token cost metering |

---

## ⚖️ License & Attribution

- **Original Clicky Prototype**: Copyright (c) 2026 Farza Majeed (`https://github.com/farzaa/clicky`). Released under the MIT License.
- **HeyClicky for Windows & Replica**: Copyright (c) 2026 Dwij Kansagara. Released under the MIT License.

*MIT License — Free to use, modify, distribute, and build upon forever.*
