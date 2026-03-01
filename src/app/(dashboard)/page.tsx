'use client';

import React from 'react';
import NavHeader from '@/components/landing/nav-header';
import HeroSection from '@/components/landing/hero-section';
import CommandCenter from '@/components/landing/command-center';
import IngestionSection from '@/components/landing/ingestion-section';
import ContextSection from '@/components/landing/context-section';
import IntelligenceLayer from '@/components/landing/intelligence-layer';
import ToolUniverse from '@/components/landing/tool-universe';
import AccelerationSection from '@/components/landing/acceleration-section';
import Footer from '@/components/landing/footer';

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full bg-[#020202] overflow-x-hidden selection:bg-primary selection:text-white">
      <NavHeader />
      <HeroSection />
      <CommandCenter />
      <IngestionSection />
      <ContextSection />
      <IntelligenceLayer />
      <ToolUniverse />
      <AccelerationSection />
      <Footer />
    </div>
  );
}
