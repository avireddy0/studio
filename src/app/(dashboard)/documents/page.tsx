
'use client';

import React from 'react';
import { DashboardHeader } from "@/components/dashboard-header";
import { FileText, Search, Download, Filter, FileCode, FileType } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0A0A0F]">
      <DashboardHeader title="DOCUMENT_INTEL_VAULT" />
      <main className="flex-1 p-6 space-y-6">
        {/* SEARCH AND FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search_Documents..." 
              className="pl-10 bg-[#12121A] border-[#1E1E2E] text-white placeholder:text-muted-foreground font-mono text-xs rounded-none"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button className="flex items-center gap-2 px-4 py-2 border border-[#1E1E2E] text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-colors">
                <Filter className="size-3" /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                <Download className="size-3" /> Bulk_Export
             </button>
          </div>
        </div>

        {/* DOCUMENT REPOSITORY */}
        <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none overflow-hidden">
          <CardHeader className="border-b border-[#1E1E2E]/50">
            <CardTitle className="text-[10px] tracking-[0.3em]">SECURE_REPOSITORY</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0A0A0F] hover:bg-[#0A0A0F]">
                <TableRow className="border-[#1E1E2E] hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Document_ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project_Node</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Last_Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'RFI_9912_STRUCTURAL', type: 'RFI', node: 'PHOENIX_A', status: 'VERIFIED', sync: '14:22:01' },
                  { id: 'BIM_MODEL_V4_LOD400', type: 'MODEL', node: 'APOLLO_B', status: 'ACTIVE', sync: '12:05:44' },
                  { id: 'SPEC_08_GLASS_V2', type: 'SPEC', node: 'TITAN_SITE', status: 'AUDIT', sync: '09:15:22' },
                  { id: 'SITE_REPORT_W24', type: 'REPORT', node: 'ORION_OFFICE', status: 'VERIFIED', sync: 'Yesterday' },
                  { id: 'AS_BUILT_ELECTRICAL', type: 'BLUEPRINT', node: 'PHOENIX_A', status: 'PENDING', sync: '2 Days Ago' },
                ].map((doc, i) => (
                  <TableRow key={i} className="border-[#1E1E2E] hover:bg-white/5 transition-colors cursor-pointer group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-mono text-white/90 font-bold uppercase">{doc.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono text-muted-foreground uppercase">{doc.type}</TableCell>
                    <TableCell className="text-[10px] font-mono text-muted-foreground uppercase">{doc.node}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-1 rounded-full",
                          doc.status === 'VERIFIED' ? 'bg-primary' : doc.status === 'AUDIT' ? 'bg-yellow-500' : 'bg-muted-foreground'
                        )} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">{doc.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] font-mono text-muted-foreground uppercase">{doc.sync}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* RECENT DOWNLOADS / STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none">
            <CardHeader className="border-b border-[#1E1E2E]/50">
              <CardTitle className="text-[10px] tracking-[0.3em]">INTEGRITY_CHECK</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex items-center gap-4">
              <FileCode className="size-8 text-primary/40" />
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">99.9% VALIDATED</p>
                <p className="text-[8px] font-mono text-muted-foreground uppercase">Digital_Signature_Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#12121A] border-[#1E1E2E] rounded-none md:col-span-2">
            <CardHeader className="border-b border-[#1E1E2E]/50">
              <CardTitle className="text-[10px] tracking-[0.3em]">VERSION_CONTROL_STREAM</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto">
                <div className="flex items-center gap-8 min-w-max">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex flex-col gap-1">
                            <span className="text-[8px] font-mono text-muted-foreground uppercase">PATCH_00{i}</span>
                            <span className="text-[10px] font-bold text-primary uppercase">LATEST_MERGE</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
