'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map as MapIcon, FileText, Target, Shield, AlertTriangle, X, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// CINEMATIC SEQUENCE (20s cycle, starts immediately)
// ═══════════════════════════════════════════════════════════════

interface CinePhase {
  name: string;
  duration: number;
  zoom: number;
  originX: number;
  originY: number;
  lockTarget?: boolean;
}

const PHASES: CinePhase[] = [
  { name: 'TGT_ALPHA', duration: 7000, zoom: 2.4, originX: 42.5, originY: 35, lockTarget: true },
  { name: 'TGT_BRAVO', duration: 7000, zoom: 2.1, originX: 69.4, originY: 72.5, lockTarget: true },
  { name: 'SWEEP',     duration: 3000, zoom: 1.3, originX: 50,   originY: 50 },
  { name: 'COMPLETE',  duration: 3000, zoom: 1,   originX: 50,   originY: 50 },
];
const TOTAL_CYCLE = PHASES.reduce((s, p) => s + p.duration, 0);

interface DocItem {
  id: string;
  cat: string;
  final: 'VERIFIED' | 'AUDIT' | 'PENDING';
  receivedAt: number;
  finalAt: number;
}

const DOCS: DocItem[] = [
  { id: 'ZONING_LAND_USE_ANALYSIS',  cat: 'REGULATORY',  final: 'VERIFIED', receivedAt: 1000,  finalAt: 3000  },
  { id: 'PHASE_I_ENVIRONMENTAL_ESA', cat: 'ENVIRON',     final: 'VERIFIED', receivedAt: 2000,  finalAt: 4000  },
  { id: 'GEOTECH_SOIL_REPORT',       cat: 'ENGINEERING', final: 'VERIFIED', receivedAt: 3500,  finalAt: 5500  },
  { id: 'TITLE_SURVEY_REVIEW',       cat: 'LEGAL',       final: 'VERIFIED', receivedAt: 8000,  finalAt: 10000 },
  { id: 'MARKET_FEASIBILITY_STUDY',  cat: 'FINANCIAL',   final: 'VERIFIED', receivedAt: 9000,  finalAt: 11000 },
  { id: 'FINANCIAL_PRO_FORMA_V3',    cat: 'FINANCIAL',   final: 'VERIFIED', receivedAt: 10500, finalAt: 12500 },
  { id: 'TRAFFIC_IMPACT_STUDY',      cat: 'ENGINEERING', final: 'AUDIT',    receivedAt: 15000, finalAt: 16500 },
  { id: 'CEQA_INITIAL_STUDY',        cat: 'ENVIRON',     final: 'PENDING',  receivedAt: -1,    finalAt: -1    },
];

function getDocStatus(doc: DocItem, t: number): string {
  if (doc.finalAt > 0 && t >= doc.finalAt) return doc.final;
  if (doc.receivedAt > 0 && t >= doc.receivedAt) return 'RECEIVED';
  return 'PENDING';
}

const ALPHA_LINES = [
  'ZONE: C2-2D-O | FAR: 6:1',
  'HT_MAX: 395ft | STORIES: 30',
  'SETBACK: F=10 S=6 R=15',
  'BUILDABLE: 96,000sf',
  'LOT_COV: 75% | USE: MIXED(B/R-2)',
  'STATUS: FEASIBLE \u2713',
];
const BRAVO_LINES = [
  'PARKING: 192 req / 169 prov',
  'RATIO: 1:500sf | DEFICIT: -12%',
  'VARIANCE: SIDE=0ft | GAP: 23',
  'STATUS: AT_RISK \u26A0',
];

// ═══════════════════════════════════════════════════════════════
// READOUT PANEL
// ═══════════════════════════════════════════════════════════════

