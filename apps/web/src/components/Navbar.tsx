import React, { useState, useEffect } from 'react';
import { Wifi, Headphones, Play, Pause, SkipForward, SkipBack, BatteryMedium, Volume2, Sparkles, X } from 'lucide-react';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [showIPod, setShowIPod] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Buildspace Anthem · Farza');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top OS Menu Bar */}
      <nav className="fixed top-0 left-0 right-0 h-8 bg-slate-950/85 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-3 text-[12px] text-slate-300 font-medium select-none">
        {/* Left items */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-1.5 font-bold text-white hover:text-sky-400 transition-colors">
            <span className="font-mono text-sky-400 font-extrabold text-[13px]">^ ω ^</span>
            <span>heyclicky</span>
          </a>
          <a href="#features" className="hover:text-white transition-colors">features</a>
          <a href="#pricing" className="hover:text-white transition-colors">pricing</a>
          <a href="#trust" className="hover:text-white transition-colors">trust</a>
          <a href="#changelog" className="hover:text-white transition-colors">changelog</a>
          <a
            href="https://github.com/DwijKansagara/heyclicky"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>open-source</span>
          </a>
        </div>

        {/* Right status cluster & Easter eggs */}
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {/* iPod Touch easter egg launcher */}
          <button
            onClick={() => setShowIPod(!showIPod)}
            className="flex items-center gap-1 hover:text-sky-300 px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
            title="Click for hidden iPod easter egg!"
          >
            <Headphones className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">farza’s airpods</span>
          </button>

          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
          </div>

          <div className="flex items-center gap-1 font-mono text-slate-200">
            <span>{time || '1:43 PM'}</span>
          </div>

          <a
            href="https://github.com/DwijKansagara/heyclicky/releases"
            className="px-2.5 py-0.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-sm active:scale-95"
          >
            get heyclicky
          </a>
        </div>
      </nav>

      {/* Retro iPod Touch Easter Egg Modal */}
      {showIPod && (
        <div className="fixed top-12 right-6 z-50 w-72 p-4 rounded-3xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-2xl text-slate-100 select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <Headphones className="w-3.5 h-3.5" />
              <span>iPod Touch · Classics</span>
            </div>
            <button onClick={() => setShowIPod(false)} className="p-1 rounded-md text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Screen area */}
          <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg mb-2">
              🎵
            </div>
            <div className="font-bold text-xs text-slate-200 truncate">{currentTrack}</div>
            <div className="text-[10px] text-sky-400 mt-0.5">Now Playing · 100% Free Beats</div>
          </div>

          {/* Retro Click Wheel Controls */}
          <div className="w-36 h-36 mx-auto rounded-full bg-slate-800/80 border border-slate-700 relative flex items-center justify-center shadow-inner">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 hover:text-white hover:scale-105 transition-all shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <span className="absolute top-2 text-[10px] font-bold text-slate-400">MENU</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-slate-400">►||</span>
            <button
              onClick={() => setCurrentTrack('Clicky Theme Song · Farza')}
              className="absolute left-2 text-slate-400 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTrack('Nights in SF · Dwij')}
              className="absolute right-2 text-slate-400 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-500 mt-3 font-mono">
            Easter Egg found! Built with love.
          </div>
        </div>
      )}
    </>
  );
}
