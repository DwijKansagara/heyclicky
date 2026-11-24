import React from 'react';
import { Check, Sparkles, Key, ShieldCheck } from 'lucide-react';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">pricing & plans</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            100% free forever for windows
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            while the official mac commercial release charges for full features, this open-source windows build unlocks every feature at $0 forever.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Free Tier */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[#888888] lowercase mb-1">starter</div>
              <h3 className="font-sans font-medium text-2xl text-[#000000] lowercase">free tier</h3>
              <div className="mt-4 flex items-baseline">
                <span className="font-sans font-medium text-4xl text-[#000000]">$0</span>
                <span className="ml-2 font-mono text-xs text-[#777777]">/ forever</span>
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] lowercase leading-relaxed">
                basic conversational voice and pointing assistance on your desktop.
              </p>

              <div className="mt-6 pt-6 border-t border-[#F0F0F0] space-y-2.5 font-sans text-xs text-[#333333] lowercase">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>standard voice push-to-talk</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>screen vision & visual question answering</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>bezier pointer flight annotations</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>5 basic cursor buddy expressions</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
                className="w-full py-2.5 px-4 rounded-md border border-[#D5D5D5] bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#000000] font-sans font-medium text-xs flex items-center justify-center transition-colors lowercase"
              >
                download free (.exe)
              </a>
            </div>
          </div>

          {/* Pro Tier (Official $20/mo -> $0 Free) */}
          <div className="bg-card rounded-lg p-6 border-2 border-[#221898] shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#221898] text-white font-mono text-[10px] rounded-full uppercase tracking-wider">
              100% unlocked with byok
            </div>
            <div>
              <div className="font-mono text-xs text-[#221898] lowercase mb-1">power user</div>
              <h3 className="font-sans font-medium text-2xl text-[#000000] lowercase">pro tier</h3>
              <div className="mt-4 flex items-baseline">
                <span className="font-sans font-medium text-4xl text-[#000000]">$0</span>
                <span className="ml-2 font-mono text-xs text-[#777777]">
                  <span className="line-through text-red-500 mr-1">$20/mo</span> free forever
                </span>
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] lowercase leading-relaxed">
                official $20/mo tier included free forever using your free google gemini api key.
              </p>

              <div className="mt-6 pt-6 border-t border-[#F0F0F0] space-y-2.5 font-sans text-xs text-[#333333] lowercase">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>everything in free</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>real-time 2d screen drawing overlays</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>interactive 3d anatomy and physics visualizers</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>unlimited dictation with auto grammar</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>multi-step guided walkthroughs</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
                className="btn-aqua-glass w-full py-2.5 px-4 text-xs font-medium text-[#000000] lowercase"
              >
                get pro free (.exe)
              </a>
            </div>
          </div>

          {/* Max Tier (Official $100/mo -> $0 Free) */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[#888888] lowercase mb-1">autonomous</div>
              <h3 className="font-sans font-medium text-2xl text-[#000000] lowercase">max tier</h3>
              <div className="mt-4 flex items-baseline">
                <span className="font-sans font-medium text-4xl text-[#000000]">$0</span>
                <span className="ml-2 font-mono text-xs text-[#777777]">
                  <span className="line-through text-red-500 mr-1">$100/mo</span> free forever
                </span>
              </div>
              <p className="mt-3 font-sans text-xs text-[#555555] lowercase leading-relaxed">
                official $100/mo tier included free forever. autonomous computer control and agent buddies.
              </p>

              <div className="mt-6 pt-6 border-t border-[#F0F0F0] space-y-2.5 font-sans text-xs text-[#333333] lowercase">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>everything in pro</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>heyclicky drive (autonomous mouse & keyboard)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>parallel background agent buddies (gemini pro)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>100+ connectors architecture & mcp support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-[#221898] mr-2 shrink-0" />
                  <span>v1.1.7 routines and morning proactive suggestions</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/DwijKansagara/heyclicky/releases/download/v1.1.7/HeyClicky.Setup.1.1.7.exe"
                className="w-full py-2.5 px-4 rounded-md border border-[#D5D5D5] bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#000000] font-sans font-medium text-xs flex items-center justify-center transition-colors lowercase"
              >
                get max free (.exe)
              </a>
            </div>
          </div>
        </div>

        {/* BYOK Callout Banner */}
        <div className="mt-12 bg-white rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="font-sans font-medium text-sm text-[#000000] lowercase">
                bring your own key (byok) via google ai studio
              </div>
              <p className="font-sans text-xs text-[#666666] lowercase mt-0.5">
                get your free api key in 30 seconds at aistudio.google.com. zero credit card required, stored safely in windows credential manager (dpapi).
              </p>
            </div>
          </div>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-4 py-2 rounded-md bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#D5D5D5] font-mono text-xs text-[#000000] lowercase transition-colors"
          >
            get google api key &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
