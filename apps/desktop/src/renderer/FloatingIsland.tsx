import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Settings, Sparkles, AlertOctagon, Bot, Layers, ChevronDown } from 'lucide-react';
import { VoiceState, DriveState } from '@heyclicky/shared';
import { driveService } from '../services/drive.js';
import { askHeyClicky } from '../services/gemini.js';
import { playTalkStartChime, playTaskCompleteChime, speakText } from '../services/audio.js';
import MorningSuggestions from './MorningSuggestions.js';
import NextStepPills from './NextStepPills.js';
import AgentCards from './AgentCards.js';

export default function FloatingIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [inputText, setInputText] = useState('');
  const [activeReply, setActiveReply] = useState<string>('');
  const [driveState, setDriveState] = useState<DriveState>(driveService.getState());
  const [showMorningSuggestions, setShowMorningSuggestions] = useState(true);

  useEffect(() => {
    // Listen for Drive state updates
    const unsubDrive = driveService.subscribe((state) => {
      setDriveState(state);
    });

    // Listen for global shortcut
    let unsubShortcut: (() => void) | undefined;
    if (window.electronAPI) {
      unsubShortcut = window.electronAPI.onShortcutTriggered((data) => {
        handleToggleTalk();
      });
    }

    return () => {
      unsubDrive();
      unsubShortcut?.();
    };
  }, [voiceState]);

  // Adjust Electron window height smoothly based on expand state
  useEffect(() => {
    if (window.electronAPI) {
      const height = isExpanded ? 480 : 64;
      window.electronAPI.resizeIsland(440, height);
    }
  }, [isExpanded]);

  const handleToggleTalk = async () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      playTalkStartChime();
      // Listen for voice or start turn
    } else if (voiceState === 'listening') {
      setVoiceState('processing');
      // Execute turn
      const response = await askHeyClicky("What's on my screen right now?", { includeScreenContext: true });
      setActiveReply(response.spokenText);
      setVoiceState('responding');
      speakText(response.spokenText, {
        onEnd: () => setVoiceState('idle'),
      });
    } else {
      setVoiceState('idle');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText;
    setInputText('');
    setVoiceState('processing');

    const response = await askHeyClicky(query, { includeScreenContext: true });
    setActiveReply(response.spokenText);
    setVoiceState('responding');

    speakText(response.spokenText, {
      onEnd: () => setVoiceState('idle'),
    });
  };

  const handleKillDrive = () => {
    driveService.haltKillSwitch('User clicked kill button in island');
  };

  const openSettings = () => {
    if (window.electronAPI) {
      window.electronAPI.openSidebar('settings');
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2 pt-2 app-drag select-none">
      {/* Sleek Floating Island Main Capsule */}
      <motion.div
        layout
        className="w-full rounded-full bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl px-3 py-1.5 flex items-center justify-between transition-all"
        style={{
          boxShadow: driveState.isActive
            ? '0 0 24px rgba(245, 158, 11, 0.45)'
            : '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Left: Brand & Buddy Face */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer no-drag hover:opacity-85 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 font-mono text-xs font-bold">
            ^ ω ^
          </div>
          <span className="font-bold text-xs tracking-tight text-slate-200">heyclicky</span>
        </div>

        {/* Center: Live Status Strips & Active Drive Pill */}
        <div className="flex items-center gap-2">
          {driveState.isActive ? (
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-semibold animate-pulse no-drag">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Drive Active</span>
              <button
                onClick={handleKillDrive}
                className="ml-1 p-0.5 rounded-full hover:bg-amber-400/20 text-amber-200 hover:text-white"
                title="Kill Computer Control (Esc)"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          ) : voiceState === 'listening' ? (
            <span className="text-[11px] text-sky-400 font-medium animate-pulse flex items-center gap-1">
              <Mic className="w-3 h-3" /> Listening...
            </span>
          ) : voiceState === 'processing' ? (
            <span className="text-[11px] text-amber-400 font-medium animate-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Thinking...
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-normal">Windows 10/11 · Free</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 no-drag">
          <button
            onClick={handleToggleTalk}
            className={`p-1.5 rounded-full transition-all active:scale-95 ${
              voiceState === 'listening'
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-400'
            }`}
            title="Push to talk (Ctrl+Alt)"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openSettings}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Settings & About"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Expanded Island Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="w-full mt-2 p-3 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl no-drag text-slate-200 overflow-y-auto max-h-96"
          >
            {/* Active Reply Banner if any */}
            {activeReply && (
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 mb-2 leading-relaxed">
                {activeReply}
              </div>
            )}

            {/* Quick Text Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask HeyClicky or type instruction..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all active:scale-95 shadow-sm"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>

            {/* Next Step Suggestion Pills */}
            <NextStepPills onSelect={(text) => setInputText(text)} />

            {/* Active Parallel Agent Buddies */}
            <AgentCards />

            {/* Morning Suggestions (v1.1.7) */}
            {showMorningSuggestions && (
              <MorningSuggestions onDismiss={() => setShowMorningSuggestions(false)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
