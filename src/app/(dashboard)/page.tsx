'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Database,
  Zap,
  Target,
  Terminal,
  Activity,
  Map as MapIcon,
  Layers,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileSignature,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { TacticalBimOverlay } from "@/components/visualizations/tactical-bim-overlay";
import { IngestionFunnel } from "@/components/visualizations/ingestion-funnel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

function TypewriterUntilNow() {
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const text = "Until now.";

  useEffect(() => {
    const delay = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (charIndex < text.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), 80);
      return () => clearTimeout(t);
    }
  }, [started, charIndex]);

  if (!started) return null;

  return (
    <>
      {' '}
      <span className="text-primary font-bold">
        {text.slice(0, charIndex)}
        {charIndex < text.length && (
          <span className="inline-block w-[2px] h-[1em] bg-primary ml-[1px] align-middle animate-pulse" />
        )}
      </span>
    </>
  );
}

const HERO_LINES = [
  { text: "Where", green: false },
  { text: "Development", green: true },
  { text: "Meets Data", green: false },
];
const TOTAL_TITLE_CHARS = HERO_LINES.reduce((s, l) => s + l.text.length, 0);
const SUBTITLE_WORDS = ["Emails.", "Photos.", "Zooms.", "Inspections.", "RFIs.", "Waivers."];

function HeroSequence() {
  const [headerDone, setHeaderDone] = useState(false);
  const [titleChars, setTitleChars] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [secondLineVisible, setSecondLineVisible] = useState(false);
  const [untilNowReady, setUntilNowReady] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderDone(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Type title characters
  useEffect(() => {
    if (!headerDone) return;
    if (titleChars < TOTAL_TITLE_CHARS) {
      const t = setTimeout(() => setTitleChars(c => c + 1), 55);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setWordIndex(1), 400);
    return () => clearTimeout(t);
  }, [headerDone, titleChars]);

  // Sequential word fade-in
  useEffect(() => {
    if (wordIndex < 1) return;
    if (wordIndex < SUBTITLE_WORDS.length) {
      const t = setTimeout(() => setWordIndex(w => w + 1), 280);
      return () => clearTimeout(t);
    }
    if (wordIndex === SUBTITLE_WORDS.length && !secondLineVisible) {
      const t = setTimeout(() => setSecondLineVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [wordIndex, secondLineVisible]);

  // Start "Until now." typewriter
  useEffect(() => {
    if (!secondLineVisible) return;
    const t = setTimeout(() => setUntilNowReady(true), 800);
    return () => clearTimeout(t);
  }, [secondLineVisible]);

  // Show button after "Until now." finishes
  useEffect(() => {
    if (!untilNowReady) return;
    const t = setTimeout(() => setButtonVisible(true), 1200);
    return () => clearTimeout(t);
  }, [untilNowReady]);

  let rendered = 0;
  const titleContent = HERO_LINES.map((line, i) => {
    const start = rendered;
    rendered += line.text.length;
    const visible = Math.max(0, Math.min(line.text.length, titleChars - start));
    const isCurrent = titleChars >= start && titleChars < start + line.text.length;
    const showCursor = isCurrent && titleChars < TOTAL_TITLE_CHARS;

    return (
      <React.Fragment key={i}>
        {line.green ? (
          <span className="text-primary">{line.text.slice(0, visible)}</span>
        ) : (
          line.text.slice(0, visible)
        )}
        {showCursor && (
          <span className="inline-block w-[3px] h-[0.8em] bg-current ml-0.5 align-middle animate-pulse" />
        )}
        {i < HERO_LINES.length - 1 && <br />}
      </React.Fragment>
    );
  });

  return (
    <>
      <div>
        <h1 className="text-5xl sm:text-7xl md:text-[7.5rem] lg:text-[9.5rem] xl:text-[11rem] font-semibold tracking-[-0.05em] leading-[1.05] max-w-[95%] mb-12 sm:mb-14 md:mb-20 min-h-[3.15em]">
          {titleContent}
        </h1>

        <div className="text-sm sm:text-base md:text-lg text-black/35 max-w-md leading-relaxed font-medium">
          <p className="mb-2">
            {SUBTITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block mr-[0.35em] transition-opacity duration-500",
                  i < wordIndex ? "opacity-100" : "opacity-0"
                )}
              >
                {word}
              </span>
            ))}
          </p>
          <p className={cn(
            "transition-opacity duration-700",
            secondLineVisible ? "opacity-100" : "opacity-0"
          )}>
            A billion fragments of &ldquo;truth&rdquo;, without the full picture.
            {untilNowReady && <TypewriterUntilNow />}
          </p>
        </div>
      </div>

      <div className={cn(
        "flex-1 flex items-center justify-center font-mono transition-opacity duration-500",
        buttonVisible ? "opacity-100" : "opacity-0"
      )}>
        <a href="#ingestion" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 sm:px-10 sm:py-4 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-primary/90 transition-all duration-300">
          INITIALIZE_SYSTEM <ArrowRight className="size-3.5" />
        </a>
      </div>
    </>
  );
}

