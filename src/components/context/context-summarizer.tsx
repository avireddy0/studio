"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert,
  Zap, 
  Cpu, 
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ContextSummarizer() {
  const [activeLayer, setActiveLayer] = useState<number>(2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-12 py-12">
      
      {/* AUTHORITATIVE MESSAGE */}
      <div className="text-center space-y-6 max-w-2xl z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2">
            <Zap className="size-3" />
            <span>Operational_Fusion_Gate</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white uppercase leading-tight">
          Context is Everything
        </h2>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-lg mx-auto">
          Data without context is dangerous. Envision OS multi-platform correlation 
          eliminates liability by fusing fragmented signals into verified project truth.
        </p>
      </div>

      {/* INTERACTIVE LAYER STACK */}
      <div className="relative w-full max-w-4xl h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] flex items-center justify-center perspective-intel">
        
        {/* THE STACK */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* LAYER 03: CONTEXT VERIFICATION (TOP) */}
            <div 
                className={cn(
                    "absolute w-full max-w-xl p-4 sm:p-6 md:p-8 border-2 border-primary bg-primary/10 backdrop-blur-xl transition-all duration-1000 ease-in-out flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(0,124,90,0.3)] z-30",
                    activeLayer === 2 ? "translate-y-0 opacity-100 scale-100" : "-translate-y-48 opacity-0 scale-110 pointer-events-none"
                )}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-primary" />
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono font-bold text-primary uppercase tracking-widest">LAYER_03: SOVEREIGN_TRUTH</span>
                    </div>
                    <span className="text-[9px] font-mono text-primary/60">NODE_VERIFIED</span>
                </div>
                
                <div className="flex items-center gap-8 py-4">
                    <div className="size-16 rounded-full border-2 border-primary flex items-center justify-center bg-black/40">
                        <ShieldCheck className="size-8 text-primary animate-status" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-white uppercase tracking-widest">Zero_Liability</p>
                        <p className="text-[9px] font-mono text-primary uppercase">Institutional_Baseline_Locked</p>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-primary/20" />
                
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-3 border border-primary/10 bg-primary/5">
                        <p className="text-[10px] md:text-[8px] text-primary/60 uppercase mb-1">Correlation</p>
                        <p className="text-[11px] font-bold text-white uppercase">0.99 SIGMA</p>
                    </div>
                    <div className="p-3 border border-primary/10 bg-primary/5">
                        <p className="text-[10px] md:text-[8px] text-primary/60 uppercase mb-1">Risk_Delta</p>
                        <p className="text-[11px] font-bold text-white uppercase">-94.2%</p>
                    </div>
                </div>
            </div>

            {/* LAYER 02: CROSS_CORRELATION (MIDDLE) */}
            <div 
                className={cn(
                    "absolute w-full max-w-lg p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-1000 ease-in-out flex flex-col items-center gap-4 z-20",
                    activeLayer === 1 ? "translate-y-0 opacity-100 scale-100" : activeLayer === 2 ? "translate-y-16 opacity-40 scale-95" : "-translate-y-32 opacity-0 scale-105 pointer-events-none"
                )}
            >
                <div className="flex items-center gap-2 w-full">
                    <Cpu className="size-4 text-white/40" />
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">LAYER_02: CROSS_CORRELATION</span>
                </div>
                <div className="flex gap-2 w-full">
                   {[1, 2, 3, 4, 5, 6].map(i => (
                       <div key={i} className="flex-1 h-0.5 bg-white/10 relative overflow-hidden">
                           <div className="absolute inset-0 bg-primary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                       </div>
                   ))}
                </div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Synthesizing_Multi-Platform_Nodes...</p>
            </div>

            {/* LAYER 01: RAW_SIGNAL_CHAOS (BOTTOM) */}
            <div 
                className={cn(
                    "absolute w-full max-w-md p-4 sm:p-6 border border-destructive/20 bg-destructive/5 transition-all duration-1000 ease-in-out flex flex-col items-center gap-4 z-10",
                    activeLayer === 0 ? "translate-y-0 opacity-100 scale-100" : "translate-y-24 opacity-20 scale-90 pointer-events-none"
                )}
            >
                <div className="flex items-center gap-2 w-full">
                    <ShieldAlert className="size-4 text-destructive/60" />
                    <span className="text-[10px] font-mono font-bold text-destructive/60 uppercase tracking-widest">LAYER_01: FRAGMENTED_LIABILITY</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center py-4">
                    {["RFI_LOST", "BIM_LAG", "DATA_NOISE", "PDF_ERR", "VOID_REF"].map((str, i) => (
                        <div key={i} className="px-2 py-0.5 border border-destructive/20 text-[10px] md:text-[8px] font-mono text-destructive uppercase animate-pulse">
                            {str}
                        </div>
                    ))}
                </div>
                
                <div className="text-center">
                    <p className="text-[11px] font-bold text-destructive uppercase tracking-widest">High_Operational_Risk</p>
                    <p className="text-[10px] md:text-[8px] font-mono text-destructive/40 uppercase">Unverified_Signal_Stream</p>
                </div>
            </div>

        </div>
      </div>

      {/* LAYER NAVIGATION HUD */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 z-20">
          {[
              { id: 0, label: "RAW_CHAOS", icon: AlertTriangle, color: "text-destructive" },
              { id: 1, label: "CORRELATION", icon: Cpu, color: "text-white/40" },
              { id: 2, label: "SOVEREIGN_TRUTH", icon: ShieldCheck, color: "text-primary" },
          ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={cn(
                    "flex flex-col items-center gap-2 p-2 sm:p-3 md:p-4 border transition-all min-w-[90px] sm:min-w-[110px] md:min-w-[140px]",
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