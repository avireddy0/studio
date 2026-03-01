'use client';

import React from 'react';

export default function NavHeader() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-[rgba(2,2,2,0.85)] backdrop-blur-xl border-b border-white/5" role="navigation">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white group cursor-pointer">
          <div className="size-5 rounded-sm bg-gradient-to-br from-primary to-accent-violet group-hover:rotate-12 transition-transform" aria-hidden="true"></div>
          Envision OS
        </div>
        <div className="hidden lg:flex gap-10 text-sm font-semibold text-slate-400">
          <a href="#command-center" className="hover:text-white transition-colors">Command Center</a>
          <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
          <a href="#context" className="hover:text-white transition-colors">Context</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#metrics" className="hover:text-white transition-colors">Audit Integrity</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors hidden sm:block">Get Access</button>
      </div>
    </nav>
  );
}
