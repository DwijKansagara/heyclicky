import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Monitor, Play, FileText, X, Minus, Square } from 'lucide-react';

interface MovWindow {
  id: string;
  title: string;
  youtubeId: string;
  defaultPos: { x: number; y: number };
  width: number;
  height: number;
}

export default function DesktopHero() {
  const [selectedBuddyFace, setSelectedBuddyFace] = useState('^ ω ^');
  const [activeWindowId, setActiveWindowId] = useState<string>('hello');
  const [openWindows, setOpenWindows] = useState<string[]>([
    'hello',
    'draw',
    'notes',
    'threeD',
  ]);

  const windows: MovWindow[] = [
    {
      id: 'hello',
      title: 'hello.mov',
      youtubeId: 'ER8TCqFjaYI',
      defaultPos: { x: 30, y: 40 },
      width: 440,
      height: 260,
    },
    {
      id: 'draw',
      title: 'heyclicky-draw.mov',
      youtubeId: 'nT16HPxYX-s',
      defaultPos: { x: 480, y: 70 },
      width: 420,
      height: 250,
    },
    {
      id: 'threeD',
      title: 'it-draws-too-omg.mov',
      youtubeId: 'xOkfw1_ePhg',
      defaultPos: { x: 120, y: 310 },
      width: 420,
      height: 250,
    },
    {
      id: 'daddyshome',
      title: 'daddyshome.mov',
      youtubeId: 'xd6zqghDDb0',
      defaultPos: { x: 550, y: 330 },
      width: 430,
      height: 255,
    },
  ];

  const toggleWindow = (id: string) => {
    if (openWindows.includes(id)) {
      setOpenWindows(openWindows.filter((w) => w !== id));
    } else {
      setOpenWindows([...openWindows, id]);
      setActiveWindowId(id);
    }
  };

  return (
    <div className="relative pt-24 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10 mb-12">
        {/* Interactive Buddy Face Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-lg backdrop-blur-md">
          <span className="text-xs text-slate-400">meet your buddy:</span>
          {['^ ω ^', '{ ^-^ }', '(¬_¬)', '¯\\_(ツ)_/¯'].map((face) => (
            <button
              key={face}
              onClick={() => setSelectedBuddyFace(face)}
              className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-all ${
                selectedBuddyFace === face
                  ? 'bg-sky-500 text-slate-950 shadow-sm scale-105'
                  : 'text-sky-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {face}
            </button>
          ))}
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          an ai buddy that lives <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            on your computer
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          ask out loud and it sees your screen, teaches you any app, draws right on your display, and runs autonomous agents for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download for Windows (.exe) — Free & Open Source</span>
          </a>

          <a
            href="https://github.com/DwijKansagara/heyclicky"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Attribution Subtext */}
        <div className="text-xs text-slate-400 pt-1 font-medium">
          Made by <strong className="text-slate-200">Dwij Kansagara</strong> · MIT Licensed Open-Source Windows Port · Powered by Google Gemini
        </div>
      </div>

      {/* Desktop Canvas Window Launcher Bar */}
      <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto py-2">
        <span className="text-[11px] font-mono text-slate-400 mr-2">Click to open video demos:</span>
        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() => toggleWindow(w.id)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all border ${
              openWindows.includes(w.id)
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {w.title}
          </button>
        ))}
        <button
          onClick={() => toggleWindow('notes')}
          className={`px-3 py-1 rounded-xl text-xs font-mono transition-all border ${
            openWindows.includes('notes')
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          the dream (notes)
        </button>
      </div>

      {/* Draggable Desktop Canvas Area */}
      <div className="relative min-h-[580px] w-full rounded-3xl bg-slate-950/70 border border-slate-800/80 p-4 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* DRAGGABLE VIDEO WINDOWS */}
        {windows.map((w) => {
          if (!openWindows.includes(w.id)) return null;
          const isTop = activeWindowId === w.id;

          return (
            <motion.div
              key={w.id}
              drag
              dragMomentum={false}
              onMouseDown={() => setActiveWindowId(w.id)}
              initial={{ x: w.defaultPos.x, y: w.defaultPos.y, opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ zIndex: isTop ? 30 : 20 }}
              className="absolute rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl cursor-move"
            >
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800/90 border-b border-slate-700/60 select-none">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOpenWindows(openWindows.filter((id) => id !== w.id))}
                    className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-400 transition-colors"
                  />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                </div>
                <div className="font-mono text-xs font-semibold text-slate-300 truncate px-2">{w.title}</div>
                <div className="w-10" />
              </div>

              {/* YouTube Video Player Embed */}
              <div className="relative bg-black" style={{ width: `${w.width}px`, height: `${w.height}px` }}>
                <iframe
                  src={`https://www.youtube.com/embed/${w.youtubeId}?autoplay=0&rel=0`}
                  title={w.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          );
        })}

        {/* CEO / FOUNDER'S NOTE STICKY WINDOW ("the dream" / "notes") */}
        {openWindows.includes('notes') && (
          <motion.div
            drag
            dragMomentum={false}
            onMouseDown={() => setActiveWindowId('notes')}
            initial={{ x: 260, y: 160, opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ zIndex: activeWindowId === 'notes' ? 35 : 25 }}
            className="absolute w-96 rounded-2xl bg-[#fef08a] text-slate-900 p-5 shadow-2xl border border-amber-300 font-sans cursor-move select-none"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amber-300/80 mb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 font-mono">the dream · notes</span>
              <button
                onClick={() => setOpenWindows(openWindows.filter((id) => id !== 'notes'))}
                className="p-1 rounded hover:bg-amber-300/60 text-amber-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Verbatim founder note from heyclicky.com */}
            <div className="text-xs leading-relaxed space-y-2 text-slate-800">
              <p>we all have access to the same ai models, yet very few of us unlock their full power!</p>
              <p className="font-semibold">we just believe it's an interface problem.</p>
              <p>
                we wanna take the same frontier models everyone else is using, and make it so this technology can break out of uninspired chat interfaces and clunky terminals.
              </p>
              <p>we're trying to figure out the ai interface the next billion people will use. it's early! try out what we have today and lmk what you think.</p>
              <div className="pt-2 font-mono text-[11px] text-amber-950 font-bold border-t border-amber-300/60 flex items-center justify-between">
                <span>farza, founder</span>
                <span className="text-[10px] text-amber-800 font-sans">MIT Licensed Heritage</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
