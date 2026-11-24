import React, { useState, useEffect, useRef } from 'react';
import { ScreenDrawing, CircleDrawing, HighlightDrawing, ArrowDrawing, InkStrokeDrawing, PhotoCardDrawing } from '@heyclicky/shared';
import ThreeSceneViewer from './ThreeSceneViewer.js';

export default function CanvasDrawingOverlay() {
  const [drawings, setDrawings] = useState<ScreenDrawing[]>([]);
  const [isInkMode, setIsInkMode] = useState(false);
  const [currentInkStroke, setCurrentInkStroke] = useState<{ x: number; y: number }[]>([]);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll tracking simulation / listener
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Anchor to main viewport scrolls, ignore sidebar scrolls
      if (!target || target === document.body || target === document.documentElement) {
        setScrollOffset({ x: window.scrollX, y: window.scrollY });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of drawings) {
      // Apply scroll tracking offset if anchored
      const offsetX = d.anchor ? scrollOffset.x - d.anchor.viewportScrollX : 0;
      const offsetY = d.anchor ? scrollOffset.y - d.anchor.viewportScrollY : 0;

      ctx.save();
      ctx.strokeStyle = d.color || '#3b82f6';
      ctx.lineWidth = d.strokeWidth || 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (d.type === 'circle' || d.type === 'ring') {
        const c = d as CircleDrawing;
        ctx.beginPath();
        ctx.arc(c.centerX - offsetX, c.centerY - offsetY, c.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (d.type === 'highlight') {
        const h = d as HighlightDrawing;
        ctx.fillStyle = d.color || 'rgba(16, 185, 129, 0.25)';
        ctx.fillRect(h.x - offsetX, h.y - offsetY, h.width, h.height);
      } else if (d.type === 'arrow' || d.type === 'line') {
        const a = d as ArrowDrawing;
        ctx.beginPath();
        ctx.moveTo(a.startX - offsetX, a.startY - offsetY);
        ctx.lineTo(a.endX - offsetX, a.endY - offsetY);
        ctx.stroke();

        // Arrow head
        if (d.type === 'arrow') {
          const angle = Math.atan2(a.endY - a.startY, a.endX - a.startX);
          const headLen = 14;
          ctx.beginPath();
          ctx.moveTo(a.endX - offsetX, a.endY - offsetY);
          ctx.lineTo(
            a.endX - offsetX - headLen * Math.cos(angle - Math.PI / 6),
            a.endY - offsetY - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(a.endX - offsetX, a.endY - offsetY);
          ctx.lineTo(
            a.endX - offsetX - headLen * Math.cos(angle + Math.PI / 6),
            a.endY - offsetY - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      } else if (d.type === 'ink') {
        const ink = d as InkStrokeDrawing;
        if (ink.points && ink.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(ink.points[0].x - offsetX, ink.points[0].y - offsetY);
          for (let i = 1; i < ink.points.length; i++) {
            ctx.lineTo(ink.points[i].x - offsetX, ink.points[i].y - offsetY);
          }
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }, [drawings, scrollOffset]);

  const clearAllDrawings = () => {
    setDrawings([]);
    if (window.electronAPI) {
      window.electronAPI.setOverlayClickThrough(true);
    }
  };

  const hasDrawings = drawings.length > 0;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="w-full h-full"
      />

      {/* Render Floating 3D Scenes */}
      {drawings
        .filter((d) => d.type === 'scene_3d')
        .map((scene: any) => (
          <ThreeSceneViewer
            key={scene.id}
            scene={scene}
            onClose={() => setDrawings((prev) => prev.filter((d) => d.id !== scene.id))}
          />
        ))}

      {/* Clear Button: Visible ONLY while live drawings remain */}
      {hasDrawings && (
        <div className="fixed bottom-6 right-6 pointer-events-auto z-40">
          <button
            onClick={clearAllDrawings}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-700/80 rounded-full shadow-2xl text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
          >
            <span>Clear Annotations</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
}
