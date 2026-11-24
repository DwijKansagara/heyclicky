import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Key, 
  Mic, 
  Music, 
  Sparkles, 
  X, 
  Heart,
  Volume2,
  ExternalLink,
  Play
} from 'lucide-react';
import { saveUserSettings, loadUserSettings } from '../services/storage.js';
import { CURSOR_COLORS, GEMINI_VOICES } from '@heyclicky/shared';
import { previewVoice } from '../services/audio.js';

interface OnboardingTourProps {
  onFinish: () => void;
}

export default function OnboardingTour({ onFinish }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const steps = [
    'hatching',
    'api key',
    'cursor color',
    'voice test',
    'starter ideas',
  ];

  const handleNext = async () => {
    const settings = await loadUserSettings();
    if (apiKey.trim()) {
      settings.geminiApiKey = apiKey.trim();
    }
    settings.cursorColor = selectedColor;
    settings.geminiVoice = selectedVoice;
    await saveUserSettings(settings);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const starterIdeas = [
    "what's on my screen right now?",
    "draw an interactive 3d rotating human heart [SCENE3D]",
    "summarize this article and highlight the main conclusions",
    "point me to the export button in figma or vs code",
    "dictate an email with auto-grammar and safe terminal newlines",
    "run an inbox hunter agent in the background",
    "automate this repetitive web task with heyclicky drive",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#141416] text-[#ECEEED] p-6 select-none font-sans">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#1D1D20] border border-[#2E2E32] shadow-2xl backdrop-blur-xl relative">
        {/* Top Control Bar: Back, Music, Skip pills */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center space-x-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white flex items-center transition-colors"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                <span>back</span>
              </button>
            )}
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center transition-colors ${
                isPlayingMusic ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Music className="w-3 h-3 mr-1" />
              <span>music</span>
            </button>
          </div>

          <button
            onClick={() => setShowSkipModal(true)}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            skip tour
          </button>
        </div>

        {/* STEP 0: HATCHING ANIMATION */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.8 }}
              className="w-16 h-16 mx-auto rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-400 font-mono text-xl font-bold shadow-xl shadow-sky-500/20"
            >
              ^ ω ^
            </motion.div>
            <h1 className="text-2xl font-medium text-white lowercase">hey! i'm clicky</h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed lowercase font-sans">
              your free, open-source ai companion for windows 10 & 11, powered by google gemini. let's hatch your buddy in 1 minute.
            </p>
            <div className="font-mono text-[10px] text-gray-500 lowercase">made by dwij kansagara · mit licensed</div>
          </motion.div>
        )}

        {/* STEP 1: API KEY */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono lowercase">
              <Key className="w-3.5 h-3.5" />
              <span>step 1: google gemini api key</span>
            </div>
            <h2 className="text-base font-medium text-white lowercase">bring your own key (byok)</h2>
            <p className="text-xs text-gray-400 lowercase leading-relaxed">
              heyclicky is 100% free with zero paywalls. enter your free api key from google ai studio. keys are encrypted with windows dpapi.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... API key"
              className="w-full bg-[#141416] border border-[#2E2E32] focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none transition-colors"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>stored safely in windows credential manager</span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline flex items-center"
              >
                get free key <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </a>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CURSOR BUDDY COLOR */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-xs font-mono text-sky-400 lowercase">step 2: cursor buddy color</div>
            <h2 className="text-base font-medium text-white lowercase">choose your buddy's glow</h2>
            <p className="text-xs text-gray-400 lowercase leading-relaxed">
              your cursor companion lives right beside your mouse. pick your favorite color glow.
            </p>

            {/* Circular Color Dots (Zero square hover artifacts) */}
            <div className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-[#141416] border border-[#2E2E32]">
              {CURSOR_COLORS.map((c) => {
                const isSelected = selectedColor === c.hex;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.hex)}
                    className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-115 focus:outline-none"
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: isSelected ? `0 0 16px ${c.hex}` : undefined,
                    }}
                    title={c.name}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 3: 30-VOICE PREVIEW */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-xs font-mono text-sky-400 lowercase">step 3: voice test</div>
            <h2 className="text-base font-medium text-white lowercase">pick your natural gemini voice</h2>
            <p className="text-xs text-gray-400 lowercase leading-relaxed">
              official heyclicky uses google gemini native speech (30 voices across 130+ languages). tap to preview:
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {GEMINI_VOICES.slice(0, 8).map((v) => {
                const isSelected = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVoice(v.id);
                      previewVoice(v);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/15'
                        : 'border-[#2E2E32] bg-[#141416] hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs text-white lowercase">{v.name}</div>
                      <div className="text-[9px] text-gray-400 font-mono lowercase">{v.style}</div>
                    </div>
                    <Play className="w-3 h-3 text-sky-400 shrink-0" />
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] font-mono text-gray-500 text-center">
              (all 30 voices available in settings anytime)
            </div>
          </motion.div>
        )}

        {/* STEP 4: STARTER IDEAS & READY */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-xs font-mono text-emerald-400 lowercase">you're ready!</div>
            <h2 className="text-base font-medium text-white lowercase">hold ctrl+alt anytime to talk</h2>
            <p className="text-xs text-gray-400 lowercase leading-relaxed">
              here are 7 things you can try immediately once your buddy hatches:
            </p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {starterIdeas.map((idea, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-gray-300 font-sans lowercase">
                  <span className="text-sky-400 font-mono text-[10px]">•</span>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom CTA Button */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-sky-400' : i < step ? 'w-2 bg-emerald-400' : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn-aqua-glass px-6 py-2 text-xs font-medium"
          >
            <span>{step === steps.length - 1 ? 'start using clicky' : 'continue'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Skip Tour Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#1D1D20] border border-[#2E2E32] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-white lowercase">skip tour confirmation</h3>
              <button onClick={() => setShowSkipModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-300 lowercase leading-relaxed">
              remember: you can hold <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-white">ctrl+alt</code> anytime on your keyboard to talk to clicky. all settings can be adjusted in the settings panel.
            </p>
            <div className="space-y-1 text-xs text-gray-400 font-sans lowercase">
              <div className="text-[11px] font-mono text-sky-400 font-medium">starter ideas:</div>
              <div>• "what's on my screen right now?"</div>
              <div>• "draw an interactive 3d heart"</div>
              <div>• "summarize this window"</div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowSkipModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/5 lowercase"
              >
                go back
              </button>
              <button
                onClick={onFinish}
                className="btn-aqua-glass px-5 py-2 text-xs font-medium"
              >
                got it, let's go
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
