'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Target, X, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function FeasibilitySection() {
  const [elapsed, setElapsed] = useState(0);
  const [vaultOpen, setVaultOpen] = useState(false);
  const startRef = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseCounterRef = useRef(0);
  const prevPhaseRef = useRef(-1);

  const toggleVault = useCallback(() => setVaultOpen(prev => !prev), []);

  // Auto-open vault 3s after section scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVaultOpen(true), 3000);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = setInterval(() => {
      setElapsed((Date.now() - startRef.current) % TOTAL_CYCLE);
    }, 50);
    return () => clearInterval(tick);
  }, []);

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
  const cycleProgress = Math.round((elapsed / TOTAL_CYCLE) * 100);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col gap-1 min-h-0">
      {/* ═══ MAIN LAYOUT: Full-width Map + Floating Vault ═══ */}
      <div className="flex-1 overflow-hidden flex flex-col relative min-h-0">

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
                src="/satellite-la.png"
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
            "absolute bottom-10 right-4 z-40 group flex items-center gap-2 px-3 py-2 rounded",
            "bg-black/40 backdrop-blur-sm border transition-all duration-500",
            "hover:scale-[1.02] active:scale-[0.98]",
            vaultOpen
              ? "border-cyan-400/50 shadow-[0_0_25px_-4px_rgba(34,211,238,0.3)]"
              : "border-cyan-400/30 shadow-[0_0_20px_-2px_rgba(34,211,238,0.2),0_0_40px_-4px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_-2px_rgba(34,211,238,0.35),0_0_60px_-4px_rgba(34,211,238,0.15)] hover:border-cyan-400/50 animate-[vault-glow-teal_2s_ease-in-out_infinite]"
          )}
        >
          <div className={cn(
            "size-2 rounded-full transition-colors",
            vaultOpen ? "bg-cyan-400 animate-pulse" : "bg-cyan-400/80 animate-pulse"
          )} />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-400">
            Feasibility_Vault
          </span>
          <div className="flex items-center gap-1 ml-1">
            <span className="text-[8px] font-mono text-cyan-400/60">{verifiedCount}/{totalDocs}</span>
            <ChevronUp className={cn(
              "size-3 text-cyan-400/60 transition-transform duration-300",
              vaultOpen && "rotate-180"
            )} />
          </div>
        </button>

        {/* ═══ FEASIBILITY VAULT — Compact HUD (bottom-right, one doc at a time) ═══ */}
        <div className={cn(
          "absolute bottom-20 right-4 z-50 w-[320px] sm:w-[380px]",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "origin-bottom-right",
          vaultOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}>
          {/* Corner brackets — military HUD frame */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-primary/60" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-primary/60" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-primary/60" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-primary/60" />

          <div className={cn(
            "bg-black/40 backdrop-blur-sm border border-primary/20 overflow-hidden",
            "shadow-[0_0_30px_-8px_rgba(0,124,90,0.15)]"
          )}>
            {/* Header bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/50">Data_Room</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-white/30">{verifiedCount}/{totalDocs}</span>
                <button onClick={toggleVault} className="text-white/20 hover:text-white/40 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            </div>

            {/* Single document display — cycles through docs */}
            {(() => {
              const currentDocIdx = Math.floor(elapsed / 2500) % DOCS.length;
              const doc = DOCS[currentDocIdx];
              const status = getDocStatus(doc, elapsed);
              const statusColor = status === 'VERIFIED' ? 'text-green-400' :
                status === 'RECEIVED' ? 'text-white' :
                status === 'AUDIT' ? 'text-yellow-400' : 'text-white/30';
              const statusBg = status === 'VERIFIED' ? 'bg-green-400/15 border-green-400/30' :
                status === 'RECEIVED' ? 'bg-white/10 border-white/20' :
                status === 'AUDIT' ? 'bg-yellow-400/15 border-yellow-400/30' : 'bg-white/[0.03] border-white/10';
              const iconColor = status === 'VERIFIED' ? 'text-green-400' :
                status === 'RECEIVED' ? 'text-white/60' :
                status === 'AUDIT' ? 'text-yellow-400' : 'text-white/20';

              return (
                <div className="px-3 py-2" key={currentDocIdx}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className={cn("size-3.5 shrink-0", iconColor)} />
                      <span className="text-[10px] font-mono font-bold text-white/85 leading-tight truncate">{doc.id}</span>
                    </div>
                    <div className={cn("px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-wider shrink-0 ml-2", statusBg, statusColor)}>
                      {status}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
