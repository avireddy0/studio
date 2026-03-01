"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Database, 
  Cpu, 
  AlertTriangle,
  ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ContextSummarizer() {
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-12 py-12">
      
      {/* AUTHORITATIVE MESSAGE */}
      <div className="text-center space-y-4 max-w-2xl z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-destructive/20 bg-destructive/5 text-[10px] font-bold uppercase tracking-[0.4em] text-destructive mb-2 animate-pulse">
            <ShieldAlert className="size-3" />
            <span>CRITICAL_WARNING_PROTOCOL</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white uppercase leading-tight">
          Data Without Context <br/>
          <span className="text-destructive">Is Dangerous.</span>
        </h2>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-lg mx-auto">
          Raw signal streams without institutional verification create fragmentation. 
          Envision OS fuses multi-platform chaos into a sovereign intelligence baseline.
        </p>
      </div>

      {/* INTERACTIVE LAYER STACK */}
      <div className="relative w-full max-w-4xl h-[400px] perspective-[1500px]">
        
        {/* LAYER 03: CONTEXT VERIFICATION (TOP) */}
        <div className={cn(
            "absolute inset-0 border-2 border-primary bg-primary/10 backdrop-blur-md transition-all duration-700 ease-out flex flex-col items-center justify-center gap-6 shadow-[0_0_100px_rgba(0,124,90,0.2)]",
            activeLayer === 2 ? "translate-z-[150px] opacity-100 scale-100" : "translate-z-[200px] opacity-20 scale-105 pointer-events-none"
        )}>
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">LAYER_03: SOVEREIGN_INTEL</span>
            </div>
            <div className="size-24 rounded-full bg-primary/20 border border-primary flex items-center justify-center animate-status">
                <ShieldCheck className="size-12 text-primary" />
            </div>
            <div className="text-center">
                <p className="text-[14px] font-bold text-white uppercase tracking-[0.4em]">VERIFIED_TRUTH</p>
                <p className="text-[8px] font-mono text-primary uppercase tracking-widest mt-1">Institutional_Baseline_Locked</p>
            </div>
        </div>

        {/* LAYER 02: METADATA CORRELATION (MIDDLE) */}
        <div className={cn(
            "absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-700 ease-out flex flex-col items-center justify-center gap-6",
            activeLayer === 1 ? "translate-z-[0px] opacity-100 scale-95" : "translate-z-[50px] opacity-20 scale-100 pointer-events-none"
        )}>
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <Cpu className="size-4 text-white/40" />
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">LAYER_02: CROSS_CORRELATION</span>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full px-12 opacity-40">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-1 bg-white/10 relative">
                        <div className="absolute inset-0 bg-primary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    </div>
                ))}
            </div>
            <div className="text-center">
                <p className="text-[12px] font-bold text-white/60 uppercase tracking-[0.3em]">SYNTHESIZING_NODES</p>
                <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Multi-Platform_Signal_Match</p>
            </div>
        </div>

        {/* LAYER 01: RAW SIGNAL CHAOS (BOTTOM) */}
        <div className={cn(
            "absolute inset-0 border border-destructive/20 bg-destructive/5 transition-all duration-700 ease-out flex flex-col items-center justify-center gap-6 overflow-hidden",
            activeLayer === 0 ? "translate-z-[-150px] opacity-100 scale-90" : "translate-z-[-100px] opacity-20 scale-95 pointer-events-none"
        )}>
            <div className="absolute inset-0 tactical-grid opacity-20" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive/40" />
                <span className="text-[10px] font-mono font-bold text-destructive/40 uppercase tracking-widest">LAYER_01: RAW_SIGNAL_CHAOS</span>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center px-12">
                {["RFI_99", "PDF_ERR", "XLS_LOST", "CALL_DROP", "MSG_NULL", "BIM_LAG", "DATA_NOISE"].map((str, i) => (
                    <div key={i} className="px-3 py-1 border border-destructive/30 text-[9px] font-mono text-destructive uppercase animate-pulse">
                        {str}
                    </div>
                ))}
            </div>

            <div className="text-center">
                <p className="text-[12px] font-bold text-destructive/60 uppercase tracking-[0.3em]">FRAGMENTED_LIABILITY</p>
                <p className="text-[8px] font-mono text-destructive/40 uppercase tracking-widest mt-1">Unverified_Data_Stream</p>
            </div>
        </div>

      </div>

      {/* LAYER NAVIGATION HUD */}
      <div className="flex gap-4 z-20">
          {[
              { id: 0, label: "RAW_CHAOS", icon: Activity, color: "text-destructive" },
              { id: 1, label: "CORRELATION", icon: Cpu, color: "text-white/60" },
              { id: 2, label: "SOVEREIGN_TRUTH", icon: ShieldCheck, color: "text-primary" },
          ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={cn(
                    "flex flex-col items-center gap-2 p-4 border transition-all min-w-[140px]",
                    activeLayer === layer.id ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 opacity-40 hover:opacity-60"
                )}
              >
                  <layer.icon className={cn("size-5", layer.color)} />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white">{layer.label}</span>
                  {activeLayer === layer.id && <div className="h-0.5 w-full bg-primary mt-1" />}
              </button>
          ))}
      </div>
    </div>
  );
}
