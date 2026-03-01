
'use client';

import React from 'react';
import { DashboardHeader } from "@/components/dashboard-header";
import { Map as MapIcon, Crosshair, Target, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SiteIntelPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0A0A0F]">
      <DashboardHeader title="SITE_INTELLIGENCE_NODE" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TACTICAL MAP AREA */}
          <Card className="lg:col-span-3 bg-[#12121A] border-[#1E1E2E] rounded-none min-h-[600px] relative overflow-hidden">
            <CardHeader className="border-b border-[#1E1E2E]/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] tracking-[0.3em]">GEOSPATIAL_INTEL_FEED</CardTitle>
                <div className="flex gap-4 text-[9px] font-mono text-primary uppercase tracking-widest">
                  <span>LAT: 34.0522° N</span>
                  <span>LNG: 118.2437° W</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative h-full flex items-center justify-center">
              <div className="absolute inset-0 tactical-grid opacity-20" />
              {/* PLACEHOLDER FOR MAP VIZ */}
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="size-64 rounded-full border border-primary/20 flex items-center justify-center animate-pulse">
                  <div className="size-48 rounded-full border border-primary/40 flex items-center justify-center">
                    <Crosshair className="size-12 text-primary/40" />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">Initializing_Vector_Scan...</p>
              </div>
              
              {/* TACTICAL HUD ELEMENTS */}
              <div className="absolute top-10 left-10 p-4 border border-primary/20 bg-primary/5 space-y-2">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">ACTIVE_SECTOR: ALPHA-01</p>
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
