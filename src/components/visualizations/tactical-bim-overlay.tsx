'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Target, Activity, Zap, Crosshair, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TacticalBimOverlay() {
  const image = PlaceHolderImages.find(img => img.id === 'tactical-bim');

  return (
    <div className="relative w-full h-[60vh] lg:h-full overflow-hidden border border-primary/20 bg-black">
      {/* FLIR EFFECT OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-40 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
      
      {/* SCANNING IMAGE */}
      <div className="absolute inset-0 grayscale contrast-200 brightness-50 opacity-60">
        {image?.imageUrl && (
          <Image
            src={image.imageUrl}
            alt="LiDAR Scan"
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        )}
      </div>

      {/* TACTICAL GRID & HUD */}
      <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />
      
      {/* HUD ELEMENTS */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-black/80 border border-primary/40 px-4 py-2">
              <Activity className="size-4 text-primary animate-status" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">LIDAR_ACTIVE</span>
                <span className="text-[8px] font-mono text-primary uppercase">Precision: 0.02mm Delta</span>
              </div>
            </div>
            <div className="bg-black/80 border border-white/10 px-4 py-3 space-y-2">
              <div className="flex justify-between items-center gap-8">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">Project_Node</span>
                <span className="text-[9px] font-mono text-white uppercase">PHOENIX_A</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">As_Built_Sync</span>
                <span className="text-[9px] font-mono text-primary uppercase">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 backdrop-blur-md p-4 flex flex-col items-center gap-2">
            <Crosshair className="size-8 text-primary/40 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Target_Locked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/80 border-l-2 border-primary p-4 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Progress_Metric</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">74.2%</span>
              <span className="text-[9px] text-primary uppercase font-bold">+1.2% Δ</span>
            </div>
          </div>
          <div className="bg-black/80 border-l-2 border-yellow-500 p-4 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Accuracy_Variance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">99.85%</span>
              <span className="text-[9px] text-yellow-500 uppercase font-bold">In_Spec</span>
            </div>
          </div>
          <div className="bg-black/80 border-l-2 border-primary p-4 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Budget_Efficiency</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-white">1.04</span>
              <span className="text-[9px] text-primary uppercase font-bold">Optimum</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCAN LINE */}
      <div className="absolute left-0 right-0 h-[2px] bg-primary/40 shadow-[0_0_20px_rgba(0,124,90,0.5)] animate-scan-line z-30" />
    </div>
  );
}