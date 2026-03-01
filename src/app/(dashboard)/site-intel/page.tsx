'use client';

import React from 'react';
import Image from 'next/image';
import { DashboardHeader } from "@/components/dashboard-header";
import { Crosshair, Target, Shield, Map as MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SiteIntelPage() {
  const satelliteImage = PlaceHolderImages.find(img => img.id === 'satellite-map');

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0A0A0F]">
      <DashboardHeader title="SITE_INTELLIGENCE_NODE" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TACTICAL MAP AREA */}
          <Card className="lg:col-span-3 bg-[#12121A] border-[#1E1E2E] rounded-none min-h-[600px] relative overflow-hidden">
            <CardHeader className="border-b border-[#1E1E2E]/50 z-20 relative bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] tracking-[0.3em]">GEOSPATIAL_INTEL_FEED</CardTitle>
                <div className="flex gap-4 text-[9px] font-mono text-primary uppercase tracking-widest">
                  <span>LAT: 34.0522° N</span>
                  <span>LNG: 118.2437° W</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[700px]">
              {/* SATELLITE IMAGE MAP */}
              <div className="absolute inset-0 grayscale contrast-125 brightness-75">
                {satelliteImage?.imageUrl && (
                  <Image 
                    src={satelliteImage.imageUrl} 
                    alt="Satellite Map" 
                    fill 
                    className="object-cover"
                    data-ai-hint={satelliteImage.imageHint}
                  />
                )}
              </div>
              <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none" />
              
              {/* INTERACTIVE MARKERS */}
              <div className="absolute top-[40%] left-[30%] z-20">
                <div className="relative">
                  <div className="size-12 rounded-full border border-primary animate-ping absolute -inset-0 opacity-20" />
                  <Target className="size-6 text-primary" />
                  <div className="absolute left-8 top-0 bg-black/80 border border-primary/40 p-2 whitespace-nowrap">
                    <p className="text-[8px] font-bold text-white uppercase">Sector_Alpha_01</p>
                    <p className="text-[6px] font-mono text-primary uppercase">Status: Operational</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[70%] z-20">
                <div className="relative">
                  <div className="size-12 rounded-full border border-yellow-500 animate-ping absolute -inset-0 opacity-20" />
                  <Target className="size-6 text-yellow-500" />
                  <div className="absolute left-8 top-0 bg-black/80 border border-yellow-500/40 p-2 whitespace-nowrap">
                    <p className="text-[8px] font-bold text-white uppercase">Site_B_Access</p>
                    <p className="text-[6px] font-mono text-yellow-500 uppercase">Warning: Deviation_Detected</p>
                  </div>
                </div>
              </div>
              
              {/* TACTICAL HUD ELEMENTS */}
              <div className="absolute top-10 left-10 p-4 border border-primary/20 bg-black/60 backdrop-blur-md space-y-2 z-20">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">ACTIVE_SECTOR: MULTI-NODE</p>
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary animate-status" />
                  <p className="text-[8px] font-mono text-primary uppercase">Signal_Strength: Nominal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SITE LIST / STATUS */}
          <div className="space-y-6">
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">ACTIVE_NODES</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { name: 'PHOENIX_SITE_A', status: 'ACTIVE', intel: 'HEARTBEAT_OK' },
                  { name: 'APOLLO_TOWER', status: 'ACTIVE', intel: 'SCAN_COMPLETE' },
                  { name: 'TITAN_FACILITY', status: 'STANDBY', intel: 'AWAIT_AUTH' },
                  { name: 'ORION_COMPLEX', status: 'ACTIVE', intel: 'GEO_LOCKED' },
                ].map((node, i) => (
                  <div key={i} className="group p-4 border border-[#1E1E2E] bg-[#0A0A0F] hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-white tracking-widest">{node.name}</span>
                      <Target className="size-3 text-primary/40" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-primary uppercase tracking-tighter">{node.status}</span>
                      <span className="text-[8px] font-mono text-muted-foreground uppercase">{node.intel}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">THREAT_DETECTION</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Shield className="size-8 text-primary/40" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Perimeter_Secure</p>
                    <p className="text-[8px] font-mono text-muted-foreground uppercase">Zero_Unauthorized_Breaches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
