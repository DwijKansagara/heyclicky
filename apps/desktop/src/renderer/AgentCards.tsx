import React, { useState, useEffect } from 'react';
import { AgentBuddyJob } from '@heyclicky/shared';
import { agentBuddiesManager } from '../services/agent-buddies.js';
import { ChevronLeft, ChevronRight, Square, RotateCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AgentCards() {
  const [jobs, setJobs] = useState<AgentBuddyJob[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return agentBuddiesManager.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });
  }, []);

  if (jobs.length === 0) return null;

  const currentJob = jobs[Math.min(activeIndex, jobs.length - 1)];

  const prevCard = () => setActiveIndex((i) => (i > 0 ? i - 1 : jobs.length - 1));
  const nextCard = () => setActiveIndex((i) => (i < jobs.length - 1 ? i + 1 : 0));

  return (
    <div className="w-full mt-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md">
      {/* Top Header with navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">{currentJob.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-mono">
            {currentJob.status}
          </span>
        </div>

        {jobs.length > 1 && (
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>{activeIndex + 1}/{jobs.length}</span>
            <button onClick={prevCard} className="p-0.5 hover:text-white rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextCard} className="p-0.5 hover:text-white rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5">
        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
          <span>{currentJob.currentActionDescription}</span>
          <span>{currentJob.progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${currentJob.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Plan List */}
      <div className="mt-3 space-y-1">
        {currentJob.livePlan.map((step, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
            {i < Math.floor(currentJob.progressPercent / 25) ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
            )}
            <span className={i < Math.floor(currentJob.progressPercent / 25) ? 'line-through text-slate-500' : ''}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Artifact Deliverables */}
      {currentJob.artifacts.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Deliverables</div>
          {currentJob.artifacts.map((art) => (
            <div key={art.id} className="flex items-center justify-between text-xs bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/40">
              <div className="flex items-center gap-1.5 text-sky-300 truncate">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{art.name}</span>
              </div>
              {art.isNew && <span className="text-[10px] px-1 bg-sky-500/20 text-sky-400 rounded font-semibold">NEW</span>}
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[10px] text-slate-500">
          Started: {new Date(currentJob.startedAt).toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-1.5">
          {currentJob.status === 'running' || currentJob.status === 'planning' ? (
            <button
              onClick={() => agentBuddiesManager.stopJob(currentJob.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
            >
              <Square className="w-3 h-3" /> Stop
            </button>
          ) : (
            <button
              onClick={() => agentBuddiesManager.retryFromCheckpoint(currentJob.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold transition-colors"
            >
              <RotateCw className="w-3 h-3" /> Retry Checkpoint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
