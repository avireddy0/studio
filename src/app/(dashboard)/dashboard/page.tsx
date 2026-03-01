
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Target, 
  Database, 
  Zap, 
  ShieldAlert, 
  Map as MapIcon, 
  Circle,
  Terminal,
  Upload,
  Search,
  Crosshair,
  MessageSquare,
  Cpu,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChatInterface } from "@/components/query/chat-interface";
import { PdfExtractor } from "@/components/ingestion/pdf-extractor";
import { ContextSummarizer } from "@/components/context/context-summarizer";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6 bg-[#0A0A0F] min-h-screen">
      {/* MONOSPACE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL_PROJECTS', value: '47', icon: Target },
          { label: 'ACTIVE_SITES', value: '12', icon: MapIcon },
          { label: 'BUDGET_TRACKED', value: '$2.3B', icon: Activity },
          { label: 'VARIANCE_DELTA', value: '-1.2%', icon: Zap, color: 'text-primary' },
        ].map((metric, i) => (
          <Card key={i} className="bg-[#12121A] border-[#1E1E2E] rounded-none">
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

      {/* PRIMARY INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTEL TERMINAL (CHAT) - INTEGRATED */}
        <Card className="lg:col-span-2 bg-[#12121A] border-[#1E1E2E] rounded-none min-h-[500px] flex flex-col">
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50">
            <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] tracking-[0.3em] flex items-center gap-2">
                    <Terminal className="size-3 text-primary" />
                    INTEL_TERMINAL_CORE
                </CardTitle>
                <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary animate-status" />
                    <span className="text-[9px] font-mono text-primary uppercase">Alpha_Node_Stable</span>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden relative">
            {/* TACTICAL VERSION OF CHAT */}
            <div className="absolute inset-0 bg-[#0A0A0F]">
                 <ChatInterface />
            </div>
          </CardContent>
        </Card>

        {/* RISK MATRIX & SITE INTEL */}
        <div className="space-y-6">
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">PROJECT_RISK_MATRIX</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    { name: 'PROJECT_PHOENIX', risk: 'LOW', color: 'bg-primary' },
                    { name: 'APOLLO_COMPLEX', risk: 'MED', color: 'bg-yellow-500' },
                    { name: 'TITAN_SITE_B', risk: 'HIGH', color: 'bg-destructive' },
                    { name: 'ORION_OFFICE', risk: 'LOW', color: 'bg-primary' },
                  ].map((site, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest text-white/90">{site.name}</span>
                        <span className="text-[8px] font-mono text-muted-foreground uppercase">Threat_Level: {site.risk}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-1 w-24 bg-secondary overflow-hidden">
                            <div className={cn("h-full w-2/3 animate-pulse", site.color)} />
                        </div>
                        <Circle className={cn("size-1.5 fill-current", site.color.replace('bg-', 'text-'))} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none flex-1">
                <CardHeader className="border-b border-[#1E1E2E]/50">
                    <CardTitle className="text-[10px] tracking-[0.3em]">GEOSPATIAL_STATUS</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[150px]">
                    <div className="relative">
                        <MapIcon className="size-10 text-primary/20" />
                        <Crosshair className="size-4 text-primary absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">LAT_SCAN_LOCKED</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-mono">34.0522 N / 118.2437 W</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* SECONDARY FUNCTIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DATA INGESTION PIPELINE - INTEGRATED */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none flex flex-col">
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50">
            <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] tracking-[0.3em] flex items-center gap-2">
                    <Database className="size-3 text-primary" />
                    DATA_INGESTION_PIPELINE
                </CardTitle>
                <span className="text-[8px] font-mono text-muted-foreground uppercase">Buffer: 99.8% Clean</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
             <div className="mb-6 h-1 w-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary w-[88%] animate-pulse" />
             </div>
             {/* INTEGRATED PDF EXTRACTOR */}
             <PdfExtractor />
          </CardContent>
        </Card>

        {/* CONTEXT FUSION ENGINE - INTEGRATED */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none flex flex-col">
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50">
            <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] tracking-[0.3em] flex items-center gap-2">
                    <Cpu className="size-3 text-primary" />
                    CONTEXT_FUSION_ENGINE
                </CardTitle>
                <span className="text-[8px] font-mono text-muted-foreground uppercase">Correlation: 0.94 Sigma</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
             {/* INTEGRATED CONTEXT SUMMARIZER */}
             <ContextSummarizer />
          </CardContent>
        </Card>

      </div>

      {/* ACTIVITY FEED FOOTER */}
      <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
          <CardHeader className="border-b border-[#1E1E2E]/50 py-3">
            <CardTitle className="text-[9px] tracking-[0.4em]">LIVE_SYSTEM_TELEMETRY</CardTitle>
          </CardHeader>
          <CardContent className="p-4 px-6 overflow-x-auto">
            <div className="flex items-center gap-8 min-w-max font-mono text-[9px]">
                {[
                  { time: '14:22:01', action: 'RFI_PARSED', meta: 'REF_9912' },
                  { time: '14:18:44', action: 'RISK_ADJUST', meta: 'SITE_APOLLO' },
                  { time: '14:12:09', action: 'DATA_FUSION', meta: 'COMPLETE' },
                  { time: '13:55:31', action: 'AUTH_GATEWAY', meta: 'SUCCESS' },
                  { time: '13:42:12', action: 'VEO_GEN_INIT', meta: 'SYNC_PENDING' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 items-center whitespace-nowrap">
                    <span className="text-muted-foreground">[{log.time}]</span>
                    <span className="text-primary font-bold">{log.action}</span>
                    <span className="text-muted-foreground italic">{log.meta}</span>
                    {i < 4 && <div className="h-3 w-[1px] bg-[#1E1E2E]" />}
                  </div>
                ))}
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
