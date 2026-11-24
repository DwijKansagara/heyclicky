import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  Bot, 
  FileText, 
  Cpu, 
  Settings, 
  Sparkles, 
  BookOpen, 
  Minus, 
  Square, 
  X,
  ChevronRight,
  Plus,
  Play,
  CheckCircle2,
  Clock
} from 'lucide-react';
import SettingsView from './SettingsView.js';
import { askHeyClicky } from '../services/gemini.js';
import { speakGeminiAudio } from '../services/audio.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface AgentJobItem {
  id: string;
  name: string;
  status: 'working' | 'ready' | 'idle';
  lastActivity: string;
}

export default function SidebarWindow({ initialTab = 'chat' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDark, setIsDark] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      role: 'assistant',
      text: "hey! i'm clicky, your windows ai buddy. ask me anything about your screen or let me run agent jobs for you.",
      timestamp: Date.now() - 60000,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const agentJobs: AgentJobItem[] = [
    { id: 'job_inbox', name: 'Inbox Hunter', status: 'ready', lastActivity: 'summarized 4 unread investor updates' },
    { id: 'job_research', name: 'Research Buddy', status: 'working', lastActivity: 'reading technical benchmarks' },
    { id: 'job_review', name: 'Code Reviewer', status: 'idle', lastActivity: 'last checked git diff 2h ago' },
  ];

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getSystemTheme().then((t) => setIsDark(t === 'dark'));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const newMsg: Message = { id: `msg_${Date.now()}`, role: 'user', text: userText, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);
    setStreamedText('');

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await askHeyClicky(userText, {
        includeScreenContext: true,
        conversationHistory: history,
      });

      // Stream words smoothly into view
      const fullText = response.spokenText;
      const words = fullText.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? '' : ' ') + words[i];
        setStreamedText(current);
        await new Promise((r) => setTimeout(r, 22));
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_res_${Date.now()}`,
          role: 'assistant',
          text: fullText,
          timestamp: Date.now(),
        },
      ]);
      setStreamedText('');

      speakGeminiAudio(fullText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeSidebar();
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const canvasBg = isDark ? 'bg-[#141416]' : 'bg-[#F7F7F7]';
  const cardBg = isDark ? 'bg-[#1D1D20]' : 'bg-[#FFFFFF]';
  const borderCol = isDark ? 'border-[#2E2E32]' : 'border-[#E5E5E5]';
  const textPrimary = isDark ? 'text-[#ECEEED]' : 'text-[#111111]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#666666]';
  const dotsClass = isDark ? 'bg-calm-dots-dark' : 'bg-calm-dots-light';

  return (
    <div className={`flex h-screen w-screen ${canvasBg} ${textPrimary} font-sans overflow-hidden select-none`}>
      {/* Left Frameless Sidebar */}
      <div className={`w-64 border-r ${borderCol} ${cardBg} flex flex-col justify-between shrink-0 select-none`}>
        {/* Top Window Drag & Traffic Lights */}
        <div>
          <div className="h-10 px-4 flex items-center justify-between app-drag border-b border-black/5 dark:border-white/5">
            {/* Window controls */}
            <div className="flex items-center space-x-2 no-drag">
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-[#FF736A] hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Close"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Minimize"
              />
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-[#19C332] hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Maximize"
              />
            </div>
            <div className="font-mono text-[11px] text-[#888888] lowercase">heyclicky</div>
          </div>

          {/* Navigation & Named Agent Jobs */}
          <div className="p-3 space-y-4">
            {/* Primary Chat Link */}
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                conversation
              </div>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setSelectedAgent(null);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-sans font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'chat' && !selectedAgent
                    ? 'bg-sky-500/15 text-sky-500 border border-sky-500/25'
                    : `hover:bg-black/5 dark:hover:bg-white/5 ${textMuted}`
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-500 font-mono text-[10px] flex items-center justify-center font-bold">
                    ^
                  </div>
                  <span className="lowercase">main buddy chat</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>
            </div>

            {/* Named Agent Jobs List */}
            <div>
              <div className="px-2 pb-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>agent buddies</span>
                <span className="font-mono text-[9px] text-sky-500">3 active</span>
              </div>
              <div className="space-y-1">
                {agentJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setActiveTab('chat');
                      setSelectedAgent(job.id);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs text-left transition-colors flex flex-col ${
                      selectedAgent === job.id
                        ? 'bg-sky-500/15 text-sky-500 border border-sky-500/25'
                        : `hover:bg-black/5 dark:hover:bg-white/5 ${textMuted}`
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium lowercase">{job.name}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'working' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    </div>
                    <span className="text-[10px] text-gray-400 truncate mt-0.5 lowercase font-mono">
                      {job.lastActivity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Settings Link */}
        <div className="p-3 border-t border-black/5 dark:border-white/5 space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition-colors ${
              activeTab === 'settings'
                ? 'bg-sky-500/15 text-sky-500 border border-sky-500/25'
                : `hover:bg-black/5 dark:hover:bg-white/5 ${textMuted}`
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="lowercase">settings & about</span>
          </button>
          <div className="px-2 pt-1 font-mono text-[9px] text-gray-400 flex justify-between lowercase">
            <span>v1.1.7 windows</span>
            <span>made by dwij</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className={`flex-1 flex flex-col h-full ${dotsClass} overflow-hidden`}>
        {activeTab === 'settings' ? (
          <SettingsView />
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Top Bar */}
            <div className={`h-12 border-b ${borderCol} ${cardBg} px-6 flex items-center justify-between app-drag shrink-0`}>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-xs lowercase">
                  {selectedAgent ? agentJobs.find(j => j.id === selectedAgent)?.name : 'heyclicky assistant'}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500 border border-sky-500/20 lowercase">
                  gemini 2.5 flash
                </span>
              </div>
              <div className="font-mono text-[11px] text-gray-400 lowercase">
                hold ctrl+alt to speak
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans ${
                      m.role === 'user'
                        ? 'btn-aqua-glass text-black'
                        : `${cardBg} border ${borderCol} ${textPrimary} shadow-sm`
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Streaming reply indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${cardBg} border ${borderCol} ${textPrimary} shadow-sm`}>
                    {streamedText ? (
                      <div>{streamedText}</div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sky-500 font-mono text-[11px] lowercase">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                        <span>clicky is analyzing your screen...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Box */}
            <div className={`p-4 border-t ${borderCol} ${cardBg}`}>
              <form onSubmit={handleSend} className="flex items-center space-x-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ask a question about your screen, code, or running agents..."
                  className={`flex-1 ${canvasBg} border ${borderCol} focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs ${textPrimary} focus:outline-none transition-colors font-sans lowercase`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="btn-aqua-glass px-4 py-2.5 text-xs disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
