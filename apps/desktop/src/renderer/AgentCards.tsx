import React, { useState, useEffect } from 'react';
import { AgentBuddyJob } from '@heyclicky/shared';
import { agentBuddiesManager } from '../services/agent-buddies.js';
import { ChevronLeft, ChevronRight, Square, RotateCw, FileText, CheckCircle2 } from 'lucide-react';

export default function AgentCards() {
  const [jobs, setJobs] = useState<AgentBuddyJob[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsub = agentBuddiesManager.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) => (i > 0 ? i - 1 : jobs.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i < jobs.length - 1 ? i + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsub();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [jobs.length]);

  if (jobs.length === 0) {
    return (
      <div className="p-3 text-center text-xs font-mono text-gray-400 lowercase">
        no active agent buddies running
      </div>
    );
  }

  const currentJob = jobs[Math.min(activeIndex, jobs.length - 1)];

  const prevCard = () => setActiveIndex((i) => (i > 0 ? i - 1 : jobs.length - 1));
  const nextCard = () => setActiveIndex((i) => (i < jobs.length - 1 ? i + 1 : 0));

  return (
    <div className="w-full p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-md select-none text-xs">
      {/* Top Header with navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-xs text-black dark:text-white lowercase">{currentJob.name}</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 text-gray-500 uppercase font-mono">
            {currentJob.status}
          </span>
        </div>

        {jobs.length > 1 && (
          <div className="flex items-center space-x-1 text-gray-400 text-xs font-mono">
            <span>{activeIndex + 1}/{jobs.length}</span>
            <button onClick={prevCard} className="p-0.5 hover:text-white rounded" title="Previous (←)">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button onClick={nextCard} className="p-0.5 hover:text-white rounded" title="Next (→)">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono lowercase">
          <span className="truncate pr-2">{currentJob.currentActionDescription}</span>
          <span>{currentJob.progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${currentJob.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Plan List */}
      <div className="mt-2.5 space-y-1">
        {currentJob.livePlan.map((step, i) => (
          <div key={i} className="flex items-center space-x-1.5 text-[11px] text-gray-600 dark:text-gray-300 lowercase">
            {i < Math.floor(currentJob.progressPercent / 25) ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <span className="w-3 h-3 rounded-full border border-gray-400 dark:border-gray-600 shrink-0" />
            )}
            <span className={i < Math.floor(currentJob.progressPercent / 25) ? 'line-through text-gray-400' : ''}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Artifact Deliverables */}
      {currentJob.artifacts.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
          <div className="text-[9px] text-gray-400 uppercase font-mono tracking-wider">deliverables</div>
          {currentJob.artifacts.map((art) => (
            <div key={art.id} className="flex items-center justify-between text-[11px] bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg">
              <div className="flex items-center space-x-1 text-sky-500 truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">{art.name}</span>
              </div>
              {art.isNew && <span className="text-[9px] px-1 bg-sky-500/20 text-sky-400 rounded font-mono">NEW</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
