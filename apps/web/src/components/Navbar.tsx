import React, { useState, useEffect } from 'react';
import { Volume2, Music, X, Play, Pause } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('9:41 am');
  const [showIpod, setShowIpod] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-10 bg-[#F5F5F5]/95 backdrop-blur-sm border-b border-[#E5E5E5] px-4 text-xs font-mono select-none">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between text-[#000000]">
          {/* Left: Brand + Nav */}
          <div className="flex items-center space-x-6">
            <a href="#" className="font-sans font-medium text-sm text-[#000000] tracking-tight hover:opacity-75">
              heyclicky
            </a>
            <nav className="hidden md:flex items-center space-x-5 text-[#666666]">
              <a href="#features" className="hover:text-[#000000] transition-colors">features</a>
              <a href="#pricing" className="hover:text-[#000000] transition-colors">pricing</a>
              <a href="#trust" className="hover:text-[#000000] transition-colors">trust</a>
              <a href="#changelog" className="hover:text-[#000000] transition-colors">changelog</a>
              <a 
                href="https://github.com/DwijKansagara/heyclicky" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-[#000000] transition-colors"
              >
                open-source
              </a>
            </nav>
          </div>

          {/* Center: Winking Smiley Logo */}
          <div className="flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
              <circle cx="12" cy="12" r="10" />
              {/* Left eye: wink line */}
              <line x1="7.5" y1="10" x2="10.5" y2="10" />
              {/* Right eye: circle */}
              <circle cx="15.5" cy="10" r="1" fill="#000000" />
              {/* Smile */}
              <path d="M8 15a4 4 0 0 0 8 0" />
            </svg>
          </div>

          {/* Right: Clock & Easter Egg & Download */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowIpod(true)}
              title="Click for hidden iPod easter egg"
              className="p-1 hover:bg-[#E5E5E5] rounded transition-colors flex items-center space-x-1 text-[#666666] hover:text-[#000000]"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">retro pod</span>
            </button>
            <span className="text-[#666666] hidden sm:inline">{timeStr}</span>
            <a
              href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
              className="text-[#0F7FFF] font-sans font-medium hover:underline text-xs"
            >
              get heyclicky (.exe)
            </a>
          </div>
        </div>
      </header>

      {/* Hidden iPod Touch Easter Egg Modal */}
      {showIpod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-72 bg-[#1A1A1A] rounded-3xl p-5 border-4 border-[#333333] shadow-2xl text-white relative">
            <button
              onClick={() => setShowIpod(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center font-mono text-[10px] text-gray-400 mb-2">heyclicky classic ipod</div>
            <div className="w-full h-32 bg-sky-950/80 rounded-xl border border-sky-800/50 p-3 flex flex-col justify-between text-xs font-mono">
              <div>
                <div className="text-sky-300 font-sans font-semibold">daft punk - technologic</div>
                <div className="text-sky-400/80 text-[10px]">buy it, use it, break it, fix it</div>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-sky-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-sky-400 h-full ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                </div>
                <div className="flex justify-between text-[9px] text-sky-400/70">
                  <span>1:17</span>
                  <span>4:44</span>
                </div>
              </div>
            </div>

            {/* Click Wheel */}
            <div className="mt-5 mx-auto w-36 h-36 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center relative shadow-inner">
              <span className="absolute top-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono">menu</span>
              <span className="absolute bottom-2 text-[10px] text-gray-400">▶||</span>
              <span className="absolute left-3 text-[10px] text-gray-400">|◀◀</span>
              <span className="absolute right-3 text-[10px] text-gray-400">▶▶|</span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] flex items-center justify-center active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-gray-300" /> : <Play className="w-5 h-5 text-gray-300 translate-x-0.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
