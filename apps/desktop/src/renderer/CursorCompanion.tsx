import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceState, CursorSkin, CURSOR_SKINS, PointingTarget, calculateBezierFlightPoint } from '@heyclicky/shared';
import { loadUserSettings } from '../services/storage.js';

interface CursorCompanionProps {
  onFlightComplete?: () => void;
}

export default function CursorCompanion({ onFlightComplete }: CursorCompanionProps) {
  const [mousePos, setMousePos] = useState({ x: 100, y: 100 });
  const [companionPos, setCompanionPos] = useState({ x: 135, y: 125 });
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [speechBubbleText, setSpeechBubbleText] = useState('');
  const [skin, setSkin] = useState<CursorSkin>('classic');
  const [isHidden, setIsHidden] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);
  const [flightAngle, setFlightAngle] = useState(-35);
  const [flightScale, setFlightScale] = useState(1);
  const [pointingTarget, setPointingTarget] = useState<PointingTarget | null>(null);

  const activeSkinMeta = CURSOR_SKINS.find((s) => s.id === skin) || CURSOR_SKINS[0];

  useEffect(() => {
    loadUserSettings().then((s) => {
      setSkin(s.cursorSkin || 'classic');
      if (s.hideFloatingCursor) {
        setIsHidden(true);
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (window.electronAPI) {
        window.electronAPI.updateCursorPos(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spring tracking loop
  useEffect(() => {
    let animId: number;
    const targetOffset = { x: 32, y: 24 };

    const updatePosition = () => {
      if (!isNavigating) {
        setCompanionPos((prev) => {
          const targetX = mousePos.x + targetOffset.x;
          const targetY = mousePos.y + targetOffset.y;
          // Spring interpolation
          const dx = (targetX - prev.x) * 0.25;
          const dy = (targetY - prev.y) * 0.25;
          return { x: prev.x + dx, y: prev.y + dy };
        });
      }
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isNavigating]);

  // Public flight trigger
  const flyToTarget = (target: PointingTarget) => {
    setIsNavigating(true);
    setPointingTarget(target);
    const start = { ...companionPos };
    const end = { x: target.x, y: target.y };
    let currentT = 0;
    const durationMs = 750;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      currentT = Math.min(1, elapsed / durationMs);

      const pt = calculateBezierFlightPoint(start, end, currentT, 70);
      setCompanionPos({ x: pt.x, y: pt.y });
      setFlightAngle(pt.rotationDeg);
      setFlightScale(pt.scale);

      if (currentT >= 1) {
        clearInterval(interval);
        setFlightAngle(-35);
        setSpeechBubbleText(target.label || 'right here!');
        setTimeout(() => {
          setSpeechBubbleText('');
          setIsNavigating(false);
          setPointingTarget(null);
          onFlightComplete?.();
        }, 2800);
      }
    }, 16);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${companionPos.x}px`,
        top: `${companionPos.y}px`,
        transform: `translate(-50%, -50%) rotate(${flightAngle}deg) scale(${flightScale})`,
      }}
    >
      {/* Speech / Label Bubble */}
      <AnimatePresence>
        {speechBubbleText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -45 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900/90 border border-clicky-blue/40 shadow-xl backdrop-blur-md text-xs font-semibold text-sky-200"
          >
            {speechBubbleText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cursor Companion Character */}
      <div
        className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border border-white/20 transition-all duration-200"
        style={{
          backgroundColor: activeSkinMeta.color,
          boxShadow: `0 0 18px ${activeSkinMeta.glowColor}`,
        }}
      >
        {voiceState === 'listening' ? (
          // Audio Waveform
          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [6, 16, 6] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                className="w-1 bg-white rounded-full"
              />
            ))}
          </div>
        ) : voiceState === 'processing' ? (
          // Spinner
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          // Character Face
          <span className="text-white text-xs font-mono font-bold tracking-tighter drop-shadow-sm">
            {activeSkinMeta.face}
          </span>
        )}
      </div>
    </div>
  );
}
