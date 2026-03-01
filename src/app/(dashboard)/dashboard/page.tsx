'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Target, 
  Database, 
  Zap, 
  ShieldAlert, 
  Map as MapIcon, 
  Clock,
  ChevronRight,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
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
              <div className="text-3xl font-mono font-bold tracking-tighter mt-2">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MAIN INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SITE INTELLIGENCE MAP */}
        <Card className="lg:col-span-2 bg-[#12121A] border-[#1E1E2E] rounded-none min-h-[400px]">
          <CardHeader className="border-b border-[#1E1E2E]/50">
            <CardTitle className="text-[10px] tracking-[0.3em]">SITE_INTELLIGENCE_MAP</CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative flex-1 flex items-center justify-center">
             <div className="absolute inset-0 tactical-grid opacity-20" />
             <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <MapIcon className="size-12 text-primary/20" />
                <div className="space-y-1">
                    <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Awaiting_GEO_Feed</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Coordinates: 34.0522° N, 118.2437° W</p>
                </div>
             </div>
             {/* HUD MARKERS */}
             <div className="absolute top-10 left-10 p-2 border border-primary/20 bg-primary/5">
                <p className="text-[8px] font-mono text-primary">NODE_01_ACTIVE</p>
             </div>
             <div className="absolute bottom-10 right-10 p-2 border border-primary/20 bg-primary/5">
                <p className="text-[8px] font-mono text-primary">LAT_SCAN_LOCKED</p>
             </div>
          </CardContent>
        </Card>

        {/* RISK MATRIX */}
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
                { name: 'VOID_DATA_CENTER', risk: 'MED', color: 'bg-yellow-500' },
              ].map((site, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest">{site.name}</span>
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">Threat_Level: {site.risk}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-1 w-24 bg-secondary overflow-hidden">
                        <div className={`h-full ${site.color} w-2/3 animate-pulse`} />
                    </div>
                    <Circle className={`size-1.5 fill-current ${site.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DATA INGESTION PIPELINE */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
          <CardHeader className="border-b border-[#1E1E2E]/50">
            <CardTitle className="text-[10px] tracking-[0.3em]">INGESTION_PIPELINE</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
                <span>Total_Throughput</span>
                <span className="text-primary">884.2 GB/s</span>
              </div>
              <div className="h-1 w-full bg-secondary">
                <div className="h-full bg-primary w-4/5" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 border border-[#1E1E2E] bg-[#0A0A0F]">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">PROCORE_SYNC</p>
                    <p className="text-xs font-mono text-primary font-bold">STABLE</p>
                </div>
                <div className="p-4 border border-[#1E1E2E] bg-[#0A0A0F]">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mb-1">AUTODESK_BIM</p>
                    <p className="text-xs font-mono text-primary font-bold">ACTIVE</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RECENT ACTIVITY FEED */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
          <CardHeader className="border-b border-[#1E1E2E]/50">
            <CardTitle className="text-[10px] tracking-[0.3em]">SYSTEM_ACTIVITY_LOG</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 font-mono">
              {[
                { time: '14:22:01', action: 'RFI_PARSED', meta: 'REF_9912' },
                { time: '14:18:44', action: 'RISK_ADJUST', meta: 'SITE_APOLLO' },
                { time: '14:12:09', action: 'DATA_FUSION', meta: 'COMPLETE' },
                { time: '13:55:31', action: 'AUTH_GATEWAY', meta: 'SUCCESS' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 text-[9px] uppercase tracking-tighter">
                  <span className="text-muted-foreground">[{log.time}]</span>
                  <span className="text-primary font-bold">{log.action}</span>
                  <span className="text-muted-foreground italic">{log.meta}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CONTEXT FUSION ENGINE */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
          <CardHeader className="border-b border-[#1E1E2E]/50">
            <CardTitle className="text-[10px] tracking-[0.3em]">CONTEXT_FUSION_ENGINE</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
            <Zap className="size-8 text-primary animate-pulse" />
            <div className="space-y-1">
                <p className="text-sm font-bold tracking-tight">ENGINE_CORE_NOMINAL</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em]">99.8% Correlation_Confidence</p>
            </div>
            <button className="mt-4 px-6 py-2 border border-primary/20 text-[9px] font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                Initialize_Milling
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
