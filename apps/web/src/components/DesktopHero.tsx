import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, X, ExternalLink } from 'lucide-react';

interface MovWindow {
  id: string;
  filename: string;
  title: string;
  youtubeId: string;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  rotation?: number;
}

const MOV_WINDOWS: MovWindow[] = [
  {
    id: 'hello',
    filename: 'hello.mov',
    title: 'introducing heyclicky',
    youtubeId: '3u_vIdn3NYk',
    initialX: 60,
    initialY: 20,
    width: 320,
    height: 200,
    rotation: -1,
  },
  {
    id: 'draw',
    filename: 'heyclicky-draw.mov',
    title: 'real-time 2d screen drawing',
    youtubeId: 'dQw4w9WgXcQ',
    initialX: 860,
    initialY: 40,
    width: 310,
    height: 195,
    rotation: 1.5,
  },
  {
    id: 'usecase',
    filename: 'usecase.mov',
    title: 'multi-step app walkthrough',
    youtubeId: 'jNQXAC9IVRw',
    initialX: 80,
    initialY: 380,
    width: 330,
    height: 205,
    rotation: 1,
  },
  {
    id: 'draws-too',
    filename: 'it-draws-too-omg.mov',
    title: 'interactive 3d models',
    youtubeId: '9bZkp7q19f0',
    initialX: 870,
    initialY: 370,
    width: 310,
    height: 195,
    rotation: -1.5,
  },
  {
    id: 'daddyshome',
    filename: 'daddyshome.mov',
    title: 'heyclicky drive autonomous control',
    youtubeId: 'kJQP7kiw5Fk',
    initialX: 480,
    initialY: 440,
    width: 320,
    height: 200,
    rotation: 0.5,
  },
];