export default function UnifiedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-scroll to section via query param (for Simulator screenshots)
    const params = new URLSearchParams(window.location.search);
    const section = params.get('s');
    if (section) {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'instant' });
      }, 500);
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }


  return (
    <div
        id="main-scroll-container"
        className="flex flex-col w-full selection:bg-primary/20 font-sans snap-y snap-mandatory overflow-y-auto h-[calc(100vh-64px)] no-scrollbar scroll-smooth"
    >

      {/* SECTION 01: INSTITUTIONAL HERO (WHITE) */}
      <section id="hero" className="snap-start relative flex flex-col bg-white text-black h-[calc(100vh-64px)] w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 w-full h-full flex flex-col px-6 sm:px-12 md:px-20 lg:px-28 pt-[12vh] sm:pt-[14vh] md:pt-[16vh]">
          <HeroSequence />
        </div>
      </section>

      {/* SECTION 02: INGESTION PIPELINE (OBSIDIAN) - CHAOS TO CONTROL */}
      <section id="ingestion" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl h-full flex flex-col justify-between py-6 md:py-12 gap-4 md:gap-8">

              <div className="space-y-2 sm:space-y-4 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Database className="size-3 sm:size-4 text-primary" />
                      <h2 className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/40">02_Data_Ingestion_Pipeline</h2>
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">From Chaos to Control.</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-medium">
                      From juggling dozens of consultants or being cc&apos;ed on a thousand emails, Envision OS consumes all the noise and delivers <span className="text-white font-bold">data-driven clarity</span>.
                  </p>
              </div>

              <div className="relative w-full flex-1 min-h-0">
                  <IngestionFunnel />
              </div>
          </div>
      </section>

      {/* SECTION 03: INTELLIGENCE COMMAND (WHITE) */}
      <section id="intel" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white text-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3 md:mb-6 shrink-0">
                <Terminal className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40">03_Intelligence_Terminal_Core</h2>
            </div>

            <div className="mb-4 md:mb-8 shrink-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Intelligence Command.</h2>
              <p className="text-black/60 max-w-xl text-base sm:text-lg font-medium mt-2 md:mt-4">Verified institutional oracle. Direct access to cross-platform project truth.</p>
            </div>

            <Card className="bg-white border-black/5 shadow-2xl flex-1 flex flex-col overflow-hidden rounded-none">
                <CardHeader className="border-b border-black/5 bg-gray-50/50 py-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Secure_Command_Interface</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-status" />
                            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Signal_Nominal</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden relative">
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
      </section>

      {/* SECTION 04: CONTEXT FUSION (OBSIDIAN) */}
      <section id="fusion" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3 md:mb-6 shrink-0">
                  <Zap className="size-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">04_Context_Fusion_Engine</h2>
              </div>
              <ContextSummarizer />
          </div>
      </section>

      {/* SECTION 05: BIM + TELEMETRY (OBSIDIAN) */}
      <section id="tactical-bim" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:gap-6 overflow-hidden">
            <div className="lg:col-span-2 flex flex-col flex-1 lg:h-full min-h-0">
                <div className="flex items-center gap-3 mb-2 lg:mb-4 shrink-0">
                    <Layers className="size-4 text-primary" />
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">05_Tactical_Lidar_Bim</h2>
                </div>
                <div className="flex-1 overflow-hidden min-h-[200px] sm:min-h-[250px]">
                    <TacticalBimOverlay />
                </div>
            </div>
            <div className="flex flex-col gap-2 lg:gap-6 lg:h-full min-h-0">
                <div className="flex items-center gap-3 shrink-0">
                    <Activity className="size-4 text-primary" />
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Realtime_Telemetry</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-4 flex-1 overflow-auto no-scrollbar">
                    {[
                    { label: 'BUDGET_TRACKED', value: '$2.3B', icon: Activity },
                    { label: 'VARIANCE_DELTA', value: '-1.2%', icon: Zap, color: 'text-primary' },
                    ].map((metric, i) => (
                    <Card key={i} className="bg-[#12121A] border-[#1E1E2E] hover:border-primary/40 transition-colors">
                        <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col gap-1 lg:gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{metric.label}</span>
                            <metric.icon className="size-3 text-primary/40" />
                        </div>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold tracking-tighter mt-1 lg:mt-2 text-white">
                            {metric.value}
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 06: SITE + DOCUMENTS (OBSIDIAN) */}
      <section id="site-docs" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-4 md:gap-8 overflow-hidden">
            <div className="flex items-center gap-3 shrink-0">
                <MapIcon className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">06_Site_Doc_Repository</h2>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col gap-3 md:gap-6">
                {/* GEOSPATIAL TACTICAL MAP */}
                <Card className="bg-[#12121A] border-[#1E1E2E] relative overflow-hidden flex-1 min-h-0 md:min-h-[250px]">
                    <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 relative z-20 shrink-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] tracking-[0.3em]">Geospatial_Intel_Feed</CardTitle>
                            <span className="text-[8px] font-mono text-primary uppercase hidden sm:inline">LAT: 34.0522° N | LONG: -118.2437° W</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative h-full overflow-hidden">
                      <div className="absolute inset-0 animate-geo-zoom">
                        {/* Satellite imagery background (ESRI World Imagery — downtown LA construction corridor) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-118.2475,34.0495,-118.2395,34.0555&bboxSR=4326&size=1600,800&format=png&f=image"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                        {/* Dark tactical tint */}
                        <div className="absolute inset-0 bg-[#0A0A0F]/60 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/40 via-transparent to-[#0A0A0F]/50" />

                        {/* Tactical SVG overlay */}
                        <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                            {/* Grid overlay */}
                            {Array.from({length: 21}).map((_, i) => (
                              <g key={`g-${i}`}>
                                <line x1={i * 40} y1={0} x2={i * 40} y2={400} stroke="rgba(0,124,90,0.12)" strokeWidth="0.5" />
                                <line x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(0,124,90,0.12)" strokeWidth="0.5" />
                              </g>
                            ))}

                            {/* Building footprints with zoning/setback/code restrictions */}
                            <rect x={280} y={100} width={120} height={80} fill="rgba(0,124,90,0.2)" stroke="rgba(0,124,90,0.7)" strokeWidth="1.5" />
                            <text x={340} y={128} fill="rgba(0,124,90,1)" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PHOENIX_A</text>
                            <text x={340} y={139} fill="rgba(0,124,90,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">ACTIVE SITE</text>
                            {/* Setback lines — dashed inner boundary */}
                            <rect x={275} y={95} width={130} height={90} fill="none" stroke="rgba(0,124,90,0.25)" strokeWidth="0.5" strokeDasharray="2 2" />
                            {/* Zoning/code restrictions — PHOENIX_A */}
                            <rect x={278} y={188} width={175} height={38} fill="rgba(0,0,0,0.75)" stroke="rgba(0,124,90,0.4)" strokeWidth="0.5" />
                            <line x1={278} y1={188} x2={283} y2={188} stroke="rgba(0,124,90,0.8)" strokeWidth="1.5" />
                            <text x={283} y={198} fill="rgba(0,124,90,0.95)" fontSize="5.5" fontFamily="monospace">$ zone --parcel 0412-031</text>
                            <text x={283} y={206} fill="rgba(0,124,90,0.7)" fontSize="5" fontFamily="monospace">ZONE: C2-2D-O | FAR: 6:1 | HT_MAX: 395ft</text>
                            <text x={283} y={213} fill="rgba(0,124,90,0.7)" fontSize="5" fontFamily="monospace">SETBACK: F=10ft S=6ft R=15ft | LOT_COV: 75%</text>
                            <text x={283} y={220} fill="rgba(0,124,90,0.55)" fontSize="5" fontFamily="monospace">SEISMIC: D | FIRE: TYPE_IA | OCC: B/R-2</text>

                            <rect x={450} y={120} width={80} height={60} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={490} y={148} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">BLDG_B</text>
                            {/* Zoning/code restrictions — BLDG_B */}
                            <rect x={448} y={182} width={148} height={30} fill="rgba(0,0,0,0.75)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                            <line x1={448} y1={182} x2={453} y2={182} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                            <text x={453} y={192} fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="monospace">$ zone --parcel 0412-032</text>
                            <text x={453} y={199} fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">ZONE: C2-2D-O | FAR: 3:1 | HT_MAX: 75ft</text>
                            <text x={453} y={206} fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">SETBACK: F=5ft S=0ft R=10ft</text>

                            <rect x={180} y={230} width={100} height={70} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={230} y={260} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">WAREHOUSE</text>
                            {/* Zoning/code restrictions — WAREHOUSE */}
                            <rect x={178} y={302} width={148} height={30} fill="rgba(0,0,0,0.75)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                            <line x1={178} y1={302} x2={183} y2={302} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                            <text x={183} y={312} fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="monospace">$ zone --parcel 0413-008</text>
                            <text x={183} y={319} fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">ZONE: M2-1 | FAR: 1.5:1 | HT_MAX: 45ft</text>
                            <text x={183} y={326} fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">SETBACK: F=0ft S=0ft R=0ft | IND_USE</text>

                            <rect x={500} y={250} width={140} height={90} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={570} y={288} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">PARKING_STR</text>
                            {/* Zoning/code restrictions — PARKING_STR (flagged) */}
                            <rect x={498} y={342} width={175} height={38} fill="rgba(0,0,0,0.75)" stroke="rgba(245,158,11,0.35)" strokeWidth="0.5" />
                            <line x1={498} y1={342} x2={503} y2={342} stroke="rgba(245,158,11,0.8)" strokeWidth="1.5" />
                            <text x={503} y={352} fill="rgba(245,158,11,0.85)" fontSize="5" fontFamily="monospace">$ zone --parcel 0412-045 --flags</text>
                            <text x={503} y={359} fill="rgba(245,158,11,0.6)" fontSize="5" fontFamily="monospace">ZONE: C2-2D-O | FAR: 6:1 | HT_MAX: 395ft</text>
                            <text x={503} y={366} fill="rgba(245,158,11,0.6)" fontSize="5" fontFamily="monospace">SETBACK: F=10ft | ⚠ VARIANCE_REQ: SIDE=0ft</text>
                            <text x={503} y={373} fill="rgba(245,158,11,0.45)" fontSize="5" fontFamily="monospace">CODE_FLAG: PARKING_RATIO_DEFICIT -12%</text>

                            <rect x={120} y={80} width={60} height={50} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <rect x={600} y={60} width={90} height={55} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                            <rect x={650} y={280} width={70} height={50} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                            {/* Active site pulsing marker */}
                            <circle cx={340} cy={140} r={25} fill="none" stroke="rgba(0,124,90,0.5)" strokeWidth="1.5">
                              <animate attributeName="r" values="25;45;25" dur="3s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.5;0.05;0.5" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={340} cy={140} r={15} fill="none" stroke="rgba(0,124,90,0.3)" strokeWidth="0.5">
                              <animate attributeName="r" values="15;35;15" dur="3s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={340} cy={140} r={5} fill="rgba(0,124,90,1)" />
                            <circle cx={340} cy={140} r={8} fill="none" stroke="rgba(0,124,90,0.8)" strokeWidth="1" />

                            {/* Secondary markers */}
                            <circle cx={490} cy={150} r={3} fill="rgba(255,255,255,0.4)" />
                            <circle cx={230} cy={265} r={3} fill="rgba(255,255,255,0.4)" />
                            <circle cx={570} cy={295} r={4} fill="rgba(245,158,11,0.7)" />
                            <circle cx={570} cy={295} r={8} fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" strokeDasharray="3 2" />

                            {/* Zone boundary */}
                            <rect x={250} y={70} width={200} height={140} fill="none" stroke="rgba(0,124,90,0.35)" strokeWidth="1" strokeDasharray="6 3" />
                            <text x={255} y={63} fill="rgba(0,124,90,0.6)" fontSize="7" fontFamily="monospace">ZONE_ALPHA — CONTROLLED ACCESS</text>

                            {/* Coordinates */}
                            <text x={12} y={15} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">34.0530°N</text>
                            <text x={12} y={395} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">34.0510°N</text>
                            <text x={700} y={15} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">-118.2420°W</text>
                            <text x={700} y={395} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">-118.2450°W</text>

                            {/* Scan line */}
                            <line x1={0} y1={0} x2={800} y2={0} stroke="rgba(0,124,90,0.4)" strokeWidth="1">
                              <animate attributeName="y1" values="0;400;0" dur="8s" repeatCount="indefinite" />
                              <animate attributeName="y2" values="0;400;0" dur="8s" repeatCount="indefinite" />
                            </line>
                        </svg>
                      </div>

                        <div className="absolute inset-0 tactical-grid opacity-[0.06] pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <Target className="size-8 text-primary/30" />
                        </div>
                    </CardContent>
                </Card>

                {/* DOCUMENTS TABLE */}
                <Card className="bg-[#12121A] border-[#1E1E2E] overflow-hidden flex-1 min-h-0 md:min-h-[250px] flex flex-col">
                    <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 shrink-0">
                        <CardTitle className="text-[10px] tracking-[0.3em]">Document_Intel_Vault</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto no-scrollbar">
                        <Table>
                            <TableHeader className="bg-[#0A0A0F] sticky top-0 z-10">
                                <TableRow className="border-[#1E1E2E] hover:bg-transparent">
                                    <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Document_ID</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                    <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-right">Last_Sync</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                { id: 'RFI_9912_STRUCTURAL', status: 'VERIFIED', sync: '14:22:01' },
                                { id: 'BIM_MODEL_V4_LOD400', status: 'ACTIVE', sync: '12:05:44' },
                                { id: 'SPEC_08_GLASS_V2', status: 'AUDIT', sync: '09:15:22' },
                                { id: 'SITE_REPORT_W24', status: 'VERIFIED', sync: 'Yesterday' },
                                { id: 'AS_BUILT_ELECTRICAL', status: 'PENDING', sync: '2 Days Ago' },
                                { id: 'STEEL_CERT_202', status: 'VERIFIED', sync: '3 Days Ago' },
                                ].map((doc, i) => (
                                <TableRow key={i} className="border-[#1E1E2E] hover:bg-white/5 transition-colors cursor-pointer group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="size-3 text-primary/40 group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] font-mono text-white/90 font-bold uppercase">{doc.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "size-1 rounded-full",
                                                doc.status === 'VERIFIED' ? 'bg-primary' : doc.status === 'AUDIT' ? 'bg-yellow-500' : 'bg-muted-foreground'
                                            )} />
                                            <span className="text-[10px] md:text-[8px] font-bold uppercase tracking-widest text-white/70">{doc.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-[9px] font-mono text-muted-foreground uppercase">{doc.sync}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

    </div>
  );
}
