'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const BimScene = dynamic(() => import('./bim-scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050508]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 border-2 border-primary/30 border-t-primary animate-spin rounded-full" />
        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
          Initializing_BIM_Model...
        </span>
      </div>
    </div>
  ),
});

const FLOOR_INFO = [
  { level: 8, name: 'ROOF_DECK', progress: 0, status: 'PLANNED' as const },
  { level: 7, name: 'LEVEL_07', progress: 0, status: 'PLANNED' as const },
  { level: 6, name: 'LEVEL_06', progress: 12, status: 'PLANNED' as const },
  { level: 5, name: 'LEVEL_05', progress: 45, status: 'ACTIVE' as const },
  { level: 4, name: 'LEVEL_04', progress: 88, status: 'FINISHING' as const },
  { level: 3, name: 'LEVEL_03', progress: 100, status: 'COMPLETE' as const },
  { level: 2, name: 'LEVEL_02', progress: 100, status: 'COMPLETE' as const },
  { level: 1, name: 'LEVEL_01', progress: 100, status: 'COMPLETE' as const },
];

const STATUS_DOT: Record<string, string> = {
  COMPLETE: 'bg-primary',
  FINISHING: 'bg-primary/70',
  ACTIVE: 'bg-amber-500',
  PLANNED: 'bg-cyan-400',
};

const STATUS_TEXT: Record<string, string> = {
  COMPLETE: 'text-primary',
  FINISHING: 'text-primary/70',
  ACTIVE: 'text-amber-500',
  PLANNED: 'text-cyan-400',
};

export function TacticalBimOverlay() {
  const [selectedLevel, setSelectedLevel] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden border border-primary/20 bg-[#050508]"
    >
      {/* 3D Canvas */}
      <div
        className="absolute inset-0"
        style={{
          transform: inView ? 'scale(0.85)' : 'scale(1.05)',
          transition: 'transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <BimScene selectedFloor={selectedLevel} onFloorSelect={setSelectedLevel} />
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top-left: Model status */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-black/80 border border-primary/40 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur-sm">
            <Activity className="size-3 sm:size-4 text-primary animate-status" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                Digital_Twin_Active
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono text-primary uppercase">
                LOD 400 | 8 Levels | Rev 4.2
              </span>
            </div>
          </div>
        </div>

        {/* Top-right: Orbit controls hint */}
        <div className="absolute top-3 right-3 hidden sm:block">
          <div className="bg-black/60 border border-white/10 px-3 py-2 space-y-0.5">
            <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
              Drag — Orbit
            </p>
            <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
              Scroll — Zoom
            </p>
            <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
              Click — Select Floor
            </p>
          </div>
        </div>

        {/* Bottom: Floor legend + metrics */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex gap-2 pointer-events-auto">
          {/* Floor legend (hidden on small screens) */}
          <div className="hidden md:flex flex-col gap-0.5 bg-black/80 border border-white/10 p-2 backdrop-blur-sm shrink-0">
            {FLOOR_INFO.map((f) => (
              <button
                key={f.level}
                onClick={() => setSelectedLevel(f.level)}
                className={cn(
                  'flex items-center gap-2 px-2 py-0.5 text-left transition-all',
                  selectedLevel === f.level ? 'bg-white/10' : 'hover:bg-white/5'
                )}
              >
                <div className={cn('size-1.5 rounded-full', STATUS_DOT[f.status])} />
                <span className="text-[8px] font-mono text-white/70 font-bold w-5">
                  F{f.level}
                </span>
                <span
                  className={cn(
                    'text-[7px] font-mono uppercase tracking-wider',
                    STATUS_TEXT[f.status]
                  )}
                >
                  {f.status}
                </span>
                <span className="text-[7px] font-mono text-white/30 ml-auto pl-2">
                  {f.progress}%
                </span>
              </button>
            ))}
          </div>

          {/* Metrics */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="bg-black/80 border-l-2 border-primary p-2 sm:p-3">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">Overall</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-mono font-bold text-white">74.2%</span>
                <span className="text-[8px] text-primary font-bold">+1.2%</span>
              </div>
            </div>
            <div className="bg-black/80 border-l-2 border-amber-500 p-2 sm:p-3">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">Active</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-mono font-bold text-white">F5</span>
                <span className="text-[8px] text-amber-500 font-bold">45%</span>
              </div>
            </div>
            <div className="bg-black/80 border-l-2 border-cyan-400 p-2 sm:p-3">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">Clashes</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-mono font-bold text-white">0</span>
                <span className="text-[8px] text-primary font-bold">Clear</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
