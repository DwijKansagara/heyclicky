import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, X, Sparkles, Clock } from 'lucide-react';
import { agentBuddiesManager } from '../services/agent-buddies.js';

interface SuggestionItem {
  id: string;
  title: string;
  estimatedTime: string;
  deliverable: string;
  sourceApp: string;
  steps: string[];
}

export default function MorningSuggestions({ onDismiss }: { onDismiss?: () => void }) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([
    {
      id: 'sug_1',
      title: 'Summarize 4 unread investor updates in Gmail',
      estimatedTime: '2 mins',
      deliverable: 'Clean bulleted brief with key metrics and asks',
      sourceApp: 'Gmail (Work)',
      steps: ['Scan inbox for sender labels', 'Extract traction metrics', 'Draft executive summary'],
    },
    {
      id: 'sug_2',
      title: 'Prepare talking points for 2 PM Product Sync',
      estimatedTime: '3 mins',
      deliverable: 'Notion meeting agenda draft',
      sourceApp: 'Google Calendar',
      steps: ['Read calendar attendee list', 'Fetch recent GitHub commit logs', 'Outline 3 discussion points'],
    },
  ]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDoIt = (item: SuggestionItem) => {
    agentBuddiesManager.createJob(item.title, item.deliverable);
    setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleNah = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full mt-2 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Morning Suggestions
        </span>
        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-200 text-xs">
          Dismiss
        </button>
      </div>

      {suggestions.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-medium text-slate-200 truncate flex-1">
              {item.title}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleDoIt(item)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-all shadow-sm active:scale-95"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                Do it
              </button>
              <button
                onClick={() => handleNah(item.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 text-[11px] transition-colors"
                title="Nah, dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Yellow-Pad Plan Hover Reveal */}
          <AnimatePresence>
            {hoveredId === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="mt-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 shadow-xl font-mono text-[11px] space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold border-b border-amber-200/80 pb-1">
                  <span>Yellow-Pad Plan</span>
                  <span className="flex items-center gap-1 text-[10px] text-amber-800 font-sans">
                    <Clock className="w-3 h-3" /> {item.estimatedTime}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-amber-900">Deliverable:</span> {item.deliverable}
                </div>
                <div className="space-y-0.5 pt-1">
                  {item.steps.map((st, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-amber-900/90 text-[10px]">
                      <span className="text-amber-500">[{i + 1}]</span>
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
