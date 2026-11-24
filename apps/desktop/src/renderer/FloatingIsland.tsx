import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Send, 
  Settings, 
  Sparkles, 
  AlertOctagon, 
  Bot, 
  Layers, 
  ChevronDown, 
  Trash2, 
  X,
  Volume2,
  ExternalLink
} from 'lucide-react';
import { VoiceState, DriveState, UserSettings, DEFAULT_SETTINGS } from '@heyclicky/shared';
import { driveService } from '../services/drive.js';
import { askHeyClicky } from '../services/gemini.js';
import { 
  playTalkStartChime, 
  playTaskCompleteChime, 
  speakGeminiAudio, 
  stopSpeaking 
} from '../services/audio.js';
import { loadUserSettings } from '../services/storage.js';
import MorningSuggestions from './MorningSuggestions.js';
import NextStepPills from './NextStepPills.js';
import AgentCards from './AgentCards.js';

export default function FloatingIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'agents'>('home');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [inputText, setInputText] = useState('');
  const [activeReply, setActiveReply] = useState<string>('');
  const [driveState, setDriveState] = useState<DriveState>(driveService.getState());
  const [hasDrawings, setHasDrawings] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadUserSettings().then(setSettings);

    // Detect system theme
    if (window.electronAPI) {
      window.electronAPI.getSystemTheme().then((t) => {
        setIsDark(t === 'dark');
      });
    }

    // Listen for Drive state updates
    const unsubDrive = driveService.subscribe((state) => {
      setDriveState(state);
    });

    // Listen for C# Low-Level Hook push-to-talk events
    let unsubTalkStart: (() => void) | undefined;
    let unsubTalkStop: (() => void) | undefined;
    let unsubShortcut: (() => void) | undefined;
    let unsubKillSwitch: (() => void) | undefined;

    if (window.electronAPI) {
      unsubTalkStart = window.electronAPI.onTalkStart(() => {
        handleTalkStart();
      });

      unsubTalkStop = window.electronAPI.onTalkStop(() => {
        handleTalkStop();
      });

      unsubShortcut = window.electronAPI.onShortcutTriggered(() => {
        handleToggleTalk();
      });

      unsubKillSwitch = window.electronAPI.onDriveKillSwitch(() => {
        driveService.haltKillSwitch('Escape pressed via low-level hook');
      });
    }

    // Listen for drawings on screen
    const handleDrawingsChanged = (e: any) => {
      setHasDrawings(!!e.detail?.hasDrawings);
    };
    window.addEventListener('HEYCLICKY_DRAWINGS_CHANGED', handleDrawingsChanged);

    return () => {
      unsubDrive();
      unsubTalkStart?.();
      unsubTalkStop?.();
      unsubShortcut?.();
      unsubKillSwitch?.();
      window.removeEventListener('HEYCLICKY_DRAWINGS_CHANGED', handleDrawingsChanged);
    };
  }, []);

  // Smoothly resize Electron floating island window based on expand state
  useEffect(() => {
    if (window.electronAPI) {
      const width = isExpanded ? 460 : 280;
      const height = isExpanded ? 460 : 48;
      window.electronAPI.resizeIsland(width, height);
    }
  }, [isExpanded]);

  const handleTalkStart = () => {
    stopSpeaking();
    setVoiceState('listening');
    playTalkStartChime();
  };

  const handleTalkStop = async () => {
    setVoiceState('processing');
    try {
      const response = await askHeyClicky("What's on my screen right now?", { includeScreenContext: true });
      setActiveReply(response.spokenText);
      setVoiceState('responding');

      await speakGeminiAudio(response.spokenText, {
        onEnd: () => setVoiceState('idle'),
        onError: () => setVoiceState('idle'),
      });
    } catch (err) {
      console.error('Turn error:', err);
      setVoiceState('idle');
    }
  };

  const handleToggleTalk = () => {
    if (voiceState === 'idle') {
      handleTalkStart();
    } else if (voiceState === 'listening') {
      handleTalkStop();
    } else {
      stopSpeaking();
      setVoiceState('idle');
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText;
    setInputText('');
    setVoiceState('processing');

    try {
      const response = await askHeyClicky(query, { includeScreenContext: true });
      setActiveReply(response.spokenText);
      setVoiceState('responding');

      await speakGeminiAudio(response.spokenText, {
        onEnd: () => setVoiceState('idle'),
        onError: () => setVoiceState('idle'),
      });
    } catch {
      setVoiceState('idle');
    }
  };

  const handleClearDrawings = () => {
    window.dispatchEvent(new CustomEvent('HEYCLICKY_CLEAR_DRAWINGS'));
    setHasDrawings(false);
  };

  const handleKillDrive = () => {
    driveService.haltKillSwitch('User clicked stop button in island');
  };

  const openFullChat = () => {
    if (window.electronAPI) {
      window.electronAPI.openSidebar('chat');
    }
  };

  const openSettings = () => {
    if (window.electronAPI) {
      window.electronAPI.openSidebar('settings');
    }
  };

  const surfaceBg = isDark ? 'bg-[#1D1D20]' : 'bg-[#FFFFFF]';
  const surfaceBorder = isDark ? 'border-[#2E2E32]' : 'border-[#E5E5E5]';
  const textPrimary = isDark ? 'text-[#ECEEED]' : 'text-[#111111]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#666666]';

  return (
    <div className="flex flex-col items-center w-full px-2 pt-1 app-drag select-none">
      {/* Sleek Floating Island Main Capsule */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className={`w-full rounded-2xl ${surfaceBg} ${surfaceBorder} border shadow-xl backdrop-blur-md px-3 py-1.5 flex flex-col transition-colors overflow-hidden`}
      >
        {/* Top Capsule Row */}
        <div className="flex items-center justify-between w-full h-8">
          {/* Left: Expressive Smiley Mark */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 cursor-pointer no-drag group"
          >
            <div className="w-6 h-6 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-500 text-xs font-mono font-medium group-hover:scale-105 transition-transform">
              ^ ω ^
            </div>
            <span className={`text-xs font-sans font-medium lowercase ${textPrimary}`}>
              heyclicky
            </span>
          </div>

          {/* Center: Dynamic Status Pill */}
          <div className="flex items-center space-x-2">
            {/* Driving status with instant stop */}
            {driveState.isRunning && (
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-mono lowercase animate-pulse no-drag">
                <span>driving</span>
                <button
                  onClick={handleKillDrive}
                  className="p-0.5 hover:bg-amber-500/30 rounded-full transition-colors"
                  title="Emergency Stop (Escape)"
                >
                  <AlertOctagon className="w-3 h-3 text-red-500" />
                </button>
              </div>
            )}

            {/* Listening state with reactive waveform */}
            {voiceState === 'listening' && (
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-500 text-[10px] font-mono lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                <span>listening</span>
              </div>
            )}

            {/* Thinking state */}
            {voiceState === 'processing' && (
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-mono lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span>thinking</span>
              </div>
            )}

            {/* Speaking state */}
            {voiceState === 'responding' && (
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono lowercase">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>speaking</span>
              </div>
            )}

            {/* Clear Button (Visible ONLY when 2D/3D drawings are on screen) */}
            {hasDrawings && (
              <button
                onClick={handleClearDrawings}
                className="no-drag flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 border border-red-500/30 text-[10px] font-mono hover:bg-red-500/25 transition-colors"
                title="Clear screen drawings"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span>clear</span>
              </button>
            )}
          </div>

          {/* Right: Expand / Settings toggle */}
          <div className="flex items-center space-x-1 no-drag">
            <button
              onClick={handleToggleTalk}
              className={`p-1 rounded-full transition-colors ${
                voiceState === 'listening' ? 'bg-red-500/20 text-red-500' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-500'
              }`}
              title="Hold Ctrl+Alt to talk"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Smooth Expandable Body (Home, Chat, Agents, Settings) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full pt-3 border-t border-black/5 dark:border-white/5 space-y-3 no-drag"
            >
              {/* Tab Selector */}
              <div className="flex items-center justify-between text-xs font-sans lowercase">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'home' ? 'bg-sky-500/15 text-sky-500 font-medium' : `${textMuted} hover:${textPrimary}`
                    }`}
                  >
                    home
                  </button>
                  <button
                    onClick={openFullChat}
                    className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${textMuted} hover:${textPrimary}`}
                  >
                    <span>chat</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeTab === 'agents' ? 'bg-sky-500/15 text-sky-500 font-medium' : `${textMuted} hover:${textPrimary}`
                    }`}
                  >
                    agents
                  </button>
                </div>
                <button
                  onClick={openSettings}
                  className={`p-1.5 rounded-lg ${textMuted} hover:${textPrimary} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Tab: Home / Quick Ask */}
              {activeTab === 'home' && (
                <div className="space-y-3">
                  {/* Quick Ask Box */}
                  <form onSubmit={handleSendMessage} className="relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="ask about your screen or type a task..."
                      className={`w-full px-3 py-2 pr-9 text-xs rounded-xl ${
                        isDark ? 'bg-[#141416] border-[#2E2E32] text-white' : 'bg-[#F7F7F7] border-[#E5E5E5] text-black'
                      } border focus:outline-none focus:border-sky-500 transition-colors lowercase font-sans`}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sky-500 disabled:opacity-30 hover:scale-105 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Morning Suggestions (Opt-in) */}
                  <MorningSuggestions onSelectPrompt={(p) => setInputText(p)} />

                  {/* Next Step Pills */}
                  <NextStepPills onSelectPill={(p) => setInputText(p)} />
                </div>
              )}

              {/* Active Tab: Agents */}
              {activeTab === 'agents' && (
                <div className="space-y-2">
                  <AgentCards />
                </div>
              )}

              {/* Bottom Attribution Bar */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 lowercase">
                <span>made by dwij kansagara</span>
                <span>mit licensed (farzaa/clicky)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
