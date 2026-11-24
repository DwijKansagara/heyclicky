import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Key, Mic, Monitor, MousePointer, ShieldCheck, Sparkles, X } from 'lucide-react';
import { saveUserSettings, loadUserSettings } from '../services/storage.js';

interface OnboardingTourProps {
  onFinish: () => void;
}

export default function OnboardingTour({ onFinish }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [testInput, setTestInput] = useState('');
  const [userTone, setUserTone] = useState('warm and direct');

  const steps = [
    'Welcome',
    'Gemini Key',
    'Permissions',
    'Hotkey Practice',
    'Screen Drawing',
    'Dictation Test',
    'Preferences',
    'Ready',
  ];

  const handleNext = async () => {
    if (step === 1 && apiKey.trim()) {
      const settings = await loadUserSettings();
      settings.geminiApiKey = apiKey.trim();
      await saveUserSettings(settings);
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-8 select-none">
      <div className="max-w-xl w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl">
        {/* Progress Dots */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-sky-400' : i < step ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onFinish}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Skip Tour
          </button>
        </div>

        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 mx-auto rounded-3xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-mono text-2xl font-bold shadow-xl shadow-sky-500/10"
            >
              ^ ω ^
            </motion.div>
            <h1 className="text-2xl font-extrabold text-white">hey! i'm clicky</h1>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your free, open-source AI buddy for Windows 10 & 11, powered by Google Gemini. Let's get you set up in 2 minutes.
            </p>
            <div className="text-[11px] text-sky-400/80 font-medium">Made by Dwij Kansagara · MIT Licensed</div>
          </motion.div>
        )}

        {/* STEP 1: GEMINI API KEY */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
              <Key className="w-4 h-4" />
              <span>Step 1: Paste Your Google Gemini Key</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              HeyClicky is 100% free with zero paywalls. Just bring your free Google Gemini API key from Google AI Studio.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste AIzaSy... API key"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Encrypted with Windows DPAPI.</span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline font-semibold"
              >
                Get a free key →
              </a>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PERMISSIONS */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Step 2: Windows Permissions</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>Screen Capture (Only when hotkey pressed)</span>
                </span>
                <span className="text-emerald-400 font-bold">Ready</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-400" />
                  <span>Microphone Audio</span>
                </span>
                <span className="text-emerald-400 font-bold">Granted</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-sky-400" />
                  <span>HeyClicky Drive (Autonomous Control)</span>
                </span>
                <span className="text-amber-400 font-bold">Allow Always</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: HOTKEY PRACTICE */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h2 className="text-base font-bold text-white">Press & Hold Ctrl + Alt</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Whenever you're stuck in any app, hold <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-sky-300 text-xs">Ctrl + Alt</kbd> and ask out loud. Release when you're done speaking.
            </p>
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono">
              [ Ctrl + Alt ] · Push-to-Talk Active
            </div>
          </motion.div>
        )}

        {/* STEP 4: SCREEN DRAWING DEMO */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-base font-bold text-white">Real-Time Screen Drawing</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clicky draws directly on top of your apps with high-contrast circles, arrows, and highlights, and even 3D models when explaining complex concepts.
            </p>
            <div className="relative h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-full border-2 border-sky-400 flex items-center justify-center text-xs text-sky-300 font-bold"
              >
                Focus
              </motion.div>
              <div className="absolute bottom-2 text-[10px] text-slate-500">Live scroll-anchored drawing demonstration</div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: DICTATION TEST */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-base font-bold text-white">Screen-Aware System Dictation</h2>
            <p className="text-xs text-slate-300">
              Try typing or dictating below. HeyClicky automatically fixes grammar and safeguards terminals.
            </p>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Test typing or speech refinement here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </motion.div>
        )}

        {/* STEP 6: PREFERENCES */}
        {step === 6 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-base font-bold text-white">How do you like your answers?</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { tone: 'warm and direct', label: 'Warm & Direct', desc: 'Friendly, concise, zero fluff' },
                { tone: 'deep and technical', label: 'Deep & Technical', desc: 'Detailed code, architecture & proofs' },
                { tone: 'playful buddy', label: 'Playful Buddy', desc: 'Casual, expressive, emojis' },
                { tone: 'minimalist', label: 'Minimalist', desc: 'Bullet points only' },
              ].map((t) => (
                <button
                  key={t.tone}
                  onClick={() => setUserTone(t.tone)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    userTone === t.tone ? 'border-sky-500 bg-sky-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white">{t.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 7: READY */}
        {step === 7 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xl font-bold">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">You're all set!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              HeyClicky is now live in your Windows floating island. Hold <kbd className="font-mono text-sky-400 font-bold">Ctrl+Alt</kbd> anytime to get started!
            </p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-0 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <span>{step === steps.length - 1 ? 'Start Using HeyClicky' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
