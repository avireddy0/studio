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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { PdfExtractor } from "@/components/ingestion/pdf-extractor";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { TacticalBimOverlay } from "@/components/visualizations/tactical-bim-overlay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from "@/lib/utils";

export default function UnifiedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  const satelliteImage = PlaceHolderImages.find(img => img.id === 'satellite-map');

  // High-Density Tornado Generator - 160 elements for maximum anxiety, slowed down by 40%
  const chaoticInputs = Array.from({ length: 160 }).map((_, i) => {
    const icons = [FileText, FileSpreadsheet, FileCode, FileSignature, Mail, Phone, MessageSquare];
    const Icon = icons[i % icons.length];
    return {
      Icon,
      // Slowed down by 40% (was ~0.4-1.0s, now ~2.5-4.5s for visibility and tornado feel)
      delay: `${(Math.random() * 8).toFixed(2)}s`,
      duration: `${(2.5 + Math.random() * 2.0).toFixed(2)}s`,
      top: `${(Math.random() * 100).toFixed(2)}%`,
      yOffset: `${(Math.random() * 400 - 200).toFixed(2)}px`,
      size: i % 12 === 0 ? "size-6" : "size-4",
    };
  });

  return (
    <div 
        id="main-scroll-container"
        className="flex flex-col w-full selection:bg-primary/20 font-sans snap-y snap-mandatory overflow-y-auto h-[calc(100vh-64px)] no-scrollbar scroll-smooth"
    >
      
      {/* SECTION 01: INSTITUTIONAL HERO (WHITE) */}
      <section id="hero" className="snap-start relative flex flex-col items-center justify-center p-6 bg-white text-black overflow-hidden min-h-screen w-full">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 max-w-6xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-bold uppercase tracking-[0.4em] text-primary mb-12">
                <Crosshair className="size-3" />
                <span>Institutional Intel System v4.0</span>
            </div>
            
            <div className="space-y-4 mb-16">
                <h1 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-none">
                    Where <br/>
                    <span className="text-primary">Development</span> <br/>
                    Meets Data
                </h1>
            </div>

            <p className="text-lg md:text-xl text-black/60 max-w-2xl mb-16 leading-relaxed font-medium">
                Sovereign project orchestration. Eliminating fragmented noise with <span className="text-black font-bold uppercase">weapons-grade accuracy</span> and verified multi-platform data fusion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono">
                <a href="#ingestion" className="bg-primary text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3 rounded-none shadow-[4px_4px_0px_rgba(0,124,90,0.2)]">
                    INITIALIZE_SYSTEM <ArrowRight className="size-4" />
                </a>
            </div>
        </div>
      </section>

      {/* SECTION 02: INGESTION PIPELINE (WHITE) - THE TORNADO FUNNEL */}
      <section id="ingestion" className="snap-start relative min-h-screen w-full bg-white text-black flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl flex flex-col gap-12">
              <div className="flex items-center gap-3 mb-2 shrink-0">
                  <Database className="size-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40">02_Data_Ingestion_Pipeline</h2>
              </div>
              
              <div className="relative w-full h-[500px] flex items-center bg-gray-50/30 border border-black/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                      
                      {/* THE CHAOTIC TORNADO FUNNEL (LEFT TO CENTER) */}
                      <div className="absolute left-0 w-1/2 h-full overflow-hidden pointer-events-none">
                        {chaoticInputs.map((item, i) => (
                            <div 
                              key={i} 
                              className="absolute left-[-50px] animate-tornado opacity-0 text-muted-foreground/30"
                              style={{ 
                                  "--delay": item.delay,
                                  "--duration": item.duration,
                                  "--y-offset": item.yOffset,
                                  top: item.top
                              } as React.CSSProperties}
                            >
                                <item.Icon className={item.size} />
                            </div>
                        ))}
                      </div>

                      {/* THE PARSER CORE (CENTER) */}
                      <div className="relative z-20 flex flex-col items-center gap-4 px-12">
                          <div className="size-36 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center animate-status shadow-[0_0_60px_rgba(0,124,90,0.15)] bg-white/50 backdrop-blur-sm">
                              <div className="relative">
                                <Database className="size-16 text-primary" />
                                <div className="absolute inset-0 size-16 bg-primary/20 blur-2xl animate-pulse" />
                              </div>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.4em]">Parser_Core</span>
                              <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Synthesizing...</span>
                          </div>
                      </div>

                      {/* THE SINGLE FILE LINE (CENTER TO RIGHT) */}
                      <div className="absolute right-0 w-1/2 h-full overflow-hidden pointer-events-none">
                          <div className="flex flex-col justify-center h-full gap-4 pl-12">
                              {[
                                "0x1A2B_RFI_VERIFIED",
                                "0x3C4D_CONTRACT_SIGNED",
                                "0x5E6F_BIM_SYNCED",
                                "0x7G8H_XLS_NORMALIZED",
                                "0x9I0J_LOG_ARCHIVED",
                                "0xAK1L_NODE_STABLE",
                                "0xCM2N_SIGNAL_CLEAN"
                              ].map((str, i) => (
                                <div 
                                    key={i} 
                                    className="animate-data-stream-single opacity-0 text-[9px] font-mono text-primary font-bold whitespace-nowrap bg-primary/5 px-3 py-1.5 border-l-2 border-primary shadow-sm" 
                                    style={{ animationDelay: `${i * 0.6}s` }}
                                >
                                    {str}
                                </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4">
                      <h3 className="text-4xl font-semibold tracking-tighter uppercase leading-tight">Chaos To Control <br/> Unified Intelligence</h3>
                      <p className="text-base text-black/60 max-w-md leading-relaxed">
                          Slamming thousands of fragmented construction signals—emails, texts, and calls—into a verified institutional stream. Deterministic parsing for weapons-grade project accuracy.
                      </p>
                  </div>
                  <Card className="bg-white border-black/10 shadow-2xl rounded-none">
                      <CardContent className="p-10">
                          <PdfExtractor />
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>

      {/* SECTION 03: COMMAND INTERFACE (WHITE) */}
      <section id="intel" className="snap-start relative min-h-screen w-full bg-white text-black flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] tactical-grid" />
        <div className="relative z-10 w-full max-w-7xl h-[85vh] flex flex-col">
            <div className="flex items-center gap-3 mb-6 shrink-0">
                <Terminal className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-black/40">03_Intelligence_Terminal_Core</h2>
            </div>
            <Card className="bg-white border-black/5 shadow-2xl h-full flex flex-col overflow-hidden rounded-none">
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
      <section id="fusion" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
          <div className="relative z-10 w-full max-w-7xl flex flex-col">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                  <Zap className="size-4 text-primary" />
                  <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">04_Context_Fusion_Engine</h2>
              </div>
              <Card className="bg-[#12121A] border-[#1E1E2E]">
                  <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-10">
                      <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                              <CardTitle className="text-[16px] tracking-[0.3em]">Context Is Everything</CardTitle>
                              <CardDescription className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Multi-Platform Correlation</CardDescription>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground uppercase">Correlation: 0.94 Sigma</span>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8 md:p-16">
                      <ContextSummarizer />
                  </CardContent>
              </Card>
          </div>
      </section>

      {/* SECTION 05: BIM + TELEMETRY (OBSIDIAN) */}
      <section id="tactical-bim" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-[85vh] grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col">
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <Layers className="size-4 text-primary" />
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">05_Tactical_Lidar_Bim</h2>
                </div>
                <div className="flex-1">
                    <TacticalBimOverlay />
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <Activity className="size-4 text-primary" />
                    <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Realtime_Telemetry</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 flex-1">
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
            </div>
        </div>
      </section>

      {/* SECTION 06: SITE + DOCUMENTS (OBSIDIAN) */}
      <section id="site-docs" className="snap-start relative min-h-screen w-full bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 tactical-grid pointer-events-none opacity-[0.03] z-0" />
        <div className="relative z-10 w-full max-w-7xl h-[85vh] flex flex-col gap-12">
            <div className="flex items-center gap-3 mb-2 shrink-0">
                <MapIcon className="size-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">06_Site_Doc_Repository</h2>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col gap-8">
                {/* SATELLITE MAP (TOP HALF) */}
                <Card className="bg-[#12121A] border-[#1E1E2E] relative overflow-hidden flex-1 min-h-[300px]">
                    <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 relative z-20">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] tracking-[0.3em]">Geospatial_Intel_Feed</CardTitle>
                            <span className="text-[8px] font-mono text-primary uppercase">LAT: 34.0522° N</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative h-full">
                        {satelliteImage?.imageUrl && (
                            <Image 
                                src={satelliteImage.imageUrl} 
                                alt="Satellite Map" 
                                fill 
                                className="object-cover grayscale contrast-125 brightness-75"
                                data-ai-hint={satelliteImage.imageHint}
                            />
                        )}
                        <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <div className="size-16 rounded-full border border-primary animate-ping absolute -inset-0 opacity-20" />
                                <Target className="size-8 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* DOCUMENTS TABLE (BOTTOM HALF) */}
                <Card className="bg-[#12121A] border-[#1E1E2E] overflow-hidden flex-1 min-h-[300px] flex flex-col">
                    <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3">
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
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">{doc.status}</span>
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