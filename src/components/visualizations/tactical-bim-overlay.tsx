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
          transform: inView ? 'scale(0.95)' : 'scale(1.05)',
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

        {/* Left: Glass staircase stats — each step wider */}
        <div className="absolute left-0 bottom-16 sm:bottom-20 flex flex-col items-start gap-0.5 pointer-events-auto">
          {[
            { label: 'PROG', value: '74.2%', color: 'text-primary', dot: 'bg-primary', w: 'w-20 sm:w-24' },
            { label: 'ACTIVE', value: 'F5', color: 'text-amber-400', dot: 'bg-amber-400', w: 'w-24 sm:w-30' },
            { label: 'CLASH', value: '0', color: 'text-cyan-400', dot: 'bg-cyan-400', w: 'w-28 sm:w-36' },
          ].map((m, i) => (
            <div
              key={i}
              className={cn("bg-white/[0.04] backdrop-blur-md border border-white/[0.06] px-2 py-1 flex items-center gap-1.5", m.w)}
            >
              <div className={cn("size-1.5 rounded-full shrink-0", m.dot)} />
              <span className="text-[7px] font-mono text-white/40 uppercase tracking-wider truncate">{m.label}</span>
              <span className={cn("text-xs font-mono font-bold leading-none ml-auto shrink-0", m.color)}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* Bottom: 4D Timeline */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-6 pb-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">4D_Timeline</span>
            <div className="flex-1 h-px bg-white/[0.1]" />
            <span className="text-[9px] font-mono text-white/50 font-bold">Q1 2024 — Q4 2026</span>
          </div>
          <div className="relative h-1.5 bg-white/[0.06] overflow-visible">
            <div className="absolute inset-y-0 left-0 bg-primary/50" style={{ width: '38%' }} />
            {[
              { pos: '0%' }, { pos: '15%' }, { pos: '32%' },
              { pos: '55%' }, { pos: '72%' }, { pos: '88%' },
            ].map((m, i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: m.pos }}>
                <div className={cn("w-px h-full", parseFloat(m.pos) <= 38 ? "bg-primary/70" : "bg-white/15")} />
              </div>
            ))}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: '38%' }}>
              <div className="size-3 bg-primary rounded-full shadow-[0_0_10px_rgba(0,124,90,1)]" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            {[
              { label: 'SITE', done: true }, { label: 'FNDN', done: true }, { label: 'STRUCT', done: true },
              { label: 'ENVEL', done: false }, { label: 'MEP', done: false }, { label: 'FINISH', done: false },
            ].map((m, i) => (
              <span key={i} className={cn("text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider", m.done ? "text-white/80" : "text-white/30")}>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
