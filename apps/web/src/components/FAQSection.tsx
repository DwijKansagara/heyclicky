import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "how is this completely free with zero paywalls?",
    a: "this is an independent, 100% free and open-source windows port of farzaa/clicky created by dwij kansagara. instead of paying $20-$100/mo for a commercial subscription, it connects directly to your own google gemini api key from google ai studio, which offers generous free tier limits for developers.",
  },
  {
    q: "where do i get a google gemini api key?",
    a: "you can get a free api key in 30 seconds at aistudio.google.com. sign in with your google account and click 'create api key'. paste it once into heyclicky settings; it is stored securely in windows credential manager (dpapi).",
  },
  {
    q: "how does the ctrl+alt push-to-talk shortcut work on windows?",
    a: "standard windows api doesn't emit key-release events for bare modifier keys like ctrl+alt. heyclicky bundles a lightweight, compiled c# low-level hook (wh_keyboard_ll) that detects the exact millisecond both keys are pressed and released, giving you instant push-to-talk with zero lag.",
  },
  {
    q: "is my screen recorded continuously?",
    a: "no! heyclicky follows a strict privacy boundary: zero continuous background recording. your screen is only captured at the exact instant you press push-to-talk (ctrl+alt) or ask a question, and snapshots are immediately released after processing.",
  },
  {
    q: "how does heyclicky drive safety work?",
    a: "heyclicky drive features an instant hardware kill-switch. the moment you move your physical mouse, start speaking, or press the escape key, all simulated keystrokes and mouse movements are aborted in under 1 millisecond.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">frequently asked questions</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            everything you need to know
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            answers about licensing, keys, privacy, and windows compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-card rounded-lg border border-[#E0E0E0] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-sans font-medium text-[#000000] lowercase hover:bg-[#FAFAFA]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#777777] transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#000000]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs font-sans text-[#555555] lowercase leading-relaxed border-t border-[#F0F0F0]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
