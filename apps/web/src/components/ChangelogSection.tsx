import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

export const ChangelogSection: React.FC = () => {
  return (
    <section id="changelog" className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">release history</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            changelog & updates
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            continuous improvements, windows optimizations, and open-source updates.
          </p>
        </div>

        {/* Release Card */}
        <div className="bg-card rounded-lg p-6 sm:p-8 border border-[#E0E0E0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0F0F0] gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#F0F0F0] text-[#000000] font-medium">
                v1.1.7 (windows edition)
              </span>
              <span className="font-sans font-medium text-base text-[#000000] lowercase">
                official windows 10/11 master release
              </span>
            </div>
            <span className="font-mono text-xs text-[#888888]">november 2026</span>
          </div>

          <div className="mt-6 space-y-4 font-sans text-xs text-[#444444] lowercase leading-relaxed">
            <div className="flex items-start space-x-2.5">
              <span className="font-mono text-sky-600 font-bold">•</span>
              <div>
                <strong className="text-[#000000]">low-level wh_keyboard_ll push-to-talk:</strong> compiled c# windows keyboard hook utility runs in the background to capture genuine <code className="bg-[#F0F0F0] px-1 py-0.5 rounded font-mono">ctrl+alt</code> key-down and key-up events with zero latency.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="font-mono text-sky-600 font-bold">•</span>
              <div>
                <strong className="text-[#000000]">google gemini 2.5 smart routing:</strong> seamlessly routes real-time voice, vision, and pointing to gemini 2.5 flash, and complex multi-step reasoning, coding, and 3d generation to gemini 2.5 pro.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="font-mono text-sky-600 font-bold">•</span>
              <div>
                <strong className="text-[#000000]">multi-monitor coordinate translation:</strong> full per-display virtual desktop coordinate translation with custom cubic bezier flight arc animations and scale pulses.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="font-mono text-sky-600 font-bold">•</span>
              <div>
                <strong className="text-[#000000]">heyclicky drive & persistent permissions:</strong> ask once during onboarding, then run autonomous pc actions seamlessly. touching the physical mouse or pressing escape halts all input instantly.
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="font-mono text-sky-600 font-bold">•</span>
              <div>
                <strong className="text-[#000000]">100% free forever:</strong> unlocked every pro and max feature with byok google gemini api key. zero paywalls.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
