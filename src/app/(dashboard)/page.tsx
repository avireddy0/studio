'use client';

import React from 'react';
import { 
  Crosshair, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Zap, 
  Target,
  ChevronRight,
  Activity,
  Box
} from 'lucide-react';
import { EnvisionOSLogo } from "@/components/icons";
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-white text-black min-h-screen selection:bg-primary/20 font-sans">
      {/* HUD OVERLAY - SUBTLE LIGHT VERSION */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ 
        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* TOP NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/5 bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <EnvisionOSLogo className="size-5 text-primary" />
          <span className="text-xs font-bold tracking-[0.4em] uppercase">Envision OS</span>
        </div>
        <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-black/40">
                <span className="hover:text-primary cursor-pointer transition-colors">01 Protocol</span>
                <span className="hover:text-primary cursor-pointer transition-colors">02 Intelligence</span>
                <span className="hover:text-primary cursor-pointer transition-colors">03 Audit</span>
            </div>
            <Link href="/dashboard" className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all rounded-none">
                ACCESS_GATEWAY
            </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center pt-48 pb-32 px-6 overflow-hidden">
        <div className="relative z-10 max-w-6xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-[9px] font-bold uppercase tracking-[0.4em] text-primary mb-12">
                <Crosshair className="size-3" />
                <span>Institutional Intel System v4.0</span>
            </div>
            
            <div className="space-y-4 mb-16">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none uppercase">
                    Where <br/>
                    <span className="text-primary italic">Development</span> <br/>
                    Meets Data
                </h1>
            </div>

            <p className="text-lg md:text-xl text-black/60 max-w-2xl mb-16 leading-relaxed font-medium">
                Sovereign project orchestration. Eliminating fragmented noise with <span className="text-black font-bold uppercase">weapons-grade accuracy</span> and verified multi-platform data fusion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono">
                <Link href="/dashboard" className="bg-primary text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3 rounded-none">
                    INITIALIZE_COMMAND <ArrowRight className="size-4" />
                </Link>
                <button className="px-10 py-4 text-[11px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all bg-transparent rounded-none">
                    SYSTEM_AUDIT
                </button>
            </div>
        </div>

        {/* HUD DECOR */}
        <div className="absolute top-1/2 -right-24 size-[600px] border border-black/[0.03] rounded-full -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 size-[400px] border border-primary/5 rounded-full -translate-y-1/2 pointer-events-none"></div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-32 px-6 border-t border-black/5 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { 
                    title: "DATA INGESTION", 
                    subtitle: "From Chaos to Control", 
                    desc: "Real-time parsing of fragmented telemetry across 23 construction platforms.",
                    icon: Database 
                },
                { 
                    title: "CONTEXT FUSION", 
                    subtitle: "Context is Everything", 
                    desc: "Deterministic signal validation mapping multi-platform data into a unified truth stream.",
                    icon: Cpu 
                },
                { 
                    title: "PREDICTIVE INTEL", 
                    subtitle: "See Around Corners", 
                    desc: "Advanced heuristic modeling for margin protection and critical schedule integrity.",
                    icon: Target 
                }
            ].map((feature, i) => (
                <div key={i} className="group border-t-2 border-primary bg-[#F5F5F5] p-10 hover:bg-[#EFEFEF] transition-all border-x border-b border-black/5 rounded-none">
                    <feature.icon className="size-8 text-primary mb-8 group-hover:scale-110 transition-transform" />
                    <span className="block text-[10px] font-bold text-primary tracking-[0.4em] uppercase mb-2">{feature.title}</span>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-black">{feature.subtitle}</h3>
                    <p className="text-sm text-black/60 leading-relaxed font-medium">{feature.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-[9px] font-bold text-black/20 uppercase tracking-widest group-hover:text-primary transition-colors cursor-pointer">
                        View Protocol <ChevronRight className="size-3" />
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-black/5 px-6 text-center bg-white">
        <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
                <EnvisionOSLogo className="size-5 text-primary" />
                <span className="text-xs font-bold tracking-[0.4em] uppercase">Envision OS</span>
            </div>
            <p className="text-[10px] font-bold text-black/20 uppercase tracking-[0.5em] max-w-sm">
                SOVEREIGN_DATA_ENFORCED_SOC2_COMPLIANT
            </p>
            <div className="flex gap-8 text-[9px] font-bold text-black/40 uppercase tracking-widest">
                <span>Security</span>
                <span>Terms</span>
                <span>Privacy</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
