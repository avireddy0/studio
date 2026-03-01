'use client';

import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="scroll-snap-section flex flex-col items-center justify-center pt-[48vh] pb-32 text-center relative px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-[20%] left-[10%] w-[30%] aspect-square rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[40%] aspect-square rounded-full bg-accent-violet/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-8 fade-in-up">
              <Globe className="size-3" />
              <span>MULTI-PLATFORM ORCHESTRATOR v2.4</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-10 bg-gradient-to-b from-white via-white to-slate-500 text-transparent bg-clip-text fade-in-up delay-100">
            Where Development <br/> meets Data
          </h1>
          <div className="text-lg md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12 fade-in-up delay-200">
            <span className="text-white block font-semibold mb-4">Construction reality is no longer a black box.</span>
            Turn fragmented communication into verified profit protection through continuous,
            <span className="text-white"> multi-platform audit cycles</span>.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up delay-200">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl text-base font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">Start Audit Simulation</button>
              <button className="px-8 py-4 rounded-2xl text-base font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">Read Whitepaper <ChevronRight className="size-4" /></button>
          </div>
      </div>
    </section>
  );
}
