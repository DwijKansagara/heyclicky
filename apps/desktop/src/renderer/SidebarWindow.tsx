import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, FileText, Cpu, Settings, Sparkles, BookOpen } from 'lucide-react';
import SettingsView from './SettingsView.js';
import { askHeyClicky } from '../services/gemini.js';
import { speakText } from '../services/audio.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export default function SidebarWindow({ initialTab = 'chat' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
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
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const newMsg: Message = { id: `msg_${Date.now()}`, role: 'user', text: userText, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await askHeyClicky(userText, {
        includeScreenContext: true,
        conversationHistory: history,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_res_${Date.now()}`,
          role: 'assistant',
          text: response.spokenText,
          timestamp: Date.now(),
        },
      ]);

      speakText(response.spokenText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans">
      {/* Left Navigation Bar */}
      <div className="w-16 border-r border-slate-800 bg-slate-900/60 flex flex-col items-center py-4 space-y-4 shrink-0 select-none">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-mono text-xs font-bold shadow-lg">
          ^ ω ^
        </div>

        <div className="flex-1 space-y-2 w-full px-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'chat' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Chat"
          >
            <Bot className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'settings' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Settings & About"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-slate-500 font-mono text-center">v1.1.7</div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeTab === 'settings' ? (
          <SettingsView />
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/30">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-200">HeyClicky Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Google Gemini
                </span>
              </div>
              <div className="text-xs text-slate-400">Windows 10/11 Edition</div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                    HeyClicky is analyzing your screen...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/40">
              <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or tell Clicky to do something..."
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
