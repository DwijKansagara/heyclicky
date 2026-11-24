import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NextStepPillsProps {
  suggestions?: string[];
  onSelect: (text: string) => void;
}

export default function NextStepPills({ suggestions = [], onSelect }: NextStepPillsProps) {
  const [untappedCount, setUntappedCount] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Default suggestions if none provided
  const items = suggestions.length > 0 ? suggestions : [
    "Explain this step in detail",
    "Point to the next tool",
    "Draft a quick summary",
    "Show a 3D visualizer",
  ];

  const handleSelect = (text: string) => {
    setUntappedCount(0); // Reset consecutive untapped count
    onSelect(text);
  };

  // If 8 consecutive rows went untapped, take a 1-hour break
  if (isResting || untappedCount >= 8) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1.5">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => handleSelect(item)}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-medium transition-all active:scale-95 shadow-sm"
        >
          <span>{item}</span>
          <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
        </button>
      ))}
    </div>
  );
}
