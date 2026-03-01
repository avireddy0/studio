
'use client';

import React from 'react';
import { DashboardHeader } from "@/components/dashboard-header";
import { Settings, Shield, Cpu, Database, Wifi, Bell, User, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0A0A0F]">
      <DashboardHeader title="SYSTEM_CONFIGURATION_NODE" />
      <main className="flex-1 p-6 space-y-8 max-w-5xl mx-auto w-full">
        
        <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">Terminal_Config</h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Node_Identifier: 8812-Operational-Gamma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CORE INFRASTRUCTURE */}
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">CORE_INFRASTRUCTURE</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">High_Precision_Sync</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Enable sub-millisecond data synchronization</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">Global_Telemetry</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Broadcast site metrics to main gateway</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">Alpha_Router_Orchestration</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Allow AI core to optimize data paths</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* SECURITY GATEWAY */}
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">SECURITY_GATEWAY</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">Multi-Factor_Auth</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Biometric and hardware key enforcement</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">Data_Encryption_Layer</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">AES-256-GCM End-to-end encryption</p>
                  </div>
                  <div className="px-3 py-1 border border-primary/20 bg-primary/5">
                    <span className="text-[8px] font-mono text-primary uppercase">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-white uppercase tracking-widest">Audit_Logging</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Continuous capture of all system events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* INTEGRATION PIPELINES */}
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none md:col-span-2">
              <CardHeader className="border-b border-[#1E1E2E]/50">
                <CardTitle className="text-[10px] tracking-[0.3em]">INTEGRATION_PIPELINES</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'PROCORE', icon: Database, status: 'STABLE' },
                        { name: 'AUTODESK', icon: Cpu, status: 'SYNCING' },
                        { name: 'ORACLE_CE', icon: Shield, status: 'STABLE' },
                        { name: 'SITESCAN', icon: Wifi, status: 'STANDBY' },
                    ].map((pipe, i) => (
                        <div key={i} className="p-4 border border-[#1E1E2E] bg-[#0A0A0F] flex flex-col items-center gap-3">
                            <pipe.icon className="size-5 text-primary/40" />
                            <span className="text-[10px] font-bold text-white uppercase">{pipe.name}</span>
                            <span className={cn(
                                "text-[8px] font-mono uppercase",
                                pipe.status === 'STABLE' ? 'text-primary' : 'text-muted-foreground'
                            )}>{pipe.status}</span>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* SYSTEM ALERTS */}
            <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
                <CardHeader className="border-b border-[#1E1E2E]/50">
                    <CardTitle className="text-[10px] tracking-[0.3em]">ALERT_DISTRIBUTION</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Bell className="size-4 text-primary/40" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Critical_Events</p>
                            <p className="text-[8px] text-muted-foreground uppercase">Push, Email, and SMS</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            {/* DANGER ZONE */}
            <Card className="border-destructive/30 bg-[#12121A] rounded-none">
                <CardHeader className="border-b border-destructive/20">
                    <CardTitle className="text-[10px] tracking-[0.3em] text-destructive">PURGE_PROTOCOL</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <button className="w-full py-3 border border-destructive/40 text-destructive text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-destructive/5 transition-colors">
                        Initialize_Full_System_Wipe
                    </button>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}