function ReadoutPanel({ lines, active, color = 'green' }: {
  lines: string[];
  active: boolean;
  color?: 'green' | 'amber';
}) {
  const [lineIdx, setLineIdx] = useState(-1);
  const [charIdx, setCharIdx] = useState(0);
  const linesRef = useRef(lines);

  useEffect(() => {
    linesRef.current = lines;
    if (!active) { setLineIdx(-1); setCharIdx(0); return; }
    setLineIdx(0);
    setCharIdx(0);

    let li = 0;
    let ci = 0;
    const interval = setInterval(() => {
      if (li >= linesRef.current.length) { clearInterval(interval); return; }
      ci++;
      if (ci > linesRef.current[li].length) {
        li++;
        ci = 0;
        setLineIdx(li);
        setCharIdx(0);
      } else {
        setCharIdx(ci);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [active, lines]);

  if (lineIdx < 0) return null;

  const isGreen = color === 'green';
  return (
    <div className={cn(
      "bg-black/85 backdrop-blur-sm border rounded px-2.5 py-2 max-w-[200px] sm:max-w-[240px]",
      isGreen ? "border-primary/30" : "border-yellow-500/30"
    )}>
      <div className={cn(
        "text-[7px] font-mono font-bold uppercase tracking-[0.2em] mb-1.5",
        isGreen ? "text-primary" : "text-yellow-500/70"
      )}>
        {isGreen ? '// ZONING INTEL' : '// RISK FLAGS'}
      </div>
      {lines.map((line, i) => {
        if (i > lineIdx) return null;
        const chars = i < lineIdx ? line : line.slice(0, charIdx);
        const isLast = i === lineIdx && charIdx < line.length;
        const isStatusLine = line.startsWith('STATUS:');
        return (
          <div key={i} className={cn(
            "font-mono text-[8px] sm:text-[9px] leading-[1.6]",
            isStatusLine && i <= lineIdx
              ? (isGreen ? "text-primary font-bold" : "text-yellow-500 font-bold")
              : "text-white"
          )}>
            {chars}
            {isLast && (
              <span className={cn(
                "inline-block w-[4px] h-[8px] ml-0.5 align-middle animate-pulse",
                isGreen ? "bg-primary" : "bg-yellow-500/70"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STATUS LINE — typewriter
// ═══════════════════════════════════════════════════════════════

function StatusLine({ text, phaseKey }: { text: string; phaseKey: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx <= text.length) {
        setDisplayed(text.slice(0, idx));
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text, phaseKey]);

  return (
    <div className="font-mono text-[9px] sm:text-[10px] text-primary leading-relaxed">
      <span className="text-primary/40 mr-1">&gt;</span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[5px] h-[10px] bg-primary/70 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}

const STATUS_MSGS: Record<string, string> = {
  'TGT_ALPHA': 'SCANNING SUBJECT SITE \u2014 APN 0412-031-001',
  'TGT_BRAVO': 'SCANNING PARKING SITE \u2014 APN 0412-045',
  'SWEEP':     'COMPILING ANALYSIS RESULTS... SWEEP COMPLETE',
  'COMPLETE':  'FEASIBILITY ASSESSMENT READY \u2014 6/8 VERIFIED',
};

// Which doc indices are "active" during each phase
const PHASE_ACTIVE_DOCS: Record<string, number[]> = {
  'TGT_ALPHA': [0, 1, 2],
  'TGT_BRAVO': [3, 4, 5],
  'SWEEP':     [6],
  'COMPLETE':  [],
};

// ═══════════════════════════════════════════════════════════════
// STATUS BADGE — rich interactive badge
// ═══════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: string }) {
  const config = {
    VERIFIED: { bg: 'bg-primary/15', text: 'text-primary', border: 'border-primary/25', icon: Shield },
    RECEIVED: { bg: 'bg-cyan-400/10', text: 'text-cyan-400', border: 'border-cyan-400/20', icon: null },
    AUDIT:    { bg: 'bg-yellow-500/15', text: 'text-yellow-500', border: 'border-yellow-500/25', icon: AlertTriangle },
    PENDING:  { bg: 'bg-white/[0.03]', text: 'text-white/30', border: 'border-white/[0.06]', icon: null },
  }[status] || { bg: '', text: 'text-white/30', border: 'border-white/5', icon: null };

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider transition-all duration-700",
      config.bg, config.text, config.border
    )}>
      {Icon && <Icon className="size-2.5" />}
      <span>{status}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS RING — circular progress indicator
// ═══════════════════════════════════════════════════════════════

function ProgressRing({ progress, verified, total }: { progress: number; verified: number; total: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative size-[72px] flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke="rgba(0,124,90,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      <div className="text-center">
        <div className="text-[14px] font-mono font-bold text-primary">{verified}</div>
        <div className="text-[7px] font-mono text-white/25">/{total}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function FeasibilitySection() {
  const [elapsed, setElapsed] = useState(0);
  const [hoveredDoc, setHoveredDoc] = useState<number | null>(null);
  const [vaultOpen, setVaultOpen] = useState(false);
  const startRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseCounterRef = useRef(0);
  const prevPhaseRef = useRef(-1);
  const prevStatusesRef = useRef<string[]>(DOCS.map(() => 'PENDING'));
  const [flashingRows, setFlashingRows] = useState<Set<number>>(new Set());

  const toggleVault = useCallback(() => setVaultOpen(prev => !prev), []);

  // Auto-open vault after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVaultOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = setInterval(() => {
      setElapsed((Date.now() - startRef.current) % TOTAL_CYCLE);
    }, 50);
    return () => clearInterval(tick);
  }, []);

  // Track status transitions and flash rows
  useEffect(() => {
    const currentStatuses = DOCS.map(d => getDocStatus(d, elapsed));
    const changed: number[] = [];
    for (let i = 0; i < currentStatuses.length; i++) {
      if (currentStatuses[i] !== prevStatusesRef.current[i]) {
        changed.push(i);
      }
    }
    if (changed.length > 0) {
      prevStatusesRef.current = currentStatuses;
      setFlashingRows(new Set(changed));
      const timer = setTimeout(() => setFlashingRows(new Set()), 1200);
      return () => clearTimeout(timer);
    }
  }, [elapsed]);

  const overlayStage = 3;

  // Derive current phase
  let acc = 0;
  let phaseIdx = 0;
  for (let i = 0; i < PHASES.length; i++) {
    acc += PHASES[i].duration;
    if (elapsed < acc) { phaseIdx = i; break; }
  }
  const phase = PHASES[phaseIdx];

  let phaseStart = 0;
  for (let i = 0; i < phaseIdx; i++) phaseStart += PHASES[i].duration;
  const inPhase = elapsed - phaseStart;

  if (phaseIdx !== prevPhaseRef.current) {
    phaseCounterRef.current++;
    prevPhaseRef.current = phaseIdx;
  }

  const showAlphaReadout = phase.name === 'TGT_ALPHA' && inPhase > 1200;
  const showBravoReadout = phase.name === 'TGT_BRAVO' && inPhase > 1200;

  const counts: Record<string, number> = {};
  DOCS.forEach(d => {
    const s = getDocStatus(d, elapsed);
    counts[s] = (counts[s] || 0) + 1;
  });

  const verifiedCount = counts['VERIFIED'] || 0;
  const totalDocs = DOCS.length;
  const activeDocIndices = PHASE_ACTIVE_DOCS[phase.name] || [];
  const cycleProgress = Math.round((elapsed / TOTAL_CYCLE) * 100);

  return (
    <div ref={containerRef} className="contents">
      <div className="flex items-center gap-3 shrink-0">
        <MapIcon className="size-4 text-primary" />
        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">06_Instant_Feasibility</h2>
      </div>

      {/* ═══ MAIN LAYOUT: Full-width Map + Floating Vault ═══ */}
      <div className="flex-1 overflow-hidden flex flex-col gap-3 md:gap-5 relative">

        {/* ═══ TACTICAL MAP (full width) ═══ */}
        <Card className={cn(
          "bg-[#12121A] border-[#1E1E2E] relative overflow-hidden flex-1 min-h-[280px] flex flex-col transition-shadow duration-1000",
          phase.lockTarget && "shadow-[0_0_40px_-12px_rgba(0,124,90,0.15)]"
        )}>
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-2.5 relative z-20 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "size-1.5 rounded-full transition-colors duration-500",
                  phase.lockTarget ? "bg-red-500 animate-pulse" : "bg-primary animate-status"
                )} />
                <CardTitle className="text-[10px] tracking-[0.3em] transition-colors duration-500">
                  {phase.lockTarget ? 'TARGET_LOCK' : 'Geospatial_Feasibility_Feed'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-3 text-[8px] font-mono">
                <span className="text-white/20 uppercase hidden sm:inline">{phase.name}</span>
                {phase.lockTarget && (
                  <span className="text-red-500/60 uppercase tracking-wider hidden sm:inline">
                    {phase.zoom.toFixed(1)}x
                  </span>
                )}
                <span className="text-primary/50">{verifiedCount}/{totalDocs}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden relative">
            {/* Zoom container */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `scale(${phase.zoom})`,
                transformOrigin: `${phase.originX}% ${phase.originY}%`,
                transition: 'transform 2.5s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 2.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-118.2475,34.0495,-118.2395,34.0555&bboxSR=4326&size=1600,800&format=png&f=image"
                alt="Aerial site view"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div
                className="absolute inset-0 bg-[#0A0A0F] mix-blend-multiply transition-opacity duration-1000"
                style={{ opacity: overlayStage >= 1 ? 0.5 : 0.2 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/25 via-transparent to-[#0A0A0F]/35" />

              <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Grid */}
                <g style={{ opacity: overlayStage >= 1 ? 1 : 0, transition: 'opacity 1.2s ease' }}>
                  {Array.from({ length: 21 }).map((_, i) => (
                    <g key={`g-${i}`}>
                      <line x1={i * 40} y1={0} x2={i * 40} y2={400} stroke="rgba(0,124,90,0.08)" strokeWidth="0.5" />
                      <line x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(0,124,90,0.08)" strokeWidth="0.5" />
                    </g>
                  ))}
                </g>

                {/* Subject site targeting */}
                <g style={{ opacity: overlayStage >= 2 ? 1 : 0, transition: 'opacity 1s ease' }}>
                  <rect x={270} y={90} width={140} height={100} rx={3} fill="rgba(0,124,90,0.06)" stroke="rgba(0,124,90,0.45)" strokeWidth="1" />
                  <rect x={280} y={100} width={120} height={80} rx={2} fill="none" stroke="rgba(0,124,90,0.18)" strokeWidth="0.5" strokeDasharray="3 2" />
                  <path d="M 270 102 L 270 90 L 282 90" fill="none" stroke="rgba(0,124,90,0.9)" strokeWidth="1.5" />
                  <path d="M 398 90 L 410 90 L 410 102" fill="none" stroke="rgba(0,124,90,0.9)" strokeWidth="1.5" />
                  <path d="M 270 178 L 270 190 L 282 190" fill="none" stroke="rgba(0,124,90,0.9)" strokeWidth="1.5" />
                  <path d="M 398 190 L 410 190 L 410 178" fill="none" stroke="rgba(0,124,90,0.9)" strokeWidth="1.5" />
                  <line x1={328} y1={140} x2={352} y2={140} stroke="rgba(0,124,90,0.35)" strokeWidth="0.5" />
                  <line x1={340} y1={128} x2={340} y2={152} stroke="rgba(0,124,90,0.35)" strokeWidth="0.5" />
                  <circle cx={340} cy={140} r={15} fill="none" stroke="rgba(0,124,90,0.18)" strokeWidth="0.5" />
                  <circle cx={340} cy={140} r={24} fill="none" stroke="rgba(0,124,90,0.08)" strokeWidth="0.5" strokeDasharray="2 2">
                    <animateTransform attributeName="transform" type="rotate" from="0 340 140" to="360 340 140" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <text x={340} y={126} fill="rgba(0,124,90,0.85)" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SUBJECT SITE</text>
                  <text x={340} y={139} fill="rgba(0,124,90,0.5)" fontSize="6" fontFamily="monospace" textAnchor="middle">APN 0412-031-001</text>
                  <text x={340} y={150} fill="rgba(0,124,90,0.35)" fontSize="5" fontFamily="monospace" textAnchor="middle">{`16,000 sf \u00B7 0.37 ac`}</text>
                  <rect x={270} y={90} width={140} height={100} rx={3} fill="none" stroke="rgba(0,124,90,0.08)" strokeWidth="2">
                    <animate attributeName="stroke-opacity" values="0.08;0.01;0.08" dur="3s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* Parking site + adjacent */}
                <g style={{ opacity: overlayStage >= 3 ? 1 : 0, transition: 'opacity 1s ease' }}>
                  <rect x={440} y={110} width={95} height={75} rx={3} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  <text x={488} y={145} fill="rgba(255,255,255,0.18)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">ADJ. PARCEL</text>
                  <text x={488} y={155} fill="rgba(255,255,255,0.1)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">0412-032</text>
                  <rect x={170} y={220} width={80} height={65} rx={3} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                  <text x={210} y={250} fill="rgba(255,255,255,0.15)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">ADJ. PARCEL</text>
                  <text x={210} y={260} fill="rgba(255,255,255,0.1)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">0413-008</text>
                  <rect x={490} y={240} width={130} height={85} rx={3} fill="rgba(245,158,11,0.03)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.5" strokeDasharray="4 2" />
                  <path d="M 490 252 L 490 240 L 502 240" fill="none" stroke="rgba(245,158,11,0.65)" strokeWidth="1.5" />
                  <path d="M 608 240 L 620 240 L 620 252" fill="none" stroke="rgba(245,158,11,0.65)" strokeWidth="1.5" />
                  <path d="M 490 313 L 490 325 L 502 325" fill="none" stroke="rgba(245,158,11,0.65)" strokeWidth="1.5" />
                  <path d="M 608 325 L 620 325 L 620 313" fill="none" stroke="rgba(245,158,11,0.65)" strokeWidth="1.5" />
                  <line x1={548} y1={282} x2={562} y2={282} stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" />
                  <line x1={555} y1={275} x2={555} y2={289} stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" />
                  <circle cx={555} cy={282} r={12} fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="0.5" strokeDasharray="2 2">
                    <animateTransform attributeName="transform" type="rotate" from="0 555 282" to="-360 555 282" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <text x={555} y={278} fill="rgba(245,158,11,0.4)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">PARKING SITE</text>
                  <text x={555} y={288} fill="rgba(245,158,11,0.25)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">0412-045</text>
                  <circle cx={555} cy={298} r={3} fill="#f59e0b" opacity="0.35" />
                  <circle cx={555} cy={298} r={3} fill="#f59e0b">
                    <animate attributeName="r" values="3;10;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <rect x={110} y={70} width={55} height={45} rx={2} fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
                  <rect x={600} y={55} width={80} height={50} rx={2} fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
                  <rect x={250} y={70} width={200} height={140} fill="none" stroke="rgba(0,124,90,0.2)" strokeWidth="0.75" strokeDasharray="6 3" />
                  <text x={255} y={65} fill="rgba(0,124,90,0.4)" fontSize="6" fontFamily="monospace">ZONE_ALPHA &mdash; CONTROLLED</text>
                </g>

                {/* Scan line */}
                {overlayStage >= 1 && (
                  <line x1={0} y1={0} x2={800} y2={0} stroke="rgba(0,124,90,0.25)" strokeWidth="0.75">
                    <animate attributeName="y1" values="0;400;0" dur="6s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="0;400;0" dur="6s" repeatCount="indefinite" />
                  </line>
                )}
              </svg>
            </div>

            {/* HUD OVERLAYS */}
            <div className="absolute top-2 left-2 z-30 font-mono text-[7px] text-white/20 leading-tight">
              <div>34.0530&deg;N</div>
              <div>-118.2437&deg;W</div>
            </div>

            <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
              <div className={cn(
                "size-1.5 rounded-full transition-colors duration-700",
                phase.lockTarget ? "bg-red-500" : "bg-primary"
              )} />
              <span className={cn(
                "text-[7px] font-mono font-bold uppercase tracking-[0.2em] transition-colors duration-700",
                phase.lockTarget ? "text-red-500/70" : "text-primary/50"
              )}>
                {phase.lockTarget ? 'LOCKED' : 'SCANNING'}
              </span>
            </div>

            {/* KPI bar */}
            <div
              className="absolute top-8 left-2 z-30 bg-black/80 border border-white/[0.04] backdrop-blur-sm rounded px-2 py-1.5 hidden sm:flex items-center gap-3 transition-opacity duration-700"
              style={{ opacity: overlayStage >= 2 ? 1 : 0 }}
            >
              {[
                { label: 'PARCEL', value: '16,000', unit: 'sf', green: false },
                { label: 'BUILDABLE', value: '96,000', unit: 'sf', green: true },
                { label: 'UNITS', value: '142', unit: '', green: false },
                { label: 'PARKING', value: '192', unit: 'req', green: false },
              ].map((kpi, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="w-px h-4 bg-white/[0.04]" />}
                  <div className="text-center">
                    <div className="text-[6px] font-mono text-white/25 tracking-wider">{kpi.label}</div>
                    <div className={cn("text-[11px] font-mono font-bold", kpi.green ? "text-primary" : "text-white/75")}>
                      {kpi.value}
                      {kpi.unit && <span className="text-[6px] font-normal text-white/25 ml-0.5">{kpi.unit}</span>}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Readout: Subject site */}
            <div className={cn(
              "absolute right-2 top-1/4 z-30 transition-all duration-700",
              showAlphaReadout ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            )}>
              <ReadoutPanel lines={ALPHA_LINES} active={showAlphaReadout} color="green" />
            </div>

            {/* Readout: Parking site */}
            <div className={cn(
              "absolute left-2 top-1/4 z-30 transition-all duration-700",
              showBravoReadout ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            )}>
              <ReadoutPanel lines={BRAVO_LINES} active={showBravoReadout} color="amber" />
            </div>

            {/* Center reticle */}
            <div className={cn(
              "absolute inset-0 z-20 pointer-events-none flex items-center justify-center transition-opacity duration-1000",
              phase.lockTarget ? "opacity-100" : "opacity-0"
            )}>
              <div className="relative">
                <div className="absolute -inset-8 border border-primary/12 rounded-full" style={{ animation: 'spin 10s linear infinite' }} />
                <div className="absolute -inset-5 border border-primary/8 rounded-full" style={{ animation: 'spin 10s linear infinite reverse' }} />
                <Target className="size-8 text-primary/15" />
              </div>
            </div>

            {/* Bottom status */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-2 px-3">
              <StatusLine
                text={STATUS_MSGS[phase.name] || ''}
                phaseKey={phaseCounterRef.current}
              />
            </div>
          </CardContent>
        </Card>

        {/* ═══ VAULT TRIGGER — floating HUD button (bottom-right) ═══ */}
        <button
          onClick={toggleVault}
          className={cn(
            "absolute bottom-4 right-4 z-40 group flex items-center gap-2 px-3 py-2 rounded",
            "bg-[#0A0A0F] border transition-all duration-500",
            "hover:scale-[1.02] active:scale-[0.98]",
            vaultOpen
              ? "border-primary/50 shadow-[0_0_25px_-4px_rgba(0,124,90,0.4)]"
              : "border-primary/30 shadow-[0_0_20px_-2px_rgba(0,124,90,0.25),0_0_40px_-4px_rgba(0,124,90,0.15)] hover:shadow-[0_0_30px_-2px_rgba(0,124,90,0.4),0_0_60px_-4px_rgba(0,124,90,0.2)] hover:border-primary/50 animate-[vault-glow_2s_ease-in-out_infinite]"
          )}
        >
          <div className={cn(
            "size-2 rounded-full transition-colors",
            vaultOpen ? "bg-primary animate-pulse" : "bg-primary/80 animate-pulse"
          )} />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-primary">
            Feasibility_Vault
          </span>
          <div className="flex items-center gap-1 ml-1">
            <span className="text-[8px] font-mono text-primary/60">{verifiedCount}/{totalDocs}</span>
            <ChevronUp className={cn(
              "size-3 text-primary/60 transition-transform duration-300",
              vaultOpen && "rotate-180"
            )} />
          </div>
        </button>

        {/* ═══ FEASIBILITY VAULT — HUD Modal (bottom-right popup) ═══ */}
        <div className={cn(
          "absolute bottom-14 right-4 z-50 w-[340px] sm:w-[400px] md:w-[440px]",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "origin-bottom-right",
          vaultOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}>
          {/* Corner brackets — military HUD frame */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary/50" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary/50" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary/50" />

          <Card className={cn(
            "bg-[#0A0A0F] border-primary/20 overflow-hidden flex flex-col max-h-[420px]",
            "shadow-[0_0_60px_-12px_rgba(0,124,90,0.25),0_0_30px_-8px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(0,124,90,0.08)]",
            phase.name === 'COMPLETE' && "border-primary/35 shadow-[0_0_60px_-8px_rgba(0,124,90,0.3)]"
          )}>
            {/* Header */}
            <div className="border-b border-primary/10 bg-[#0A0A0F] py-2 px-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-primary/70">Feasibility_Data_Room</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[7px] font-mono">
                    {counts['VERIFIED'] ? <span className="text-primary">{counts['VERIFIED']} VER</span> : null}
                    {counts['AUDIT'] ? <><span className="text-white/10">|</span><span className="text-yellow-500/70">{counts['AUDIT']} AUD</span></> : null}
                    {counts['PENDING'] ? <><span className="text-white/10">|</span><span className="text-white/25">{counts['PENDING']} PND</span></> : null}
                  </div>
                  <button onClick={toggleVault} className="text-white/20 hover:text-white/50 transition-colors ml-1">
                    <X className="size-3" />
                  </button>
                </div>
              </div>
              {/* Scan line accent */}
              <div className="mt-1.5 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            {/* Document list */}
            <div className="flex-1 overflow-auto no-scrollbar">
              <Table>
                <TableHeader className="bg-[#0A0A0F] sticky top-0 z-10">
                  <TableRow className="border-primary/5 hover:bg-transparent">
                    <TableHead className="text-[8px] font-bold uppercase tracking-widest text-primary/30 py-1.5">Document_ID</TableHead>
                    <TableHead className="text-[8px] font-bold uppercase tracking-widest text-primary/30 hidden sm:table-cell py-1.5">Sector</TableHead>
                    <TableHead className="text-[8px] font-bold uppercase tracking-widest text-primary/30 text-right py-1.5">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DOCS.map((doc, i) => {
                    const status = getDocStatus(doc, elapsed);
                    const isActive = activeDocIndices.includes(i);
                    const isFlashing = flashingRows.has(i);
                    const isHovered = hoveredDoc === i;
                    return (
                      <TableRow
                        key={i}
                        onMouseEnter={() => setHoveredDoc(i)}
                        onMouseLeave={() => setHoveredDoc(null)}
                        className={cn(
                          "border-primary/5 transition-all duration-500 cursor-default",
                          isFlashing && status === 'VERIFIED' && "animate-pulse bg-primary/10",
                          isFlashing && status === 'RECEIVED' && "animate-pulse bg-cyan-400/10",
                          isFlashing && status === 'AUDIT' && "animate-pulse bg-yellow-500/10",
                          !isFlashing && status === 'VERIFIED' && 'bg-primary/[0.04]',
                          !isFlashing && status === 'RECEIVED' && 'bg-cyan-400/[0.04]',
                          !isFlashing && status === 'AUDIT' && 'bg-yellow-500/[0.04]',
                          isActive && !isFlashing && "bg-white/[0.03]",
                          isHovered && "!bg-primary/[0.08]"
                        )}
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "size-1 rounded-full shrink-0 transition-all duration-500",
                              isActive ? "bg-primary animate-pulse" : "bg-transparent"
                            )} />
                            <FileText className={cn(
                              "size-2.5 shrink-0 transition-colors duration-700",
                              status === 'VERIFIED' ? 'text-primary/50' :
                              status === 'RECEIVED' ? 'text-cyan-400/40' :
                              status === 'AUDIT' ? 'text-yellow-500/40' : 'text-white/10'
                            )} />
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-[8px] md:text-[9px] font-mono transition-colors duration-700 leading-tight",
                                status === 'PENDING' ? 'text-white/30' : 'text-white/70',
                                isHovered && 'text-white'
                              )}>{doc.id}</span>
                              <span className="text-[6px] font-mono text-white/15 uppercase tracking-wider sm:hidden mt-0.5">{doc.cat}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className={cn(
                            "text-[7px] font-mono uppercase tracking-wider transition-colors duration-500",
                            isHovered ? "text-white/40" : "text-white/20"
                          )}>{doc.cat}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <StatusBadge status={status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Footer: Progress ring + bar */}
            <div className="shrink-0 border-t border-primary/10 bg-[#0A0A0F] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <ProgressRing progress={cycleProgress} verified={verifiedCount} total={totalDocs} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-mono text-primary/30 uppercase tracking-wider">Scan Cycle</span>
                    <span className="text-[7px] font-mono text-primary/50">{cycleProgress}%</span>
                  </div>
                  <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/40 to-primary/70 rounded-full transition-all duration-300 ease-linear"
                      style={{ width: `${cycleProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={cn(
                      "text-[6px] font-mono uppercase tracking-wider transition-colors duration-500",
                      phase.lockTarget ? "text-red-500/50" : "text-white/15"
                    )}>
                      {phase.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {PHASES.map((p, pi) => (
                        <div key={pi} className={cn(
                          "size-0.5 rounded-full transition-all duration-500",
                          pi === phaseIdx ? (p.lockTarget ? "bg-red-500 scale-150" : "bg-primary scale-150") : "bg-white/10"
                        )} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
