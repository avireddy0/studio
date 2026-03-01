'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#020202] border-t border-white/5 py-24 text-center text-sm text-slate-500" role="contentinfo">
      <div className="container mx-auto px-6">
        <p className="text-xl font-black text-white mb-6">Envision OS</p>
        <p className="max-w-md mx-auto leading-relaxed">The Unified Source of Truth for Institutional Construction Asset Management.</p>
        <p className="mt-8 font-mono text-slate-700 uppercase tracking-[0.4em] text-[10px]">Audit Integrity Engines Active.</p>
      </div>
    </footer>
  );
}
