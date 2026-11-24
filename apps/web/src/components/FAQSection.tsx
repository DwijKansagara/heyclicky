import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "what is heyclicky?",
      answer: "heyclicky is an ai buddy for your computer that lives next to your cursor. ask out loud and it sees your screen, teaches you any app, draws right on your display, and runs autonomous agents for you.",
    },
    {
      question: "is my data private?",
      answer: "yes. we never capture your screen unless you press the push-to-talk hotkey (ctrl+alt). screenshots are never stored on disk or server. your requests go directly to google gemini using your own api key.",
    },
    {
      question: "is heyclicky watching my screen all the time?",
      answer: "no. we never look at your screen unless you press the hotkey. when idle, zero screen capture and zero microphone recording takes place.",
    },
    {
      question: "what can heyclicky actually do?",
      answer: "it teaches you any tool (blender, premiere pro, davinci resolve, excel, vs code), walks you through whatever you're stuck on step-by-step, draws right on your screen to point the way, and runs agent buddies that research, write, and build.",
    },
    {
      question: "does it work on windows 10 and 11?",
      answer: "yes! this edition is built specifically for windows 10 and 11 with a sleek native floating island, system tray resident process, and windows credential manager (dpapi) encrypted key storage.",
    },
    {
      question: "how do i get a google gemini api key?",
      answer: "you can get a free api key from google ai studio (aistudio.google.com) in 30 seconds with your google account. paste it once in heyclicky settings and you're good to go forever.",
    },
    {
      question: "what are the open-source mit license terms?",
      answer: "this windows port and replica is released under the mit license, based on the original prototype by farza majeed (farzaa/clicky). made by dwij kansagara with love for the global developer community.",
    },
  ];

  return (
    <section className="py-24 px-4 max-w-4xl mx-auto border-t border-slate-900 select-none">
      <div className="text-center mb-16 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          faq
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          frequently asked questions
        </h2>
        <p className="text-xs text-slate-400">
          what to know about heyclicky, privacy, and getting started on windows.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-200 hover:text-white transition-colors"
              >
                <span>{f.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
