
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Target, 
  Database, 
  Zap, 
  Map as MapIcon, 
  Circle,
  Terminal,
  Crosshair,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { PdfExtractor } from "@/components/ingestion/pdf-extractor";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#0A0A0F] min-h-screen relative selection:bg-primary/30">
      {/* TACTICAL HUD OVERLAY */}
      <div className="fixed inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
      
      {/* ANCHOR NAV (INTERNAL SUB-NAV) */}
      <div className="sticky top-16 z-40 bg-[#12121A]/90 backdrop-blur-md border-b border-[#1E1E2E] px-6 py-2 overflow-x-auto no-scrollbar hidden md:block">
        <div className="flex items-center gap-8 min-w-max">
            {[
                { id: 'metrics', label: '01_METRICS' },
                { id: 'intel', label: '02_INTEL_CORE' },
                { id: 'risk', label: '03_RISK_GEOSPATIAL' },
                { id: 'ingestion', label: '04_INGESTION' },
                { id: 'fusion', label: '05_FUSION' },
                { id: 'initialize', label: '06_COMMAND' },
            ].map((link) => (
                <a 
                    key={link.id} 
                    href={`#${link.id}`}
                    className="text-[9px] font-mono font-bold tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors uppercase"
                >
                    {link.label}
                </a>
            ))}
        </div>
      </div>

      <div className="relative z-10 space-y-12 p-6 md:p-12 max-w-7xl mx-auto">
        
        {/* SECTION: METRICS */}
        <section id="metrics" className="scroll-mt-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                { label: 'TOTAL_PROJECTS', value: '47', icon: Target },
                { label: 'ACTIVE_SITES', value: '12', icon: MapIcon },
                { label: 'BUDGET_TRACKED', value: '$2.3B', icon: Activity },
                { label: 'VARIANCE_DELTA', value: '-1.2%', icon: Zap, color: 'text-primary' },
                ].map((metric, i) => (
                <Card key={i} className="bg-[#12121A] border-[#1E1E2E] hover:border-primary/40 transition-colors">
                    <CardContent className="p-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{metric.label}</span>
                        <metric.icon className="size-3 text-primary/40" />
                    </div>
                    <div className="text-3xl font-mono font-bold tracking-tighter mt-2 text-white">
                        {metric.value}
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
        </section>

        {/* SECTION: INTEL TERMINAL */}
        <section id="intel" className="scroll-mt-32 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <Terminal className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">02_INTEL_TERMINAL_CORE</h2>
            </div>
            <Card className="bg-[#12121A] border-[#1E1E2E] min-h-[600px] flex flex-col">
                <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] tracking-[0.3em]">SECURE_COMMAND_INTERFACE</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-status" />
                            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">Node_Stable</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden relative min-h-[500px]">
                    <ChatInterface />
                </CardContent>
            </Card>
        </section>

        {/* SECTION: RISK & GEOSPATIAL */}
        <section id="risk" className="scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#12121A] border-[#1E1E2E]">
                    <CardHeader className="border-b border-[#1E1E2E]/50 py-3">
                        <CardTitle className="text-[10px] tracking-[0.3em]">PROJECT_RISK_MATRIX</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-8">
                        {[
                            { name: 'PROJECT_PHOENIX', risk: 'LOW', color: 'bg-primary' },
                            { name: 'APOLLO_COMPLEX', risk: 'MED', color: 'bg-yellow-500' },
                            { name: 'TITAN_SITE_B', risk: 'HIGH', color: 'bg-destructive' },
                            { name: 'ORION_OFFICE', risk: 'LOW', color: 'bg-primary' },
                        ].map((site, i) => (
                            <div key={i} className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold tracking-widest text-white/90 uppercase">{site.name}</span>
                                <span className="text-[9px] font-mono text-muted-foreground uppercase">Threat_Level: {site.risk}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="h-1 w-32 bg-secondary overflow-hidden">
                                    <div className={cn("h-full animate-pulse", site.color)} style={{ width: site.risk === 'HIGH' ? '90%' : site.risk === 'MED' ? '50%' : '20%' }} />
                                </div>
                                <Circle className={cn("size-2 fill-current", site.color.replace('bg-', 'text-'))} />
                            </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#12121A] border-[#1E1E2E]">
                    <CardHeader className="border-b border-[#1E1E2E]/50 py-3">
                        <CardTitle className="text-[10px] tracking-[0.3em]">GEOSPATIAL_STATUS</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[300px] relative overflow-hidden">
                        <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />
                        <div className="relative">
                            <MapIcon className="size-16 text-primary/10" />
                            <Crosshair className="size-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <p className="text-[12px] font-mono text-primary uppercase tracking-[0.3em]">LAT_SCAN_LOCKED</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">34.0522 N / 118.2437 W</p>
                        </div>
                        <div className="flex gap-4 text-[8px] font-mono text-muted-foreground uppercase mt-4">
                            <span>SATELLITE: NAVSTAR-G1</span>
                            <span>PRECISION: 0.04m</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* SECTION: DATA INGESTION */}
        <section id="ingestion" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-4">
                <Database className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">04_DATA_INGESTION_PIPELINE</h2>
            </div>
            <Card className="bg-[#12121A] border-[#1E1E2E]">
                <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-[12px] tracking-[0.3em]">FROM CHAOS TO CONTROL</CardTitle>
                            <CardDescription className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">Deterministic Signal Ingest</CardDescription>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">Buffer: 99.8%</span>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <PdfExtractor />
                </CardContent>
            </Card>
        </section>

        {/* SECTION: CONTEXT FUSION */}
        <section id="fusion" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-4">
                <Cpu className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">05_CONTEXT_FUSION_ENGINE</h2>
            </div>
            <Card className="bg-[#12121A] border-[#1E1E2E]">
                <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-[12px] tracking-[0.3em]">CONTEXT IS EVERYTHING</CardTitle>
                            <CardDescription className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">Multi-Platform Correlation</CardDescription>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">Correlation: 0.94 Sigma</span>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <ContextSummarizer />
                </CardContent>
            </Card>
        </section>

        {/* SECTION: INITIALIZE COMMAND */}
        <section id="initialize" className="py-24 border-t border-[#1E1E2E] flex flex-col items-center justify-center text-center gap-10">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-bold uppercase tracking-[0.4em] text-primary mb-2">
                    <Terminal className="size-3" />
                    <span>FINAL_ORCHESTRATION_GATE</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-white uppercase leading-tight">
                    Full Project <br/>
                    <span className="text-primary">Initialization</span>
                </h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    Deploy verified intelligence streams to all project nodes. Ensure institutional transparency and profit protection at scale.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="h-16 px-12 text-[11px] font-bold tracking-[0.3em] uppercase group">
                    INITIALIZE_COMMAND
                    <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-[11px] font-bold tracking-[0.3em] uppercase">
                    SYSTEM_AUDIT_REPORT
                </Button>
            </div>

            <div className="mt-8 flex items-center gap-8 text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-40">
                <span>ENCRYPT: AES-256</span>
                <span>SIGNATURE: VERIFIED</span>
                <span>RUNTIME: 12ms</span>
            </div>
        </section>

      </div>

      {/* FOOTER DATA STREAM */}
      <div className="border-t border-[#1E1E2E] bg-[#0A0A0F] py-6 px-12">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar font-mono text-[9px]">
            {[
                { time: '14:22:01', action: 'RFI_PARSED', meta: 'REF_9912' },
                { time: '14:18:44', action: 'RISK_ADJUST', meta: 'SITE_APOLLO' },
                { time: '14:12:09', action: 'DATA_FUSION', meta: 'COMPLETE' },
                { time: '13:55:31', action: 'AUTH_GATEWAY', meta: 'SUCCESS' },
                { time: '13:42:12', action: 'VEO_GEN_INIT', meta: 'PENDING' },
            ].map((log, i) => (
                <div key={i} className="flex gap-3 items-center whitespace-nowrap">
                <span className="text-muted-foreground">[{log.time}]</span>
                <span className="text-primary font-bold">{log.action}</span>
                <span className="text-muted-foreground italic">{log.meta}</span>
                {i < 4 && <div className="h-3 w-[1px] bg-[#1E1E2E]" />}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
