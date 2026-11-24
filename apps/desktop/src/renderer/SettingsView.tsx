import React, { useState, useEffect } from 'react';
import { UserSettings, CURSOR_SKINS, CursorSkin } from '@heyclicky/shared';
import { loadUserSettings, saveUserSettings } from '../services/storage.js';
import { connectorManager } from '../services/connectors.js';
import { mcpClientManager } from '../services/mcp-client.js';
import { routineManager } from '../services/routines.js';
import { skillManager } from '../services/skills.js';
import { Shield, Key, Sliders, Volume2, Mic, Terminal, Globe, User, Info, FileCode, Check, RefreshCw } from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'cursor' | 'voice' | 'dictation' | 'shortcuts' | 'integrations' | 'skills' | 'routines' | 'privacy' | 'about'>('about');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadUserSettings().then((s) => {
      setSettings(s);
      setApiKeyInput(s.geminiApiKey || '');
    });
  }, []);

  if (!settings) {
    return <div className="p-8 text-slate-400">Loading settings...</div>;
  }

  const handleSave = async () => {
    if (!settings) return;
    const updated = { ...settings, geminiApiKey: apiKeyInput };
    setSettings(updated);
    await saveUserSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tabs = [
    { id: 'about', label: 'About & License', icon: Info },
    { id: 'general', label: 'General & API Key', icon: Key },
    { id: 'cursor', label: 'Cursor Buddy', icon: Sliders },
    { id: 'voice', label: 'Voice & Speech', icon: Volume2 },
    { id: 'dictation', label: 'Dictation & Safety', icon: Mic },
    { id: 'shortcuts', label: 'Shortcuts', icon: Terminal },
    { id: 'integrations', label: 'Connectors & MCP', icon: FileCode },
    { id: 'routines', label: 'Routines', icon: RefreshCw },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  ];

  return (
    <div className="flex h-full bg-slate-950 text-slate-200">
      {/* Settings Sub-Sidebar */}
      <div className="w-56 border-r border-slate-800 bg-slate-900/40 p-4 space-y-1 shrink-0 select-none">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-2">
          Settings
        </div>
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panel Content */}
      <div className="flex-1 p-8 overflow-y-auto max-w-3xl">
        {/* ABOUT PANEL */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 font-mono text-base font-bold shadow-lg">
                ^ ω ^
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">HeyClicky for Windows</h2>
                <p className="text-xs text-sky-400 font-medium">100% Free Forever & Open Source · Powered by Google Gemini</p>
              </div>
            </div>

            {/* Creator Attribution Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/40 shadow-xl space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Made by Dwij Kansagara</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono">Lead Engineer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built as a 1:1 Windows native replica and free-forever evolution of official HeyClicky. While the official commercial release is paid for full features, this open-source build unlocks every capability (voice, real-time drawing, whole-document context, HeyClicky Drive, routines, and multi-agent buddies) with zero paywalls.
              </p>
            </div>

            {/* MIT License Notice */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs text-slate-400">
              <div className="text-xs font-bold text-slate-300 font-sans">MIT License Notice</div>
              <p>
                MIT Licensed — Open Source (based on <code className="text-sky-300">farzaa/clicky</code> by Farza Majeed).
                Original prototype copyright © 2026 Farza Majeed.
                Windows port & open-source replica copyright © 2026 Dwij Kansagara.
              </p>
            </div>
          </div>
        )}

        {/* GENERAL & API KEY */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Google Gemini API Key (BYOK)</h2>
              <p className="text-xs text-slate-400 mt-1">
                HeyClicky uses your own Google Gemini API key. You can get a free key from Google AI Studio.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Gemini API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Keys are encrypted with Windows DPAPI (electron.safeStorage).</span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline font-semibold"
                >
                  Get free key at aistudio.google.com →
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Voice / Real-Time Model</label>
                <select
                  value={settings.geminiModelVoice}
                  onChange={(e) => setSettings({ ...settings, geminiModelVoice: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest)</option>
                  <option value="gemini-3.0-flash">Gemini 3.0 Flash</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Reasoning / Pro Model</label>
                <select
                  value={settings.geminiModelPro}
                  onChange={(e) => setSettings({ ...settings, geminiModelPro: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deepest)</option>
                  <option value="gemini-3.0-pro">Gemini 3.0 Pro</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : null}
              <span>{isSaved ? 'Saved Settings!' : 'Save Settings'}</span>
            </button>
          </div>
        )}

        {/* CURSOR BUDDY */}
        {activeTab === 'cursor' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Cursor Companion Customization</h2>
              <p className="text-xs text-slate-400 mt-1">Pick your buddy's character and spring flight speed.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Character Skin</label>
              <div className="grid grid-cols-2 gap-3">
                {CURSOR_SKINS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSettings({ ...settings, cursorSkin: s.id })}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      settings.cursorSkin === s.id
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.face}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.face}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Hide Floating Cursor</div>
                <div className="text-[11px] text-slate-400">Buddy says "okay see you &lt;3" and remains inside island.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.hideFloatingCursor}
                onChange={(e) => setSettings({ ...settings, hideFloatingCursor: e.target.checked })}
                className="w-4 h-4 rounded text-sky-500"
              />
            </div>
          </div>
        )}

        {/* DICTATION & SAFETY */}
        {activeTab === 'dictation' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Screen-Aware Dictation & Safety</h2>
              <p className="text-xs text-slate-400 mt-1">Dictate into any app with auto-grammar and terminal safety.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Terminal Newline Safety</div>
                  <div className="text-[11px] text-slate-400">Collapses newlines in terminals so commands don't fire accidentally.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.terminalNewlineSafety}
                  onChange={(e) => setSettings({ ...settings, terminalNewlineSafety: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Persistent HeyClicky Drive Permission</div>
                  <div className="text-[11px] text-slate-400">Allow Always (Never ask permission popups; instant Esc/mouse kill-switch remains active).</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.drivePermissionMode === 'always_allow'}
                  onChange={(e) => setSettings({ ...settings, drivePermissionMode: e.target.checked ? 'always_allow' : 'allow_once' })}
                  className="w-4 h-4 rounded text-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Custom Words & Dictionary</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {settings.customDictionary.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONNECTORS & MCP */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">App Connectors & Model Context Protocol (MCP)</h2>
              <p className="text-xs text-slate-400 mt-1">Connect Gmail, Calendar, Sheets, Notion, and custom MCP servers.</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Accounts</div>
              <div className="grid grid-cols-2 gap-3">
                {connectorManager.getAccounts().map((acc) => (
                  <div key={acc.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white capitalize">{acc.service}</div>
                      <div className="text-[11px] text-slate-400">{acc.label} {acc.userEmail ? `(${acc.userEmail})` : ''}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      acc.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {acc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom MCP Servers</div>
              {mcpClientManager.getServers().map((srv) => (
                <div key={srv.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">{srv.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{srv.type} · {srv.command} {srv.args?.join(' ')}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    srv.enabled ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {srv.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
