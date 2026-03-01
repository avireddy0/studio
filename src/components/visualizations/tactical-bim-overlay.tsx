'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const floors = [
  { level: "F6", name: "ROOF_DECK", progress: 12, status: "PLANNED" },
  { level: "F5", name: "LEVEL_05", progress: 45, status: "ACTIVE" },
  { level: "F4", name: "LEVEL_04", progress: 88, status: "FINISHING" },
  { level: "F3", name: "LEVEL_03", progress: 100, status: "COMPLETE" },
  { level: "F2", name: "LEVEL_02", progress: 100, status: "COMPLETE" },
  { level: "F1", name: "LEVEL_01", progress: 100, status: "COMPLETE" },
];

const gridLabels = ["A", "B", "C", "D", "E"];

function getFloorFill(progress: number, status: string) {
  if (status === "COMPLETE") return "rgba(0,124,90,0.35)";
  if (status === "FINISHING") return "rgba(0,124,90,0.2)";
  if (status === "ACTIVE") return "rgba(245,158,11,0.25)";
  return "rgba(255,255,255,0.04)";
}

function getStatusColor(status: string) {
  if (status === "COMPLETE") return "rgba(0,124,90,0.9)";
  if (status === "FINISHING") return "rgba(0,124,90,0.7)";
  if (status === "ACTIVE") return "rgba(245,158,11,0.8)";
  return "rgba(255,255,255,0.25)";
}

