import React from 'react';
import { Mic, Sparkles, Navigation, Edit3, Bot, MousePointer, Layers, FileCode, Clock, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "Talk & Voice Mode",
      badge: "Gemini Flash Low-Latency",
      description: "Ask out loud while looking at any application. HeyClicky sees your screen, answers in real time with zero delay, and speaks back naturally.",
    },
    {
      icon: Sparkles,
      title: "Real-Time 2D & 3D Drawing",
      badge: "Scroll-Tracking Anchored",
      description: "Draws circles, rings, arrows, and highlights right on top of your apps. Annotations anchor to content and scroll smoothly with the page. Generates interactive 3D WebGL scenes on-the-fly.",
    },
    {
      icon: Navigation,
      title: "Guided Step-by-Step Walkthroughs",
      badge: "10-15+ Steps",
      description: "Learning Blender, Premiere Pro, DaVinci Resolve, or Excel? HeyClicky points with a high-contrast beacon at exactly what button to click next, waits for you, and walks you all the way to done.",
    },
    {
      icon: Edit3,
      title: "Screen-Aware System Dictation",
      badge: "117 Languages",
      description: "Dictate into Notepad, Gmail, or your IDE. Refines grammar, respects your tone, protects terminal commands by collapsing dangerous newlines, and saves words to your custom dictionary.",
    },
    {
      icon: MousePointer,
      title: "HeyClicky Drive (Computer Control)",
      badge: "Persistent Permission + Instant Kill",
      description: "Autonomous Windows control. Grant permission once ('Allow Always') and it moves the mouse, clicks, scrolls, and types. Physical mouse movement, speaking, or pressing Escape halts control instantly.",
    },
    {
      icon: Bot,
      title: "Parallel Agent Buddies",
      badge: "Multi-Job Concurrency",
      description: "Spawn multiple background agents by voice. Each has its own live plan, checkpoint recovery, artifact outputs, and a 20-minute watchdog that stops hung jobs automatically.",
    },
    {
      icon: Clock,
      title: "Unlimited Routines & Morning Suggestions",
      badge: "v1.1.7 Parity",
      description: "Schedule recurring workflows that catch up gracefully after Windows sleep. Enjoy opt-in morning suggestions with yellow-pad plans and next-step suggestion pills after every answer.",
    },
    {
      icon: FileCode,
      title: "100+ Connectors & Custom MCP",
      badge: "Stdio & SSE",
      description: "Connect personal and work accounts for Gmail, Calendar, Sheets, Notion, and local files. Plugs natively into Model Context Protocol (MCP) servers to discover real external tools.",
    },
    {
      icon: ShieldCheck,
      title: "Windows 10/11 Native Shell",
      badge: "100% Free & Open Source",
      description: "Runs as a floating island just below the top of each screen with system tray integration, DPAPI encrypted key storage, startup control, and zero continuous desktop recording.",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 max-w-7xl mx-auto relative select-none">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          Full Max-Tier Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          everything you wished your computer could do
        </h2>
        <p className="text-sm text-slate-400">
          no mockups, no artificial caps, no paywalls. every feature unlocked 100% free forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all hover:bg-slate-900/90 shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
