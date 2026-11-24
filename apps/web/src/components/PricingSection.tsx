import React, { useState } from 'react';
import { Check, Sparkles, Key } from 'lucide-react';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  const plans = [
    {
      name: "free",
      tagline: "see what the fuss is about.",
      bestFor: "best for trying it out",
      price: "$0",
      subprice: "free forever, no card needed",
      cta: "start free",
      isPopular: false,
      features: [
        "limited usage every day in official app",
        "points to exactly where to click",
        "voice answers about your screen",
        "a few drawings and agents a day",
        "connect up to 2 of your apps",
      ],
      freeForeverUnlock: "In this open-source build: 100% unlocked with zero limits using your Gemini key",
    },
    {
      name: "pro",
      tagline: "learn and get unstuck, all day.",
      bestFor: "best for everyday use",
      price: "$0",
      officialPrice: "$30/mo",
      subprice: "100% Free & Open Source (official is $30/mo)",
      cta: "get pro for $0",
      isPopular: true,
      features: [
        "everything in free, plus",
        "50x more usage than free",
        "drawings whenever you ask",
        "walkthroughs all the way to done",
        "agents that research, write and build",
        "100+ apps and unlimited dictation",
      ],
      freeForeverUnlock: "Full Pro features included at $0 forever via Google Gemini API",
    },
    {
      name: "max",
      tagline: "all the hands you need.",
      bestFor: "best for power users",
      price: "$0",
      officialPrice: "$60/mo",
      subprice: "100% Free & Open Source (official is $60/mo)",
      cta: "get max for $0",
      isPopular: false,
      features: [
        "everything in pro, plus",
        "250x more usage than free",
        "talk, point and draw all day",
        "lots of agent jobs at once",
        "as many routines as you need",
        "drives your computer all day",
      ],
      freeForeverUnlock: "Full Max tier unlocked forever: unlimited Drive, parallel agents & routines",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-900 select-none">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          heyclicky, your way
        </h2>
        <p className="text-sm text-slate-400">
          three simple plans. while commercial releases charge $30–$60/mo, this open-source Windows edition unlocks <strong>every tier at $0</strong> using your own free Google Gemini API key.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium mt-4">
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-3 py-1 rounded-full transition-all ${
              billingCycle === 'yearly' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            yearly <span className="text-[10px] opacity-80">-100% Free</span>
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1 rounded-full transition-all ${
              billingCycle === 'monthly' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            monthly
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`relative p-8 rounded-3xl flex flex-col justify-between transition-all ${
              p.isPopular
                ? 'bg-slate-900/90 border-2 border-sky-400 shadow-2xl shadow-sky-500/10'
                : 'bg-slate-900/50 border border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {p.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                popular · 100% free
              </div>
            )}

            <div>
              <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">{p.name}</div>
              <div className="text-sm font-bold text-white mt-1">{p.tagline}</div>
              <div className="text-xs text-slate-400 mt-0.5 mb-6">{p.bestFor}</div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium mb-6">{p.subprice}</div>

              <a
                href="https://github.com/DwijKansagara/heyclicky/releases"
                className={`w-full py-3 rounded-2xl text-center block text-xs font-bold transition-all active:scale-95 shadow-md ${
                  p.isPopular
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {p.cta}
              </a>

              {/* Free Forever Badge */}
              <div className="mt-4 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 font-medium leading-tight">
                {p.freeForeverUnlock}
              </div>

              {/* Feature List */}
              <div className="mt-6 space-y-3 pt-6 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">includes:</div>
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Discount Box */}
      <div className="max-w-2xl mx-auto mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
        <div className="font-mono text-xs text-sky-400 font-bold">&lt; student & developer discount &gt;</div>
        <h3 className="text-base font-bold text-white">100% Free Forever for Students, Researchers & Creators</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
          No credit card, no subscription, and no paywalls. Plug in your free Google AI Studio key and use full Max-tier HeyClicky capability permanently.
        </p>
      </div>
    </section>
  );
}
