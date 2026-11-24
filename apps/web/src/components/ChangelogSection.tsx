import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface HighlightItem {
  name: string;
  detail: string;
  requestedBy?: string;
}

interface ReleaseItem {
  version: string;
  date: string;
  tag: string;
  title: string;
  highlights: HighlightItem[];
}

export default function ChangelogSection() {
  const releases: ReleaseItem[] = [
    {
      version: "1.1.7",
      date: "Nov 21, 2026",
      tag: "Windows & Mac",
      title: "Proactive suggestions are back, drawings that scroll with the page, and next steps after every answer",
      highlights: [
        {
          name: "Drawings scroll with the page",
          detail: "Annotations anchor to their source element and follow vertical/horizontal scrolling or map drags smoothly without pointing at stale spots.",
          requestedBy: "Hryday, Federico Fargion, Ram Prasad, Alex Liu & more",
        },
        {
          name: "Proactive morning suggestions are back",
          detail: "Wake up to opt-in morning agent suggestions under the floating island with yellow-pad plans and estimated times.",
          requestedBy: "Gunnar Arias, Karina, Javi T., Shari, Giulio Valoppi, Li Li & more",
        },
        {
          name: "Next steps after every answer",
          detail: "Actionable suggestions after answers offering deeper follow-ups with automatic 8-row pause logic.",
          requestedBy: "community favorite",
        },
        {
          name: "Change what it typed in-place",
          detail: "When HeyClicky types into Gmail or Notepad, asking it to make it shorter edits text right where it is instead of starting a whole job.",
          requestedBy: "power users",
        },
        {
          name: "Dictation in 117 languages",
          detail: "Added 34 more languages, from Lao and Uyghur to Igbo and Crimean Tatar, with automatic terminal newline safety.",
          requestedBy: "global users",
        },
      ],
    },
    {
      version: "1.1.5",
      date: "Nov 8, 2026",
      tag: "Windows Native Launch",
      title: "HeyClicky Native Edition for Windows 10 & 11",
      highlights: [
        {
          name: "Floating Island for Windows",
          detail: "Sleek top-center island designed specifically for Windows without mimicking a Mac notch.",
        },
        {
          name: "Three.js 3D Visualizer",
          detail: "Generates interactive WebGL 3D models of hearts, solar systems, and geometry on-screen.",
        },
      ],
    },
    {
      version: "1.1.1",
      date: "Oct 23, 2026",
      tag: "Major Milestone",
      title: "Parallel Agent Buddies & HeyClicky Drive",
      highlights: [
        {
          name: "Agent Buddies",
          detail: "Voice-spawned background agents with live plans, checkpoints, and real file artifact outputs.",
        },
        {
          name: "HeyClicky Drive",
          detail: "Autonomous computer control with instant Escape/mouse kill-switch protection.",
        },
      ],
    },
  ];

  return (
    <section id="changelog" className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-900 select-none">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          changelog
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          what’s new in heyclicky
        </h2>
        <p className="text-sm text-slate-400">
          continuous weekly improvements and parity updates.
        </p>
      </div>

      <div className="space-y-12 max-w-4xl mx-auto">
        {releases.map((rel, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold text-sky-400">{rel.version}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                  {rel.tag}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{rel.date}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{rel.title}</h3>

            <div className="space-y-4">
              {rel.highlights.map((h, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-sm font-bold text-slate-200">{h.name}</span>
                    {h.requestedBy && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        (requested by {h.requestedBy})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 pl-6 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
