"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Cpu,
  FileText,
  Mail,
  Phone,
  Database,
  Lock,
  Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

const layers = [
  {
    id: 0,
    label: "FRAGMENTED_LIABILITY",
    title: "Raw Signal Chaos",
    subtitle: "Unverified data from 12+ disconnected platforms",
    icon: ShieldAlert,
    borderColor: "border-red-500/30",
    bgColor: "bg-red-950/40",
    accentColor: "text-red-400",
    activeGlow: "shadow-[0_0_80px_rgba(239,68,68,0.12)]",
    barColor: "bg-red-500",
    signals: [
      { label: "RFI_LOST", icon: FileText, status: "UNRESOLVED" },
      { label: "BIM_V3_STALE", icon: Database, status: "OUTDATED" },
      { label: "EMAIL_BURIED", icon: Mail, status: "MISSED" },
      { label: "CALL_NO_LOG", icon: Phone, status: "UNTRACKED" },
    ],
    metrics: [
      { label: "Data Sources", value: "12+", trend: "Disconnected" },
      { label: "Signal Noise", value: "73%", trend: "Critical" },
      { label: "Liability Risk", value: "HIGH", trend: "Unmitigated" },
    ],
  },
  {
    id: 1,
    label: "CROSS_CORRELATION",
    title: "Platform Synthesis",
    subtitle: "Connecting signals across systems in real-time",
    icon: Cpu,
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-950/30",
    accentColor: "text-amber-400",
    activeGlow: "shadow-[0_0_80px_rgba(245,158,11,0.12)]",
    barColor: "bg-amber-500",
    signals: [
      { label: "RFI ↔ SCHEDULE", icon: Link2, status: "LINKED" },
      { label: "BIM ↔ BUDGET", icon: Link2, status: "SYNCING" },
      { label: "EMAIL ↔ RFI", icon: Link2, status: "MATCHED" },
      { label: "CALL ↔ LOG", icon: Link2, status: "CORRELATING" },
    ],
    metrics: [
      { label: "Correlations", value: "847", trend: "Active" },
      { label: "Match Rate", value: "94.2%", trend: "Improving" },
      { label: "Coverage", value: "11/12", trend: "Near Complete" },
    ],
  },
  {
    id: 2,
    label: "SOVEREIGN_TRUTH",
    title: "Contextual Intelligence",
    subtitle: "Verified cross-platform project truth — zero liability",
    icon: ShieldCheck,
    borderColor: "border-primary/30",
    bgColor: "bg-primary/5",
    accentColor: "text-primary",
    activeGlow: "shadow-[0_0_100px_rgba(0,124,90,0.2)]",
    barColor: "bg-primary",
    signals: [
      { label: "RFI_202_VERIFIED", icon: ShieldCheck, status: "LOCKED" },
      { label: "BIM_V4_SYNCED", icon: ShieldCheck, status: "CURRENT" },
      { label: "COMMS_INDEXED", icon: ShieldCheck, status: "COMPLETE" },
      { label: "DECISIONS_LOGGED", icon: Lock, status: "IMMUTABLE" },
    ],
    metrics: [
      { label: "Confidence", value: "0.99σ", trend: "Verified" },
      { label: "Risk Delta", value: "-94.2%", trend: "Mitigated" },
      { label: "Liability", value: "ZERO", trend: "Protected" },
    ],
  },
];

