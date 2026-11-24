import React from 'react';
import { Heart, Github, Download, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5F5F5] py-14 px-4 border-t border-[#E5E5E5] text-xs font-sans text-[#666666]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center space-x-2 text-[#000000] font-medium text-sm mb-2">
            <span>heyclicky for windows</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EAEAEA] text-[#333333]">v1.1.7</span>
          </div>
          <p className="lowercase max-w-md leading-relaxed text-[#555555]">
            mit licensed &mdash; open source (based on <a href="https://github.com/farzaa/clicky" target="_blank" rel="noreferrer" className="underline hover:text-[#000000]">farzaa/clicky</a>). while the official commercial app charges for full features, this open-source windows build unlocks every feature 100% free forever.
          </p>
          <div className="mt-3 font-mono text-[11px] text-[#777777]">
            crafted by <span className="text-[#000000] font-medium">dwij kansagara</span> · powered by google gemini
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
          <a
            href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
            className="text-[#0F7FFF] font-medium hover:underline flex items-center"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            download .exe
          </a>
          <a
            href="https://github.com/DwijKansagara/heyclicky"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#000000] flex items-center transition-colors"
          >
            <Github className="w-3.5 h-3.5 mr-1" />
            github
          </a>
          <a
            href="https://github.com/DwijKansagara/heyclicky/releases"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#000000] transition-colors"
          >
            releases
          </a>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#000000] flex items-center transition-colors"
          >
            google ai studio <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
          </a>
        </div>
      </div>
    </footer>
  );
};
