'use client';

import React, { useState, useEffect } from 'react';
import {
  Crosshair,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

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

  // Document cards for the ingestion funnel — scattered on the left, flying into parser
  const docCards = [
    { label: "DOC", rotate: -15, top: "10%", left: "2%", smLeft: "5%", delay: "0s" },
    { label: "PDF", rotate: -20, top: "40%", left: "0%", smLeft: "2%", delay: "-3s" },
    { label: "EMAIL", rotate: 8, top: "55%", left: "8%", smLeft: "12%", delay: "-2s" },
    { label: "XLS", rotate: 18, top: "5%", left: "12%", smLeft: "15%", delay: "-5s" },
    { label: "CALL", rotate: -5, top: "30%", left: "15%", smLeft: "20%", delay: "-4s" },
    { label: "TEXT", rotate: 12, top: "75%", left: "5%", smLeft: "10%", delay: "-1s" },
  ];

  return (
    <div
        id="main-scroll-container"
        className="flex flex-col w-full selection:bg-primary/20 font-sans snap-y snap-mandatory overflow-y-auto h-[calc(100vh-64px)] no-scrollbar scroll-smooth"
    >

      {/* SECTION 01: INSTITUTIONAL HERO (WHITE) */}
      <section id="hero" className="snap-start relative flex flex-col items-center justify-center p-4 sm:p-6 bg-white text-black h-[calc(100vh-64px)] w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 max-w-6xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-bold uppercase tracking-[0.4em] text-primary mb-6 md:mb-12">
                <Crosshair className="size-3" />
                <span>Institutional Intel System v4.0</span>
            </div>

            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 md:mb-16">
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-semibold tracking-tighter leading-none">
                    Where <br/>
                    <span className="text-primary">Development</span> <br/>
                    Meets Data
                </h1>
            </div>

            <p className="text-sm sm:text-base md:text-xl text-black/60 max-w-2xl mb-6 sm:mb-8 md:mb-16 leading-relaxed font-medium">
                One platform. Every signal. From RFIs to financials, Envision fuses your scattered project data into a <span className="text-black font-bold uppercase">single source of truth</span> — so nothing falls through the cracks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono">
                <a href="#ingestion" className="bg-primary text-white px-6 py-3 sm:px-10 sm:py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3 rounded-none shadow-[4px_4px_0px_rgba(0,124,90,0.2)]">
                    INITIALIZE_SYSTEM <ArrowRight className="size-4" />
                </a>
            </div>
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
                  <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tighter leading-tight">Chaos to Control.</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-medium">
                      Slamming fragmented construction signals into a verified institutional stream. Deterministic parsing for weapons-grade project accuracy.
                  </p>
              </div>

              <div className="relative w-full flex-1 flex items-center bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">

                  {/* FLOATING DOCUMENT CARDS — LEFT SIDE */}
                  {docCards.map((card, i) => (
                    <div
                      key={i}
                      className="absolute animate-float-doc"
                      style={{
                        top: card.top,
                        left: card.left,
                        animationDelay: card.delay,
                      }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-2xl p-2.5 sm:p-3 md:p-4 w-14 sm:w-20 md:w-28"
                        style={{ transform: `rotate(${card.rotate}deg)` }}
                      >
                        <div className="flex flex-col gap-1 mb-1.5 sm:mb-2">
                          <div className="w-full h-[3px] sm:h-1 bg-gray-200 rounded" />
                          <div className="w-3/4 h-[3px] sm:h-1 bg-gray-200 rounded" />
                          <div className="w-full h-[3px] sm:h-1 bg-gray-100 rounded" />
                        </div>
                        <span className="block text-center text-[7px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                      </div>
                    </div>
                  ))}

                  {/* AUDIT CORE — CENTER (ROUNDED RECTANGLE WITH INDIGO GLOW) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-32 sm:w-44 md:w-56 lg:w-64 h-36 sm:h-48 md:h-56 lg:h-64 rounded-3xl bg-[#0A0A14] border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center overflow-hidden">
                      {/* Horizontal scan line */}
                      <div className="absolute inset-x-0 h-[2px] bg-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-scan-line" />
                      <span className="text-3xl sm:text-4xl md:text-5xl font-mono text-indigo-300/50 mb-2 sm:mb-3">&#123; &#125;</span>
                      <span className="text-[9px] sm:text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] text-white/80">Audit Core</span>
                    </div>
                  </div>

                  {/* VERIFIED JSON OUTPUT — RIGHT SIDE */}
                  <div className="absolute right-[3%] sm:right-[5%] md:right-[8%] top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-lg animate-float-doc" style={{ animationDelay: '-1s' }}>
                      <pre className="text-[7px] sm:text-[9px] md:text-[11px] font-mono text-primary leading-relaxed whitespace-pre">{`{ "permit": "F1",\n  "status": "PASS" }`}</pre>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-lg opacity-50 translate-x-2 animate-float-doc" style={{ animationDelay: '-3s' }}>
                      <pre className="text-[7px] sm:text-[9px] md:text-[11px] font-mono text-primary leading-relaxed whitespace-pre">{`{ "rfi": "042",\n  "stage": "DRAFT" }`}</pre>
                    </div>
                  </div>

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
                    { label: 'TOTAL_PROJECTS', value: '47', icon: Target },
                    { label: 'ACTIVE_SITES', value: '12', icon: MapIcon },
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

                            {/* Building footprints */}
                            <rect x={280} y={100} width={120} height={80} fill="rgba(0,124,90,0.2)" stroke="rgba(0,124,90,0.7)" strokeWidth="1.5" />
                            <text x={340} y={132} fill="rgba(0,124,90,1)" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PHOENIX_A</text>
                            <text x={340} y={145} fill="rgba(0,124,90,0.7)" fontSize="6" fontFamily="monospace" textAnchor="middle">ACTIVE SITE</text>

                            <rect x={450} y={120} width={80} height={60} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={490} y={155} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">BLDG_B</text>

                            <rect x={180} y={230} width={100} height={70} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={230} y={270} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">WAREHOUSE</text>

                            <rect x={500} y={250} width={140} height={90} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                            <text x={570} y={300} fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" textAnchor="middle">PARKING_STR</text>

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
