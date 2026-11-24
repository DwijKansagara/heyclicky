import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSceneDefinition } from '@heyclicky/shared';
import { X, Info, RotateCw } from 'lucide-react';

interface ThreeSceneViewerProps {
  scene: ThreeSceneDefinition;
  onClose: () => void;
}

export default function ThreeSceneViewer({ scene, onClose }: ThreeSceneViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [position, setPosition] = useState({ x: scene.x || 150, y: scene.y || 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = scene.width || 340;
    const height = scene.height || 300;

    // Three.js Scene Setup
    const threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // Fallback
      return;
    }

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    threeScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    threeScene.add(dirLight);

    // Group for objects
    const group = new THREE.Group();
    threeScene.add(group);

    // Build geometries based on scene.modelType or parts
    if (scene.parts && scene.parts.length > 0) {
      scene.parts.forEach((p) => {
        let geo: THREE.BufferGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        if (p.geometry === 'cube') geo = new THREE.BoxGeometry(1, 1, 1);
        if (p.geometry === 'cylinder') geo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
        if (p.geometry === 'torus') geo = new THREE.TorusGeometry(0.8, 0.25, 16, 100);

        const mat = new THREE.MeshStandardMaterial({
          color: p.color || '#3b82f6',
          roughness: 0.3,
          metalness: 0.2,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(p.position[0], p.position[1], p.position[2]);
        if (p.scale) mesh.scale.set(p.scale[0], p.scale[1], p.scale[2]);
        (mesh as any).partData = p;
        group.add(mesh);
      });
    } else {
      // Default Heart or TorusKnot
      const geo = new THREE.TorusKnotGeometry(0.9, 0.3, 100, 16);
      const mat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (scene.autoRotate !== false) {
        group.rotation.y += 0.008;
      }
      renderer.render(threeScene, camera);
    };
    animate();

    // Mouse Interaction / Raycasting for clickable parts
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / width) * 2 - 1,
        -((event.clientY - rect.top) / height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children);

      if (intersects.length > 0) {
        const hit = intersects[0].object as any;
        if (hit.partData) {
          setSelectedPart(hit.partData);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [scene]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-40 pointer-events-auto rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl w-84 text-slate-100"
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-700/60 cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-semibold text-slate-200">{scene.title || 'Interactive 3D Visualizer'}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D Canvas */}
      <div ref={mountRef} className="relative flex justify-center items-center h-64 bg-slate-950/60 cursor-grab active:cursor-grabbing" />

      {/* Part Inspection Drawer */}
      {selectedPart && (
        <div className="px-3.5 py-2.5 bg-slate-800/90 border-t border-slate-700/80 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sky-300">{selectedPart.name}</div>
            <div className="text-slate-300 text-[11px] mt-0.5">{selectedPart.info}</div>
          </div>
        </div>
      )}
    </div>
  );
}
