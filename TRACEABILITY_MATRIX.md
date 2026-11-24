# HEYCLICKY FOR WINDOWS — TRACEABILITY MATRIX

**Project**: HeyClicky for Windows (100% Free, Open-Source, Google Gemini-Powered Replica + Companion Extension + 1:1 Website)  
**Author**: Dwij Kansagara  
**Base MIT Heritage**: `farzaa/clicky` (Farza Majeed)  
**Version**: 1.1.7 (Parity with Nov 21, 2026 Official Release)  
**License**: MIT License  

---

## Traceability Mapping: Requirements → Upstream Reference → Windows Implementation

| Req ID | Capability / Feature | Upstream Reference (`farzaa/clicky` & `heyclicky.com`) | Windows Implementation in Monorepo | Gemini Model Routing & Engine | Acceptance Gate |
|---|---|---|---|---|---|
| **REQ-01** | Attribution & Licensing | `LICENSE`, `README.md` in `farzaa/clicky` | `LICENSE`, `README.md`, `apps/web/src/components/*`, `apps/desktop/src/components/AboutPanel.tsx` | N/A (Attribution: Made by Dwij Kansagara · MIT Licensed based on farzaa/clicky) | Gate A, Gate M |
| **REQ-02** | 100% Free Forever / Zero Paywalls | Official Pricing ($30/$60/mo) | `packages/shared/src/config.ts`, `apps/web/src/components/PricingSection.tsx`, `apps/desktop/src/settings/*` | BYOK via Google AI Studio (`aistudio.google.com`), Zero software artificial caps | Gate M |
| **REQ-03** | Google Gemini Engine Gateway | `worker/src/index.ts`, `ClaudeAPI.swift` (Anthropic) | `packages/shared/src/gemini/provider.ts`, `apps/desktop/src/services/gemini.ts` | `@google/genai` SDK: Gemini 2.5/3.0 Flash for low latency vision/voice; Gemini Pro for reasoning & 3D | Gate B, Gate M |
| **REQ-04** | Windows Floating Island Shell | macOS `MenuBarPanelManager.swift`, `NSStatusItem` | `apps/desktop/src/main/floating-island.ts`, `apps/desktop/src/renderer/FloatingIsland.tsx` | Sleek top-center island, non-activating transparent click-through overlay, zero black flash | Gate A, Gate D, Gate K |
| **REQ-05** | Animated Cursor Companion | `OverlayWindow.swift`, `BlueCursorView`, `CompanionResponseOverlay.swift` | `apps/desktop/src/renderer/CursorCompanion.tsx`, `packages/shared/src/primitives.ts` | Spring physics (~0.2s response, 0.6 damping), Bezier arc flight, skins (`^ ω ^`, `{ ^-^ }`, `(¬_¬)`, Coco, Poppy) | Gate D, Gate K |
| **REQ-06** | Push-to-Talk & Streaming Voice | `BuddyDictationManager.swift`, `GlobalPushToTalkShortcutMonitor.swift`, `AssemblyAIStreamingTranscriptionProvider.swift` | `apps/desktop/src/main/shortcuts.ts`, `apps/desktop/src/services/voice.ts`, `packages/shared/src/gemini/live.ts` | Default `Ctrl+Alt`, streaming transcript, audio barge-in, Gemini Live API / Web Speech / SAPI fallback | Gate B, Gate L |
| **REQ-07** | Multi-Monitor Screen Understanding | `CompanionScreenCaptureUtility.swift`, `ElementLocationDetector.swift` | `apps/desktop/src/main/screen-capture.ts`, `apps/desktop/src/services/screen.ts` | Multi-monitor DPI aware capture (100%-200%), `desktopCapturer` / Windows Graphics Capture + UI Automation | Gate C, Gate D |
| **REQ-08** | Pointing & Guided Walkthroughs | `[POINT:x,y:label:screenN]` in `OverlayWindow.swift` | `packages/shared/src/pointing.ts`, `apps/desktop/src/services/walkthrough.ts`, `apps/desktop/src/renderer/PointingOverlay.tsx` | 10–15+ multi-step guided walkthroughs, high-contrast pointer, verification before advancing | Gate E |
| **REQ-09** | Real-Time 2D Drawing & Scroll Tracking | `heyclicky-draw.mov`, v1.1.7 changelog | `apps/desktop/src/renderer/CanvasDrawingOverlay.tsx`, `apps/desktop/src/services/scroll-tracker.ts` | Primitives (circle, ring, arrow, highlight), user ink input, viewport & map scroll tracking, floating photo cards | Gate F |
| **REQ-10** | Interactive 3D Models | `it-draws-too-omg.mov`, Three.js demos | `apps/desktop/src/renderer/ThreeSceneViewer.tsx`, `packages/shared/src/three-generator.ts` | Real-time Three.js/WebGL floating 3D scenes, rotation/zoom, clickable parts, CPU fallback | Gate F |
| **REQ-11** | Screen-Aware System-Wide Dictation | `BuddyDictationManager.swift`, v1.1.7 117 languages | `apps/desktop/src/services/dictation.ts`, `apps/desktop/src/main/input-injector.ts` | 117 languages, UI Automation/SendInput direct text injection, terminal newline safety, custom dictionary | Gate G |
| **REQ-12** | Voice-Spawned Parallel Agent Buddies | `qlFgqOVcfdg` Agent Buddies demo, `Bo5v6QxsLnw` | `apps/desktop/src/services/agent-buddies.ts`, `apps/desktop/src/renderer/AgentCards.tsx` | State machine (queued->planning->running->waiting->completed/failed), checkpoints, 20-min watchdog | Gate H |
| **REQ-13** | HeyClicky Drive (Computer Control) | Official HeyClicky Drive | `apps/desktop/src/services/drive.ts`, `apps/desktop/src/main/input-injector.ts` | Autonomous mouse/keyboard control, **One-Time Persistent "Allow Always" Permission** + hard instant kill-switch (mouse move / voice / Esc) | Gate I |
| **REQ-14** | Companion Chromium Extension | Official HeyClicky Chrome extension | `apps/extension/*` (Manifest V3) | Isolated task tab group, DOM context, WebSocket native bridge, prompt-injection defense | Gate I |
| **REQ-15** | Connectors & Custom MCP Support | Official 100+ connectors, MCP spec | `apps/desktop/src/services/connectors/*`, `apps/desktop/src/services/mcp-client.ts` | Gmail, Calendar, Sheets, Notion, Local Files; Local stdio & remote SSE MCP client | Gate H, Gate M |
| **REQ-16** | Routines & Skills Manager | Official v1.1.7 routines & custom prompts | `apps/desktop/src/services/routines.ts`, `apps/desktop/src/services/skills.ts` | Scheduled workflows, single post-sleep catchup, Markdown `.md` skills import/export | Gate J |
| **REQ-17** | v1.1.7 Morning Suggestions & Next-Step Pills | v1.1.7 changelog (Nov 21, 2026) | `apps/desktop/src/renderer/MorningSuggestions.tsx`, `apps/desktop/src/renderer/NextStepPills.tsx` | Yellow-pad plan hover, Do It / Adjust / Nah, 8-row 1-hour rest interval | Gate J, Gate K |
| **REQ-18** | First-Run Onboarding Tour | Official interactive first-run tour | `apps/desktop/src/renderer/OnboardingTour.tsx` | Morphing cursor, Gemini API key BYOK setup, permissions, hotkey practice, voice hello, demo drawing & drive | Gate A, Gate C |
| **REQ-19** | Resizable Sidebar, Audio Chimes & Full Settings | `CompanionPanelView.swift`, `DesignSystem.swift` | `apps/desktop/src/renderer/SidebarWindow.tsx`, `apps/desktop/src/services/audio.ts`, `apps/desktop/src/renderer/SettingsView.tsx` | Original audio chimes (pre-roll, volume/mute), 13 complete Settings tabs, full light/dark themes | Gate K, Gate L |
| **REQ-20** | 1:1 Official Website Replica | `https://www.heyclicky.com` & `/for-windows` | `apps/web/*` (React + TS + Vite + Tailwind + Framer Motion) | Exact OS top bar, draggable video windows, iPod easter egg, Farza founder note, feedback wall, $0 BYOK pricing | Gate M, Antideploy |
| **REQ-21** | Installer Packaging & Antideploy Live Deploy | GitHub Releases & Antideploy | `.github/workflows/release-windows.yml`, `apps/desktop/electron-builder.json`, `antideploy.json` | NSIS `.exe` installer generated, live deployment at `heyclicky.antideploy.app` | Gate A, Gate M |

---
*Created and verified by Dwij Kansagara, November 2026.*
