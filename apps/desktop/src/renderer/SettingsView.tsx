import React, { useState, useEffect } from 'react';
import { 
  UserSettings, 
  CURSOR_SKINS, 
  CURSOR_COLORS,
  GEMINI_VOICES, 
  GeminiVoiceMeta,
  DEFAULT_SETTINGS 
} from '@heyclicky/shared';
import { loadUserSettings, saveUserSettings } from '../services/storage.js';
import { previewVoice, stopSpeaking } from '../services/audio.js';
import { connectorManager } from '../services/connectors.js';
import { mcpClientManager } from '../services/mcp-client.js';
import { routineManager } from '../services/routines.js';
import { skillManager } from '../services/skills.js';
import { 
  Shield, 
  Key, 
  Sliders, 
  Volume2, 
  Mic, 
  Terminal, 
  Info, 
  FileCode, 
  Check, 
  RefreshCw,
  Play,
  Pause,
  AlertOctagon,
  ExternalLink,
  Cpu
} from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'about' | 'general' | 'voice' | 'cursor' | 'drive' | 'dictation' | 'integrations' | 'routines'>('about');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadUserSettings().then((s) => {
      setSettings(s);
      setApiKeyInput(s.geminiApiKey || '');
    });

    if (window.electronAPI) {
      window.electronAPI.getSystemTheme().then((t) => setIsDark(t === 'dark'));
    }
  }, []);

  const handleSave = async (updatedOverrides?: Partial<UserSettings>) => {
    const updated = { 
      ...settings, 
      geminiApiKey: apiKeyInput,
      ...(updatedOverrides || {}) 
    };
    setSettings(updated);
    await saveUserSettings(updated);
    window.dispatchEvent(new CustomEvent('HEYCLICKY_SETTINGS_UPDATED', { detail: updated }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePreviewVoice = async (voice: GeminiVoiceMeta) => {
    if (previewingVoice === voice.id) {
      stopSpeaking();
      setPreviewingVoice(null);
      return;
    }
    setPreviewingVoice(voice.id);
    await previewVoice(voice);
    setPreviewingVoice(null);
  };

  const tabs = [
    { id: 'about', label: 'about & license', icon: Info },
    { id: 'general', label: 'api key & model', icon: Key },
    { id: 'voice', label: 'voice (30 gemini voices)', icon: Volume2 },
    { id: 'cursor', label: 'cursor buddy & colors', icon: Sliders },
    { id: 'drive', label: 'drive & control', icon: Cpu },
    { id: 'dictation', label: 'dictation & safety', icon: Mic },
    { id: 'integrations', label: 'connectors & mcp', icon: FileCode },
    { id: 'routines', label: 'routines', icon: RefreshCw },
  ];

  const cardBg = isDark ? 'bg-[#1D1D20]' : 'bg-[#FFFFFF]';
  const borderCol = isDark ? 'border-[#2E2E32]' : 'border-[#E5E5E5]';
  const textPrimary = isDark ? 'text-[#ECEEED]' : 'text-[#111111]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#666666]';
  const inputBg = isDark ? 'bg-[#141416]' : 'bg-[#F7F7F7]';

  return (
    <div className={`flex h-full w-full ${cardBg} text-xs font-sans select-none overflow-hidden`}>
      {/* Settings Sub-Sidebar */}
      <div className={`w-52 border-r ${borderCol} p-3 space-y-1 shrink-0`}>
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">
          settings
        </div>
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs lowercase transition-colors text-left ${
                activeTab === t.id
                  ? 'bg-sky-500/15 text-sky-500 font-medium border border-sky-500/25'
                  : `${textMuted} hover:${textPrimary} hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panel Content */}
      <div className="flex-1 p-6 overflow-y-auto max-w-2xl space-y-6">
        {/* ABOUT & LICENSE PANEL */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-500 font-mono text-xs font-bold shadow-sm">
                ^ ω ^
              </div>
              <div>
                <h2 className="text-base font-medium text-black dark:text-white lowercase">heyclicky for windows (v1.1.7)</h2>
                <p className="text-[11px] text-sky-500 lowercase font-mono">100% free & open-source · powered by google gemini</p>
              </div>
            </div>

            {/* Creator Attribution */}
            <div className={`p-4 rounded-xl ${cardBg} border ${borderCol} space-y-1.5 shadow-xs`}>
              <div className="font-medium text-black dark:text-white flex items-center space-x-2">
                <span>made by dwij kansagara</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500 font-mono text-[9px]">lead engineer</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 lowercase leading-relaxed">
                engineered as an authentic, 1:1 free-forever windows evolution of clicky. while the official commercial release charges for full features, this open-source windows build unlocks every capability (voice, real-time 2d/3d drawing, whole-screen context, heyclicky drive, parallel agents, and 100+ connectors) with zero paywalls.
              </p>
            </div>

            {/* Strict MIT License Notice */}
            <div className={`p-4 rounded-xl ${cardBg} border ${borderCol} space-y-2 font-mono text-[11px] text-gray-500 dark:text-gray-400`}>
              <div className="font-sans font-medium text-xs text-black dark:text-white lowercase">mit license notice</div>
              <p className="leading-relaxed">
                mit licensed &mdash; open source (based on <code className="text-sky-500">farzaa/clicky</code> by Farza Majeed).
                original prototype copyright &copy; 2026 Farza Majeed.
                windows port, gemini native tts engine, and low-level hook copyright &copy; 2026 Dwij Kansagara.
              </p>
              <div className="pt-2 flex items-center space-x-4 text-[10px]">
                <a href="https://github.com/DwijKansagara/heyclicky" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">
                  github repository &rarr;
                </a>
                <a href="https://github.com/farzaa/clicky" target="_blank" rel="noreferrer" className="text-gray-400 hover:underline">
                  upstream clicky &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* GENERAL & API KEY */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">google gemini api key (byok)</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                enter your free api key from google ai studio. keys are encrypted locally using windows dpapi.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-black dark:text-white lowercase">gemini api key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full ${inputBg} border ${borderCol} focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors`}
              />
              <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                <span>safe local windows dpapi storage</span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-500 hover:underline flex items-center"
                >
                  get free key at aistudio.google.com <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-black dark:text-white lowercase">real-time / voice model</label>
                <select
                  value={settings.geminiModelVoice}
                  onChange={(e) => setSettings({ ...settings, geminiModelVoice: e.target.value })}
                  className={`w-full mt-1 ${inputBg} border ${borderCol} rounded-xl px-3 py-2 text-xs focus:outline-none`}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest)</option>
                  <option value="gemini-3.0-flash">Gemini 3.0 Flash</option>
                  <option value="gemini-flash-thinking">Gemini Flash Thinking</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-black dark:text-white lowercase">deep reasoning / pro model</label>
                <select
                  value={settings.geminiModelPro}
                  onChange={(e) => setSettings({ ...settings, geminiModelPro: e.target.value })}
                  className={`w-full mt-1 ${inputBg} border ${borderCol} rounded-xl px-3 py-2 text-xs focus:outline-none`}
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deepest)</option>
                  <option value="gemini-3.0-pro">Gemini 3.0 Pro</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="btn-aqua-glass px-5 py-2 text-xs font-medium"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 mr-1" /> : null}
              <span>{isSaved ? 'saved!' : 'save settings'}</span>
            </button>
          </div>
        )}

        {/* VOICE & SPEECH (ALL 30 GEMINI VOICES) */}
        {activeTab === 'voice' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-black dark:text-white lowercase">natural gemini voices (all 30 voices)</h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500">zero robotic tts</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                real natural speech powered by google gemini native audio. tap any voice to preview.
              </p>
            </div>

            {/* Speech Rate Slider & Options */}
            <div className={`p-3.5 rounded-xl ${inputBg} border ${borderCol} space-y-3`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium lowercase">speaking rate: {settings.speechRate}x</span>
                <span className="font-mono text-[10px] text-gray-400">0.5x - 1.5x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={settings.speechRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSettings({ ...settings, speechRate: val });
                  handleSave({ speechRate: val });
                }}
                className="w-full accent-sky-500"
              />

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-medium lowercase">captions while heyclicky talks</div>
                  <div className="text-[10px] text-gray-400 lowercase">shows bottom-of-screen subtitles during speech</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showCaptions}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings({ ...settings, showCaptions: checked });
                    handleSave({ showCaptions: checked });
                  }}
                  className="w-4 h-4 rounded accent-sky-500"
                />
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-medium lowercase">system audio chimes</div>
                  <div className="text-[10px] text-gray-400 lowercase">pleasant web audio chimes for talk key and task events</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.chimesEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings({ ...settings, chimesEnabled: checked });
                    handleSave({ chimesEnabled: checked });
                  }}
                  className="w-4 h-4 rounded accent-sky-500"
                />
              </div>
            </div>

            {/* 30 Gemini Voices Grid */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-black dark:text-white lowercase">select voice</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {GEMINI_VOICES.map((v) => {
                  const isSelected = (settings.geminiVoice || 'Puck') === v.id;
                  const isPlaying = previewingVoice === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSettings({ ...settings, geminiVoice: v.id });
                        handleSave({ geminiVoice: v.id });
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/15'
                          : `${inputBg} ${borderCol} hover:border-gray-400 dark:hover:border-gray-600`
                      }`}
                    >
                      <div className="pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-medium text-xs lowercase">{v.name}</span>
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-gray-500">
                            {v.style}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono lowercase truncate mt-0.5">
                          {v.tone}
                        </div>
                      </div>

                      {/* Tap-to-Preview Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewVoice(v);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isPlaying 
                            ? 'bg-sky-500 text-black scale-110' 
                            : 'bg-black/5 dark:bg-white/10 hover:bg-sky-500/30 text-sky-500'
                        }`}
                        title="Tap to preview voice sample"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.2" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CURSOR BUDDY & COLORS */}
        {activeTab === 'cursor' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">cursor companion customization</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                customize your buddy's character expression, color dot glow, and spring behavior.
              </p>
            </div>

            {/* Circular Color-Dot Picker (ZERO square hover artifacts) */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-black dark:text-white lowercase">cursor buddy color</label>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                {CURSOR_COLORS.map((c) => {
                  const isSelected = (settings.cursorColor || '#3b82f6') === c.hex;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSettings({ ...settings, cursorColor: c.hex });
                        handleSave({ cursorColor: c.hex });
                      }}
                      className="relative w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: isSelected ? `0 0 12px ${c.hex}` : undefined,
                      }}
                      title={c.name}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Character Skins */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-black dark:text-white lowercase">character skin</label>
              <div className="grid grid-cols-2 gap-2.5">
                {CURSOR_SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSettings({ ...settings, cursorSkin: s.id });
                      handleSave({ cursorSkin: s.id });
                    }}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-colors ${
                      settings.cursorSkin === s.id
                        ? 'border-sky-500 bg-sky-500/15'
                        : `${inputBg} ${borderCol} hover:border-gray-400 dark:hover:border-gray-600`
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: settings.cursorColor || s.color }}
                    >
                      {s.face}
                    </div>
                    <div>
                      <div className="text-xs font-medium lowercase">{s.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{s.face}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hide Floating Cursor Toggle */}
            <div className={`flex items-center justify-between p-3.5 rounded-xl ${inputBg} border ${borderCol}`}>
              <div>
                <div className="text-xs font-medium lowercase">hide floating cursor</div>
                <div className="text-[10px] text-gray-400 lowercase">
                  buddy displays &ldquo;okay see you &lt;3&rdquo; and leaves island compact.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.hideFloatingCursor}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSettings({ ...settings, hideFloatingCursor: checked });
                  handleSave({ hideFloatingCursor: checked });
                }}
                className="w-4 h-4 rounded accent-sky-500"
              />
            </div>
          </div>
        )}

        {/* DRIVE & CONTROL */}
        {activeTab === 'drive' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">heyclicky drive autonomous control</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                control hands-free mouse and keyboard automation safely with instant hardware kill-switch.
              </p>
            </div>

            {/* Persistent Permission */}
            <div className={`p-4 rounded-xl ${cardBg} border ${borderCol} space-y-2`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium lowercase">persistent permission (allow always)</div>
                  <div className="text-[10px] text-gray-400 lowercase">
                    run drive actions immediately without repeating authorization popups.
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                  active
                </span>
              </div>
            </div>

            {/* Instant Hardware Kill-Switch Notice */}
            <div className={`p-4 rounded-xl ${inputBg} border ${borderCol} space-y-2`}>
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertOctagon className="w-4 h-4" />
                <span className="font-medium lowercase">instant hardware kill-switch</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 lowercase leading-relaxed">
                moving your physical mouse, speaking, or pressing the <code className="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">escape</code> key immediately aborts all simulated clicks and keystrokes in under 1 millisecond.
              </p>
            </div>
          </div>
        )}

        {/* DICTATION */}
        {activeTab === 'dictation' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">unlimited dictation & safety</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                speak into any text box with auto-grammar, vocabulary dictionaries, and terminal newline safety.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl ${inputBg} border ${borderCol} space-y-3`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium lowercase">terminal newline injection defense</div>
                  <div className="text-[10px] text-gray-400 lowercase">collapses newlines in terminals so commands never fire prematurely</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.terminalNewlineSafety}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings({ ...settings, terminalNewlineSafety: checked });
                    handleSave({ terminalNewlineSafety: checked });
                  }}
                  className="w-4 h-4 rounded accent-sky-500"
                />
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-medium lowercase">auto-grammar & punctuation</div>
                  <div className="text-[10px] text-gray-400 lowercase">automatically adds capitals and periods to spoken thoughts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dictationAutoGrammar}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings({ ...settings, dictationAutoGrammar: checked });
                    handleSave({ dictationAutoGrammar: checked });
                  }}
                  className="w-4 h-4 rounded accent-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* CONNECTORS & MCP */}
        {activeTab === 'integrations' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">connectors & model context protocol (mcp)</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                connect local tools, databases, and mcp servers for parallel agent buddies.
              </p>
            </div>
            <div className={`p-4 rounded-xl ${inputBg} border ${borderCol} text-[11px] font-mono text-gray-400`}>
              mcp bridge active on 127.0.0.1:49152 (100+ connectors architecture enabled)
            </div>
          </div>
        )}

        {/* ROUTINES */}
        {activeTab === 'routines' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-black dark:text-white lowercase">v1.1.7 routines & proactive suggestions</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 lowercase">
                scheduled background tasks and morning desktop check-ins.
              </p>
            </div>
            <div className={`p-4 rounded-xl ${inputBg} border ${borderCol} text-[11px] font-mono text-gray-400`}>
              morning suggestions: active · silent finish: enabled
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