export const DesktopHero: React.FC = () => {
  const [activeZIndex, setActiveZIndex] = useState<Record<string, number>>({});
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; filename: string } | null>(null);

  const bringToFront = (id: string) => {
    const highest = Math.max(0, ...Object.values(activeZIndex)) + 1;
    setActiveZIndex(prev => ({ ...prev, [id]: highest }));
  };

  return (
    <section className="relative w-full min-h-[820px] bg-desktop-dots pt-16 pb-24 px-4 overflow-hidden select-none">
      {/* Centered Main Stage */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Wordmark */}
        <motion.h1 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-sans font-medium text-6xl sm:text-7xl md:text-8xl tracking-tight text-[#000000] lowercase"
        >
          heyclicky
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4 text-base sm:text-lg md:text-xl text-[#333333] max-w-2xl font-sans lowercase leading-relaxed"
        >
          a buddy for your computer. talks, points, draws, drives, and helps you get things done. 100% free and open-source for windows.
        </motion.p>

        {/* Signature Aqua Glass Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-8 flex flex-col items-center"
        >
          <a
            href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
            className="btn-aqua-glass px-8 py-3.5 text-base sm:text-lg font-medium shadow-aqua-glass group"
          >
            <Download className="w-5 h-5 mr-2.5 text-[#000000] group-hover:translate-y-0.5 transition-transform" />
            <span>download for windows (.exe)</span>
          </a>

          {/* Micro-subtext */}
          <div className="mt-4 text-xs font-mono text-[#666666] max-w-lg text-center lowercase leading-relaxed">
            windows 10/11 · made by <span className="text-[#000000] font-medium">dwij kansagara</span> · mit licensed open-source port of farzaa/clicky · powered by google gemini
          </div>
        </motion.div>
      </div>

      {/* Floating Draggable .mov Windows (Desktop) */}
      <div className="hidden lg:block relative max-w-7xl mx-auto h-[620px] -mt-16 pointer-events-none">
        {MOV_WINDOWS.map((win) => {
          const z = activeZIndex[win.id] || 10;
          return (
            <motion.div
              key={win.id}
              drag
              dragMomentum={false}
              onMouseDown={() => bringToFront(win.id)}
              style={{
                zIndex: z,
                left: win.initialX,
                top: win.initialY,
                width: win.width,
              }}
              initial={{ opacity: 0, scale: 0.92, rotate: win.rotation || 0 }}
              animate={{ opacity: 1, scale: 1, rotate: win.rotation || 0 }}
              transition={{ duration: 0.4 }}
              whileDrag={{ scale: 1.02, rotate: 0 }}
              className="absolute pointer-events-auto bg-card rounded-lg shadow-os-window border border-[#D5D5D5] overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {/* OS Window Titlebar */}
              <div className="os-titlebar h-7 px-3 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF736A] flex items-center justify-center group">
                    <span className="text-[7px] text-[#5A0A0A] font-bold opacity-0 group-hover:opacity-100">×</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#19C332]" />
                </div>
                <div className="font-mono text-[11px] text-[#666666] truncate lowercase">
                  {win.filename}
                </div>
                <div className="w-8" />
              </div>

              {/* Window Content: Video Stage */}
              <div 
                onClick={() => setActiveVideo({ id: win.youtubeId, title: win.title, filename: win.filename })}
                className="relative bg-[#1A1A1A] h-40 flex items-center justify-center cursor-pointer group overflow-hidden"
              >
                {/* Poster Artwork Preview */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-neutral-900 to-sky-950/40 opacity-90 group-hover:scale-105 transition-transform duration-300 flex flex-col justify-between p-3">
                  <div className="font-mono text-[10px] text-sky-400/90 lowercase">
                    {win.title}
                  </div>
                  <div className="font-mono text-[9px] text-gray-400 flex items-center justify-between">
                    <span>1080p · 60fps</span>
                    <span className="text-sky-300 group-hover:underline flex items-center">
                      play <Play className="w-2.5 h-2.5 ml-1 fill-current" />
                    </span>
                  </div>
                </div>

                {/* Central Play Button */}
                <div className="relative z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Yellow Sticky Note Easter Egg */}
        <motion.div
          drag
          dragMomentum={false}
          style={{ zIndex: 30, left: 520, top: 120 }}
          className="absolute pointer-events-auto w-64 bg-yellow-sticky rounded-xs p-4 shadow-sticky-note border border-[#E5D220] -rotate-2 cursor-grab active:cursor-grabbing font-sans text-xs text-[#222222] select-none"
        >
          {/* Scotch Tape Graphic at Top */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/60 backdrop-blur-xs border border-white/40 shadow-xs rotate-1" />
          <p className="italic leading-relaxed font-serif text-sm">
            &ldquo;i made clicky because i wanted a real companion on my desktop that could see what i see and help me get things done.&rdquo;
          </p>
          <div className="mt-2 text-right font-mono text-[10px] text-neutral-800">
            &mdash; farza
          </div>
          <div className="mt-2 pt-2 border-t border-black/10 font-mono text-[10px] text-neutral-700 leading-tight">
            windows 10/11 build & gemini integration by <strong>dwij kansagara</strong> (mit licensed, 100% free)
          </div>
        </motion.div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div 
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-card rounded-lg shadow-2xl border border-[#D5D5D5] overflow-hidden"
          >
            <div className="os-titlebar h-8 px-4 flex items-center justify-between">
              <span className="font-mono text-xs text-[#666666]">{activeVideo.filename} &mdash; {activeVideo.title}</span>
              <button 
                onClick={() => setActiveVideo(null)}
                className="text-[#666666] hover:text-[#000000] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#1A1A1A] aspect-video w-full flex items-center justify-center relative">
              <div className="text-center p-6 text-white max-w-md">
                <div className="font-mono text-sm text-sky-400 mb-2">{activeVideo.title}</div>
                <p className="text-xs text-gray-300 font-sans mb-4">
                  live demonstration of heyclicky for windows running on google gemini with real-time screen awareness and audio.
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-aqua-glass px-5 py-2 text-xs font-mono inline-flex items-center"
                >
                  open video on youtube <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
