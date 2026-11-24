import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 pt-16 pb-12 px-4 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-sky-400 font-extrabold text-sm">^ ω ^</span>
              <span className="font-bold text-white text-base">heyclicky</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              an ai buddy that lives on your computer. 100% free forever, powered by google gemini.
            </p>
            <div className="mt-3 text-xs text-sky-400 font-semibold">
              Made by Dwij Kansagara
            </div>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">product</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">pricing ($0 free)</a></li>
              <li><a href="https://github.com/DwijKansagara/heyclicky/releases" className="hover:text-white transition-colors">download for windows (.exe)</a></li>
              <li><a href="https://github.com/DwijKansagara/heyclicky" className="hover:text-white transition-colors">open-source repo</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">resources</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#trust" className="hover:text-white transition-colors">trust & privacy</a></li>
              <li><a href="#changelog" className="hover:text-white transition-colors">changelog (v1.1.7)</a></li>
              <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">google gemini key</a></li>
              <li><a href="https://github.com/farzaa/clicky" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">upstream clicky (mit)</a></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">connect</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="https://github.com/DwijKansagara" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">github / dwijkansagara</a></li>
              <li><a href="https://www.youtube.com/@heyclicky" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">official heyclicky youtube</a></li>
              <li><a href="https://antideploy.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">antideploy cloud</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Attribution */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            *heyclicky only sees your screen when you press the hotkey - screenshots are never stored*
          </div>
          <div>
            MIT Licensed · Original copyright © 2026 Farza Majeed · Windows port copyright © 2026 Dwij Kansagara
          </div>
        </div>
      </div>
    </footer>
  );
}
