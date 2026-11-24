import React from 'react';
import { Eye, HardDrive, Cpu, BookOpen, UserX, Trash2 } from 'lucide-react';

export default function TrustSection() {
  const points = [
    {
      icon: Eye,
      title: "screen",
      desc: "heyclicky only sees your screen when you ask it for help. never idle in the background.",
    },
    {
      icon: HardDrive,
      title: "storage",
      desc: "we don't keep your screenshots. your conversation history stays strictly on your local PC.",
    },
    {
      icon: Cpu,
      title: "processing",
      desc: "your requests go directly to google gemini via your own official API key without middleman servers.",
    },
    {
      icon: BookOpen,
      title: "training",
      desc: "google does not train its frontier foundation models on data submitted via api keys.",
    },
    {
      icon: UserX,
      title: "sharing",
      desc: "zero tracking, zero analytics, zero selling of your personal data.",
    },
    {
      icon: Trash2,
      title: "deletion",
      desc: "delete your data or remove your api key anytime in settings with a single click.",
    },
  ];

  return (
    <section id="trust" className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-900 select-none">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          the fine print
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          what happens to your data
        </h2>
        <p className="text-sm text-slate-400">
          honest, clear, and uncompromising privacy for the windows desktop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm font-bold text-white lowercase mb-2">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
