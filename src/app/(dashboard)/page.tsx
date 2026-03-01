
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  ArrowRight, 
  Database, 
  Cpu, 
  Target,
  Terminal,
  Activity,
  Map as MapIcon,
  Zap,
  Circle,
  Crosshair as CrosshairIcon,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { PdfExtractor } from "@/components/ingestion/pdf-extractor";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { TacticalBimOverlay } from "@/components/visualizations/tactical-bim-overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UnifiedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex flex-col w-full selection:bg-primary/20 font-sans snap-y snap-mandatory overflow-y-auto h-[calc(100vh-64px)] no-scrollbar scroll-smooth">
      
      {/* SECTION 01: INSTITUTIONAL HERO (WHITE) */}
      <section id="hero" className="snap-start relative flex flex-col items-center justify-center p-6 bg-white text-black overflow-hidden min-h-screen w-full">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ 
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative z-10 max-w-6xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-bold uppercase tracking-[0.4em] text-primary mb-12">
                <Crosshair className="size-3" />
                <span>Institutional Intel System v4.0</span>
            </div>
            
            <div className="space-y-4 mb-16">
                <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-none">
                    Where <br/>
                    <span className="text-primary font-semibold">Development</span> <br/>
                    Meets Data
                </h1>
            </div>

            <p className="text-lg md:text-xl text-black/60 max-w-2xl mb-16 leading-relaxed font-medium">
                Sovereign project orchestration. Eliminating fragmented noise with <span className="text-black font-bold uppercase">weapons-grade accuracy</span> and verified multi-platform data fusion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono">
                <a href="#metrics" className="bg-primary text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3 rounded-none">
                    ACCESS_GATEWAY <ArrowRight className="size-4" />
                </a>
                <button className="px-10 py-4 text-[11px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all bg-transparent rounded-none">
                    SYSTEM_AUDIT
                </button>
            </div>
        </div>
      </section>

      {/* SECTION 02: TELEMETRY METRICS (OBSIDIAN) */}
      <section id="metrics" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
                <Activity className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">01_REALTIME_TELEMETRY</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                { label: 'TOTAL_PROJECTS', value: '47', icon: Target },
                { label: 'ACTIVE_SITES', value: '12', icon: MapIcon },
                { label: 'BUDGET_TRACKED', value: '$2.3B', icon: Activity },
                { label: 'VARIANCE_DELTA', value: '-1.2%', icon: Zap, color: 'text-primary' },
                ].map((metric, i) => (
                <Card key={i} className="bg-[#12121A] border-[#1E1E2E] hover:border-primary/40 transition-colors">
                    <CardContent className="p-8 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{metric.label}</span>
                        <metric.icon className="size-3 text-primary/40" />
                    </div>
                    <div className="text-4xl font-mono font-bold tracking-tighter mt-4 text-white">
                        {metric.value}
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 03: INTEL CORE (OBSIDIAN) */}
      <section id="intel" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <Terminal className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">02_INTEL_TERMINAL_CORE</h2>
            </div>
            <Card className="bg-[#12121A] border-[#1E1E2E] h-[70vh] flex flex-col overflow-hidden">
                <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] tracking-[0.3em]">SECURE_COMMAND_INTERFACE</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-status" />
                            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Node_Stable</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden relative">
                    <ChatInterface />
                </CardContent>
            </Card>
        </div>
      </section>

      {/* SECTION 04: TACTICAL BIM OVERLAY (OBSIDIAN) */}
      <section id="tactical-bim" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <Layers className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">03_TACTICAL_LIDAR_BIM</h2>
            </div>
            <TacticalBimOverlay />
        </div>
      </section>

      {/* SECTION 05: DATA INGESTION (OBSIDIAN) */}
      <section id="ingestion" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl flex flex-col">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                  <Database className="size-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">04_DATA_INGESTION_PIPELINE</h2>
              </div>
              <Card className="bg-[#12121A] border-[#1E1E2E]">
                  <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-6">
                      <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                              <CardTitle className="text-[14px] tracking-[0.3em]">FROM CHAOS TO CONTROL</CardTitle>
                              <CardDescription className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Deterministic Signal Ingest</CardDescription>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground uppercase">Buffer: 99.8%</span>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8 md:p-12">
                      <PdfExtractor />
                  </CardContent>
              </Card>
          </div>
      </section>

      {/* SECTION 06: CONTEXT FUSION (OBSIDIAN) */}
      <section id="fusion" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl flex flex-col">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                  <Zap className="size-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">05_CONTEXT_FUSION_ENGINE</h2>
              </div>
              <Card className="bg-[#12121A] border-[#1E1E2E]">
                  <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-6">
                      <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                              <CardTitle className="text-[14px] tracking-[0.3em]">CONTEXT IS EVERYTHING</CardTitle>
                              <CardDescription className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Multi-Platform Correlation</CardDescription>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground uppercase">Correlation: 0.94 Sigma</span>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8 md:p-12">
                      <ContextSummarizer />
                  </CardContent>
              </Card>
          </div>
      </section>
    </div>
  );
}
