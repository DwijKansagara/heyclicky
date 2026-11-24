import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, X, Sparkles, Clock, Sliders } from 'lucide-react';
import { agentBuddiesManager } from '../services/agent-buddies.js';

interface SuggestionItem {
  id: string;
  title: string;
  estimatedTime: string;
  deliverable: string;
  sourceApp: string;
  steps: string[];
}

export default function MorningSuggestions({ 
  onSelectPrompt,
  onDismiss 
}: { 
  onSelectPrompt?: (prompt: string) => void;
  onDismiss?: () => void;
}) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([
    {
      id: 'sug_1',
      title: 'summarize 4 unread investor updates in gmail',
      estimatedTime: '2 mins',
      deliverable: 'clean bulleted brief with key metrics and asks',
      sourceApp: 'Gmail (Work)',
      steps: ['scan inbox for sender labels', 'extract traction metrics', 'draft executive summary'],
    },
    {
      id: 'sug_2',
      title: 'prepare talking points for 2 pm product sync',
      estimatedTime: '3 mins',
      deliverable: 'notion meeting agenda draft',
      sourceApp: 'Google Calendar',
      steps: ['read calendar attendee list', 'fetch recent github commit logs', 'outline 3 discussion points'],
    },
  ]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDoIt = (item: SuggestionItem) => {
    agentBuddiesManager.createJob(item.title, item.deliverable);
    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleAdjust = (item: SuggestionItem) => {
    onSelectPrompt?.(`adjust plan for: ${item.title}`);
  };

  const handleNah = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono text-sky-500 uppercase tracking-wider flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>morning suggestions</span>
        </span>
        <button onClick={onDismiss} className="text-[10px] font-mono text-gray-400 hover:text-gray-200 lowercase">
          dismiss
        </button>
      </div>

      {suggestions.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-sky-500/30 transition-all text-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-sans text-black dark:text-white truncate flex-1 lowercase">
              {item.title}
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => handleDoIt(item)}
                className="btn-aqua-glass px-2.5 py-1 text-[11px] font-medium"
              >
                <Check className="w-3 h-3 mr-1" />
                <span>do it</span>
              </button>
              <button
                onClick={() => handleAdjust(item)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 text-[10px] lowercase transition-colors"
                title="Adjust plan"
              >
                <Sliders className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleNah(item.id)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 text-[10px] lowercase transition-colors"
                title="Nah"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Yellow-Pad Plan Hover Reveal */}
          <AnimatePresence>
            {hoveredId === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 3, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="mt-2 p-2.5 rounded-lg bg-[#FEF08A] text-[#1C1917] border border-[#FDE047] shadow-lg font-mono text-[10px] space-y-1"
              >
                <div className="flex items-center justify-between font-bold border-b border-black/10 pb-0.5">
                  <span className="uppercase tracking-wider">yellow-pad plan</span>
                  <span className="flex items-center space-x-1 text-[#44403C]">
                    <Clock className="w-2.5 h-2.5" /> <span>{item.estimatedTime}</span>
                  </span>
                </div>
                <div>
                  <span className="font-semibold">deliverable:</span> {item.deliverable}
                </div>
                <div className="space-y-0.5 pt-0.5">
                  {item.steps.map((st, i) => (
                    <div key={i} className="flex items-center space-x-1 text-[#292524]">
                      <span className="text-[#CA8A04]">[{i + 1}]</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
