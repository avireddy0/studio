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
import { FeasibilitySection } from "@/components/sections/feasibility-section";
import { PredictSection } from "@/components/sections/predict-section";
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
            "transition-opacity duration-700 mb-2",
            secondLineVisible ? "opacity-100" : "opacity-0"
          )}>
            A billion fragments of &ldquo;truth&rdquo;, without the full picture.
          </p>
          {untilNowReady && (
            <p className="transition-opacity duration-700">
              <TypewriterUntilNow />
            </p>
          )}
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
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Command Central.</h2>
              <p className="text-black/60 max-w-xl text-base sm:text-lg font-medium mt-2 md:mt-4">Welcome to the future of Development.</p>
            </div>

            <Card className="bg-white border-black/5 shadow-2xl flex-1 flex flex-col overflow-hidden rounded-none">
                <CardHeader className="border-b border-black/5 bg-gray-50/50 py-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] tracking-[0.3em] text-black/60">Secure_Command_Interface</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-status" />
                            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Live</span>
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
      <section id="fusion" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
          <div className="relative z-10 w-full max-w-7xl flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3 md:mb-6 shrink-0">
                  <Zap className="size-4 text-[#007C5A]" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400">04_Context_Fusion_Engine</h2>
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

      {/* SECTION 06: PREDICTIVE INTELLIGENCE (WHITE) */}
      <section id="predict" className="snap-start relative h-[calc(100vh-64px)] w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.02] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-4 md:gap-8 overflow-hidden">
          <PredictSection />
        </div>
      </section>

      {/* SECTION 07: SITE + DOCUMENTS (OBSIDIAN) */}
      <section id="site-docs" className="snap-start relative h-[calc(100vh-64px)] w-full bg-[#0A0A0F] text-white flex flex-col items-center p-4 sm:p-6 md:p-12 shrink-0 overflow-hidden">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-4 md:gap-8 overflow-hidden">
            <FeasibilitySection />
        </div>
      </section>

    </div>
  );
}
