import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VoiceState, 
  CursorSkin, 
  CURSOR_SKINS, 
  PointingTarget, 
  calculateBezierFlightPoint,
  UserSettings,
  DEFAULT_SETTINGS
} from '@heyclicky/shared';
import { loadUserSettings } from '../services/storage.js';

interface CursorCompanionProps {
  onFlightComplete?: () => void;
}

export default function CursorCompanion({ onFlightComplete }: CursorCompanionProps) {
  const [mousePos, setMousePos] = useState({ x: 120, y: 120 });
  const [companionPos, setCompanionPos] = useState({ x: 155, y: 145 });
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [speechBubbleText, setSpeechBubbleText] = useState('');
  const [skin, setSkin] = useState<CursorSkin>('classic');
  const [cursorColor, setCursorColor] = useState('#3b82f6');
  const [isHidden, setIsHidden] = useState(false);
  const [isHidingOut, setIsHidingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [flightAngle, setFlightAngle] = useState(-35);
  const [flightScale, setFlightScale] = useState(1);
  const [pointingTarget, setPointingTarget] = useState<PointingTarget | null>(null);

  const activeSkinMeta = CURSOR_SKINS.find((s) => s.id === skin) || CURSOR_SKINS[0];

  useEffect(() => {
    const refreshSettings = () => {
      loadUserSettings().then((s) => {
        setSkin(s.cursorSkin || 'classic');
        setCursorColor(s.cursorColor || '#3b82f6');
        if (s.hideFloatingCursor && !isHidden) {
          // Trigger graceful "okay see you <3" hide sequence
          setIsHidingOut(true);
          setSpeechBubbleText('okay see you <3');
          setTimeout(() => {
            setIsHidden(true);
            setIsHidingOut(false);
            setSpeechBubbleText('');
          }, 1400);
        } else if (!s.hideFloatingCursor && isHidden) {
          setIsHidden(false);
          setIsHidingOut(false);
        }
      });
    };

    refreshSettings();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (window.electronAPI) {
        window.electronAPI.updateCursorPos(e.clientX, e.clientY);
      }
    };

    const handlePointingEvent = (e: any) => {
      if (e.detail?.target) {
        flyToTarget(e.detail.target);
      }
    };

    const handleSettingsUpdated = () => {
      refreshSettings();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('HEYCLICKY_TRIGGER_POINTING', handlePointingEvent);
    window.addEventListener('HEYCLICKY_SETTINGS_UPDATED', handleSettingsUpdated);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('HEYCLICKY_TRIGGER_POINTING', handlePointingEvent);
      window.removeEventListener('HEYCLICKY_SETTINGS_UPDATED', handleSettingsUpdated);
    };
  }, [isHidden]);

  // Precise 0.2s spring follow physics with 0.6 damping
  useEffect(() => {
    let animId: number;
    let vx = 0;
    let vy = 0;
    const targetOffset = { x: 30, y: 22 };

    const springLoop = () => {
      if (!isNavigating) {
        setCompanionPos((prev) => {
          const targetX = mousePos.x + targetOffset.x;
          const targetY = mousePos.y + targetOffset.y;

          // Hooke's Law Spring with damping
          const k = 0.32; // Stiffness
          const d = 0.65; // Damping

          const ax = (targetX - prev.x) * k;
          const ay = (targetY - prev.y) * k;

          vx = (vx + ax) * d;
          vy = (vy + ay) * d;

          return { x: prev.x + vx, y: prev.y + vy };
        });
      }
      animId = requestAnimationFrame(springLoop);
    };

    animId = requestAnimationFrame(springLoop);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isNavigating]);

  // Bezier Flight to target UI element
  const flyToTarget = (target: PointingTarget) => {
    setIsNavigating(true);
    setPointingTarget(target);
    const start = { ...companionPos };
    const end = { x: target.x, y: target.y };
    const durationMs = 700;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / durationMs);

      const pt = calculateBezierFlightPoint(start, end, t, 65);
      setCompanionPos({ x: pt.x, y: pt.y });
      setFlightAngle(pt.rotationDeg);
      setFlightScale(pt.scale);

      if (t >= 1) {
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

  if (isHidden && !isHidingOut) {
    return null;
  }

  // Soft ambient glow derived from user cursor color
  const effectiveColor = cursorColor || activeSkinMeta.color;
  const glowStyle = `0 4px 20px ${effectiveColor}70, 0 0 10px ${effectiveColor}40`;

  return (
    <div
      className={`fixed pointer-events-none z-50 transition-opacity duration-300 select-none ${
        isHidingOut ? 'opacity-0 scale-90' : 'opacity-100'
      }`}
      style={{
        left: `${companionPos.x}px`,
        top: `${companionPos.y}px`,
        transform: `translate(-50%, -50%) rotate(${flightAngle}deg) scale(${flightScale})`,
      }}
    >
      {/* Speech / Callout Bubble clamped to screen */}
      <AnimatePresence>
        {speechBubbleText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: -46 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#18181B]/95 text-white border border-white/20 shadow-2xl backdrop-blur-md text-xs font-sans font-medium lowercase"
          >
            {speechBubbleText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cursor Companion Buddy */}
      <div
        className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border border-white/30 transition-transform active:scale-95"
        style={{
          backgroundColor: effectiveColor,
          boxShadow: glowStyle,
        }}
      >
        {voiceState === 'listening' ? (
          // Reactive Waveform
          <div className="flex items-center space-x-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [6, 18, 6] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.12 }}
                className="w-1 bg-white rounded-full"
              />
            ))}
          </div>
        ) : voiceState === 'processing' ? (
          // Breathing Spinner
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          // Expressive Face
          <span className="text-white text-xs font-mono font-bold tracking-tight drop-shadow-sm select-none">
            {activeSkinMeta.face}
          </span>
        )}
      </div>
    </div>
  );
}
