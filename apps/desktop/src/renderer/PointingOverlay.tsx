import React from 'react';
import { PointingTarget } from '@heyclicky/shared';
import { motion } from 'framer-motion';

interface PointingOverlayProps {
  target: PointingTarget;
  stepNumber?: number;
}

export default function PointingOverlay({ target, stepNumber = 1 }: PointingOverlayProps) {
  return (
    <div
      style={{ left: `${target.x}px`, top: `${target.y}px` }}
      className="fixed z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
    >
      {/* Pulse Beacon */}
      <motion.div
        animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute inset-0 -m-3 w-12 h-12 rounded-full border-2 border-sky-400 bg-sky-500/20"
      />

      {/* Target Marker */}
      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs shadow-lg border border-white">
        {stepNumber}
      </div>

      {/* Cue Label */}
      {target.label && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-900/95 border border-sky-400/60 text-sky-200 text-xs font-semibold shadow-xl backdrop-blur-md">
          {target.label}
        </div>
      )}
    </div>
  );
}