export function ContextSummarizer() {
  const [activeLayer, setActiveLayer] = useState(2);
  const [mounted, setMounted] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isInteracting]);

  const handleLayerClick = useCallback((id: number) => {
    setActiveLayer(id);
    setIsInteracting(true);
    const timeout = setTimeout(() => setIsInteracting(false), 15000);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  const getLayerTransform = (layerIndex: number): React.CSSProperties => {
    const diff = layerIndex - activeLayer;

    if (diff === 0) {
      return {
        transform: "translateY(0px) translateZ(60px) rotateX(0deg) scale(1)",
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
      };
    }

    if (diff < 0 || (activeLayer === 0 && layerIndex === 2)) {
      // Layers below active — pushed back and down
      const depth = activeLayer === 0 && layerIndex === 2 ? -2 : diff;
      return {
        transform: `translateY(${depth * -40 + 60}px) translateZ(${depth * 40 - 40}px) rotateX(6deg) scale(${0.94 + depth * 0.02})`,
        opacity: 0.25,
        zIndex: 10 + layerIndex,
        pointerEvents: "auto" as const,
      };
    }

    // Layers above active — pushed back and up
    return {
      transform: `translateY(${diff * -50 - 30}px) translateZ(${diff * -30}px) rotateX(-4deg) scale(${0.96 - diff * 0.02})`,
      opacity: 0.2,
      zIndex: 20 - diff,
      pointerEvents: "auto" as const,
    };
  };

  return (
    <div className="relative w-full h-full flex flex-col gap-6 py-6">

      {/* Header */}
      <div className="text-center space-y-4 shrink-0 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
          <Zap className="size-3" />
          <span>Context_Fusion_Engine</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white leading-tight">
          Context is Everything
        </h2>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xl mx-auto">
          Data without context is <span className="text-red-400 font-bold">dangerous</span>.
          Envision OS fuses fragmented signals into verified project truth —
          eliminating liability through multi-platform correlation.
        </p>
      </div>

      {/* 3D Layer Stack */}
      <div
        className="relative flex-1 flex items-center justify-center min-h-[320px] px-4"
        style={{ perspective: "1800px", perspectiveOrigin: "50% 40%" }}
      >
        {layers.map((layer) => {
          const style = getLayerTransform(layer.id);
          const isActive = activeLayer === layer.id;

          return (
            <div
              key={layer.id}
              onClick={() => handleLayerClick(layer.id)}
              className={cn(
                "absolute w-full max-w-3xl cursor-pointer transition-all duration-700 ease-out border backdrop-blur-md",
                layer.borderColor,
                layer.bgColor,
                isActive && layer.activeGlow,
              )}
              style={{
                ...style,
                transformStyle: "preserve-3d",
                transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="p-4 sm:p-6 md:p-8">
                {/* Layer Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "size-9 border flex items-center justify-center shrink-0",
                      layer.borderColor, layer.bgColor
                    )}>
                      <layer.icon className={cn("size-5", layer.accentColor)} />
                    </div>
                    <div>
                      <span className={cn("text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.3em] block", layer.accentColor)}>
                        LAYER_0{layer.id + 1}: {layer.label}
                      </span>
                      <p className="text-white text-base sm:text-lg font-semibold tracking-tight mt-0.5">{layer.title}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-white/20 uppercase hidden md:block max-w-[200px] text-right">{layer.subtitle}</span>
                </div>

                {/* Signal Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5">
                  {layer.signals.map((signal, i) => (
                    <div key={i} className={cn(
                      "p-2.5 sm:p-3 border transition-all",
                      layer.borderColor, "bg-black/30"
                    )}>
                      <signal.icon className={cn("size-3.5 mb-1.5", layer.accentColor)} />
                      <p className="text-[9px] sm:text-[10px] font-mono font-bold text-white uppercase tracking-wider leading-tight">{signal.label}</p>
                      <p className={cn("text-[8px] font-mono uppercase tracking-widest mt-1", layer.accentColor)}>{signal.status}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics Row */}
                <div className="flex gap-3 sm:gap-4 border-t border-white/5 pt-4">
                  {layer.metrics.map((metric, i) => (
                    <div key={i} className="flex-1 min-w-0">
                      <p className="text-[8px] sm:text-[9px] text-white/25 uppercase tracking-widest mb-1 truncate">{metric.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-mono font-bold text-white">{metric.value}</span>
                        <span className={cn("text-[8px] font-bold uppercase truncate", layer.accentColor)}>{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer Navigation */}
      <div className="flex justify-center gap-2 sm:gap-3 shrink-0 z-20">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => handleLayerClick(layer.id)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border transition-all min-w-[100px] sm:min-w-[130px]",
              activeLayer === layer.id
                ? cn("bg-white/10 border-white/20", layer.activeGlow)
                : "bg-transparent border-white/5 opacity-40 hover:opacity-70"
            )}
          >
            <layer.icon className={cn("size-4 shrink-0", layer.accentColor)} />
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white truncate">
              {layer.label.replaceAll("_", " ")}
            </span>
            {activeLayer === layer.id && (
              <div className={cn("h-4 w-0.5 ml-auto shrink-0", layer.barColor)} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