export function TacticalBimOverlay() {
  const [activeFloor, setActiveFloor] = useState(1); // F5 active by default
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanY((prev) => (prev + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const floorHeight = 62;
  const floorGap = 6;
  const startY = 60;
  const startX = 140;
  const floorWidth = 520;

  return (
    <div className="relative w-full h-[60vh] lg:h-full overflow-hidden border border-primary/20 bg-[#050508]">
      {/* Background grid */}
      <div className="absolute inset-0 tactical-grid opacity-15 pointer-events-none" />

      {/* SVG Building Cross-Section */}
      <svg
        viewBox="0 0 800 550"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="bim-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Structural Grid Lines — Vertical Columns */}
        {gridLabels.map((label, i) => {
          const x = startX + i * (floorWidth / (gridLabels.length - 1));
          return (
            <g key={label}>
              <line
                x1={x} y1={35} x2={x} y2={startY + floors.length * (floorHeight + floorGap) + 10}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"
              />
              <text x={x} y={25} fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {label}
              </text>
              {/* Column markers */}
              <rect
                x={x - 3} y={startY}
                width={6} height={floors.length * (floorHeight + floorGap)}
                fill="rgba(255,255,255,0.02)"
              />
            </g>
          );
        })}

        {/* Foundation */}
        <rect
          x={startX - 10} y={startY + floors.length * (floorHeight + floorGap) + 5}
          width={floorWidth + 20} height={28}
          fill="rgba(0,124,90,0.25)" stroke="rgba(0,124,90,0.5)" strokeWidth="1"
        />
        <text
          x={startX + floorWidth / 2}
          y={startY + floors.length * (floorHeight + floorGap) + 24}
          fill="rgba(0,124,90,0.7)" fontSize="9" fontFamily="monospace" textAnchor="middle"
        >
          FOUNDATION — 100% VERIFIED
        </text>

        {/* Floor Slabs */}
        {floors.map((floor, i) => {
          const y = startY + i * (floorHeight + floorGap);
          const isActive = i === activeFloor;
          const progressWidth = (floor.progress / 100) * floorWidth;

          return (
            <g
              key={floor.level}
              className="cursor-pointer"
              onClick={() => setActiveFloor(i)}
            >
              {/* Floor outline */}
              <rect
                x={startX} y={y}
                width={floorWidth} height={floorHeight}
                fill="transparent"
                stroke={isActive ? "rgba(0,124,90,0.6)" : "rgba(255,255,255,0.06)"}
                strokeWidth={isActive ? 2 : 1}
              />

              {/* Progress fill */}
              <rect
                x={startX} y={y}
                width={progressWidth} height={floorHeight}
                fill={getFloorFill(floor.progress, floor.status)}
              >
                <animate attributeName="width" from="0" to={progressWidth} dur="1.2s" fill="freeze" />
              </rect>

              {/* Bay dividers within floor */}
              {gridLabels.slice(1, -1).map((_, gi) => {
                const gx = startX + (gi + 1) * (floorWidth / (gridLabels.length - 1));
                return (
                  <line
                    key={gi} x1={gx} y1={y} x2={gx} y2={y + floorHeight}
                    stroke="rgba(255,255,255,0.03)" strokeWidth="1"
                  />
                );
              })}

              {/* Floor label */}
              <text x={startX + 8} y={y + 22} fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="monospace" fontWeight="bold">
                {floor.level}
              </text>
              <text x={startX + 8} y={y + 38} fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace">
                {floor.name}
              </text>

              {/* Progress percentage */}
              <text
                x={startX + floorWidth - 8} y={y + 22}
                fill={floor.progress === 100 ? "rgba(0,124,90,0.9)" : "rgba(255,255,255,0.5)"}
                fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="end"
              >
                {floor.progress}%
              </text>
              <text
                x={startX + floorWidth - 8} y={y + 38}
                fill={getStatusColor(floor.status)}
                fontSize="8" fontFamily="monospace" textAnchor="end"
              >
                {floor.status}
              </text>

              {/* Active floor highlight */}
              {isActive && (
                <>
                  <rect x={startX - 5} y={y} width={4} height={floorHeight} fill="rgba(0,124,90,1)" />
                  <line
                    x1={startX} y1={y + floorHeight / 2}
                    x2={startX + floorWidth} y2={y + floorHeight / 2}
                    stroke="rgba(0,124,90,0.12)" strokeWidth="1" strokeDasharray="8 4"
                  />
                </>
              )}

              {/* Active construction zone indicator */}
              {floor.status === "ACTIVE" && (
                <g>
                  <rect x={startX + progressWidth - 2} y={y} width={3} height={floorHeight} fill="rgba(245,158,11,0.8)">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                  </rect>
                  <text
                    x={startX + progressWidth + 8} y={y + floorHeight / 2 + 3}
                    fill="rgba(245,158,11,0.6)" fontSize="7" fontFamily="monospace"
                  >
                    ACTIVE_ZONE
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Measurement Annotations */}
        <g>
          {/* Height marker */}
          <line x1={110} y1={startY} x2={110} y2={startY + floors.length * (floorHeight + floorGap)} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1={105} y1={startY} x2={115} y2={startY} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1={105} y1={startY + floors.length * (floorHeight + floorGap)} x2={115} y2={startY + floors.length * (floorHeight + floorGap)} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text
            x={100}
            y={startY + (floors.length * (floorHeight + floorGap)) / 2}
            fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="monospace" textAnchor="end"
            transform={`rotate(-90, 100, ${startY + (floors.length * (floorHeight + floorGap)) / 2})`}
          >
            24.8m TOTAL HEIGHT
          </text>

          {/* Width marker */}
          <line x1={startX} y1={startY + floors.length * (floorHeight + floorGap) + 48} x2={startX + floorWidth} y2={startY + floors.length * (floorHeight + floorGap) + 48} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1={startX} y1={startY + floors.length * (floorHeight + floorGap) + 43} x2={startX} y2={startY + floors.length * (floorHeight + floorGap) + 53} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1={startX + floorWidth} y1={startY + floors.length * (floorHeight + floorGap) + 43} x2={startX + floorWidth} y2={startY + floors.length * (floorHeight + floorGap) + 53} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text
            x={startX + floorWidth / 2}
            y={startY + floors.length * (floorHeight + floorGap) + 62}
            fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="monospace" textAnchor="middle"
          >
            52.0m STRUCTURAL SPAN
          </text>
        </g>

        {/* Scan Line */}
        <line
          x1={startX - 15}
          y1={startY + (scanY / 100) * (floors.length * (floorHeight + floorGap))}
          x2={startX + floorWidth + 15}
          y2={startY + (scanY / 100) * (floors.length * (floorHeight + floorGap))}
          stroke="rgba(0,124,90,0.35)"
          strokeWidth="1"
          filter="url(#bim-glow)"
        />
      </svg>

      {/* HUD Overlay */}
      <div className="absolute inset-0 p-3 sm:p-5 md:p-6 flex flex-col justify-between z-20 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-3 pointer-events-auto">
            <div className="flex items-center gap-3 bg-black/80 border border-primary/40 px-3 py-2">
              <Activity className="size-4 text-primary animate-status" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">BIM_MODEL_ACTIVE</span>
                <span className="text-[8px] font-mono text-primary uppercase">LOD 400 | Rev 4.2</span>
              </div>
            </div>
            <div className="hidden sm:block bg-black/80 border border-white/10 px-3 py-2 space-y-1.5">
              <div className="flex justify-between items-center gap-6">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">Project_Node</span>
                <span className="text-[9px] font-mono text-white uppercase">PHOENIX_A</span>
              </div>
              <div className="flex justify-between items-center gap-6">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">As_Built_Sync</span>
                <span className="text-[9px] font-mono text-primary uppercase">Verified</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex bg-black/80 border border-primary/20 p-3 flex-col items-center gap-1.5 pointer-events-auto">
            <Layers className="size-6 text-primary/50" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">6 LEVELS</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 pointer-events-auto">
          <div className="bg-black/80 border-l-2 border-primary p-2 sm:p-3 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Overall_Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-mono font-bold text-white">74.2%</span>
              <span className="text-[9px] text-primary uppercase font-bold">+1.2% Δ</span>
            </div>
          </div>
          <div className="bg-black/80 border-l-2 border-amber-500 p-2 sm:p-3 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Active_Floor</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-mono font-bold text-white">F5</span>
              <span className="text-[9px] text-amber-500 uppercase font-bold">In_Progress</span>
            </div>
          </div>
          <div className="bg-black/80 border-l-2 border-primary p-2 sm:p-3 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Clash_Detection</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-mono font-bold text-white">0</span>
              <span className="text-[9px] text-primary uppercase font-bold">Clear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
