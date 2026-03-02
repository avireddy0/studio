'use client';

import React from 'react';
import { Map as MapIcon, FileText, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ANALYSES = [
  { id: 'Zoning & Land Use Analysis', cat: 'Regulatory', status: 'COMPLETE', date: 'Feb 12' },
  { id: 'Phase I Environmental (ESA)', cat: 'Environmental', status: 'COMPLETE', date: 'Feb 18' },
  { id: 'Geotechnical Report', cat: 'Engineering', status: 'COMPLETE', date: 'Feb 22' },
  { id: 'Title & Survey Review', cat: 'Legal', status: 'COMPLETE', date: 'Jan 30' },
  { id: 'Market Feasibility Study', cat: 'Financial', status: 'COMPLETE', date: 'Feb 25' },
  { id: 'Financial Pro Forma', cat: 'Financial', status: 'COMPLETE', date: 'Feb 28' },
  { id: 'Traffic Impact Study', cat: 'Engineering', status: 'IN REVIEW', date: 'Mar 01' },
  { id: 'CEQA Initial Study', cat: 'Environmental', status: 'PENDING', date: '—' },
] as const;

export function FeasibilitySection() {
  return (
    <>
      <div className="flex items-center gap-3 shrink-0">
        <MapIcon className="size-4 text-primary" />
        <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">06_Accelerated_Feasibility</h2>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-3 md:gap-6">
        {/* ═══ SITE FEASIBILITY MAP ═══ */}
        <Card className="bg-[#12121A] border-[#1E1E2E] relative overflow-hidden flex-1 min-h-0 md:min-h-[250px]">
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 relative z-20 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <CardTitle className="text-[10px] tracking-[0.3em]">Site_Feasibility_Map</CardTitle>
              </div>
              <span className="text-[8px] font-mono text-primary/70 uppercase hidden sm:inline">34.0522°N | 118.2437°W · DTLA</span>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative h-full overflow-hidden">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-118.2475,34.0495,-118.2395,34.0555&bboxSR=4326&size=1600,800&format=png&f=image"
                alt="Aerial site view"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
              {/* Dark tactical tint */}
              <div className="absolute inset-0 bg-[#0A0A0F]/60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/40 via-transparent to-[#0A0A0F]/50" />

              <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Tactical grid overlay */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <g key={`g-${i}`}>
                    <line x1={i * 40} y1={0} x2={i * 40} y2={400} stroke="rgba(0,124,90,0.12)" strokeWidth="0.5" />
                    <line x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(0,124,90,0.12)" strokeWidth="0.5" />
                  </g>
                ))}

                {/* ─── KPI Summary Bar ─── */}
                <rect x={12} y={8} width={295} height={44} rx={6} fill="rgba(6,6,10,0.92)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={22} y={22} fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">PARCEL</text>
                <text x={22} y={38} fill="rgba(255,255,255,0.95)" fontSize="12" fontFamily="monospace" fontWeight="bold">16,000</text>
                <text x={68} y={38} fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace">sf</text>
                <line x1={88} y1={14} x2={88} y2={46} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={98} y={22} fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">BUILDABLE</text>
                <text x={98} y={38} fill="#007C5A" fontSize="12" fontFamily="monospace" fontWeight="bold">96,000</text>
                <text x={148} y={38} fill="rgba(0,124,90,0.6)" fontSize="7" fontFamily="monospace">sf</text>
                <line x1={170} y1={14} x2={170} y2={46} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={180} y={22} fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">EST. UNITS</text>
                <text x={180} y={38} fill="rgba(255,255,255,0.95)" fontSize="12" fontFamily="monospace" fontWeight="bold">142</text>
                <line x1={220} y1={14} x2={220} y2={46} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={230} y={22} fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace" letterSpacing="0.5">PARKING REQ</text>
                <text x={230} y={38} fill="rgba(255,255,255,0.95)" fontSize="12" fontFamily="monospace" fontWeight="bold">192</text>
                <text x={262} y={38} fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace">stalls</text>

                {/* ─── SUBJECT SITE ─── */}
                <rect x={270} y={90} width={140} height={100} rx={4} fill="rgba(0,124,90,0.1)" stroke="rgba(0,124,90,0.6)" strokeWidth="1.5" />
                {/* Setback envelope */}
                <rect x={280} y={100} width={120} height={80} rx={2} fill="none" stroke="rgba(0,124,90,0.25)" strokeWidth="0.75" strokeDasharray="3 2" />
                {/* Setback labels */}
                <text x={340} y={97} fill="rgba(0,124,90,0.45)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">{"10' FRONT"}</text>
                <text x={340} y={187} fill="rgba(0,124,90,0.45)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">{"15' REAR"}</text>
                <text x={273} y={145} fill="rgba(0,124,90,0.45)" fontSize="4.5" fontFamily="monospace" textAnchor="middle" transform="rotate(-90, 273, 145)">{"6' SIDE"}</text>
                <text x={407} y={145} fill="rgba(0,124,90,0.45)" fontSize="4.5" fontFamily="monospace" textAnchor="middle" transform="rotate(90, 407, 145)">{"6' SIDE"}</text>
                {/* Site label */}
                <text x={340} y={130} fill="rgba(0,124,90,1)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SUBJECT SITE</text>
                <text x={340} y={142} fill="rgba(0,124,90,0.65)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">APN 0412-031-001</text>
                <text x={340} y={153} fill="rgba(0,124,90,0.5)" fontSize="6" fontFamily="monospace" textAnchor="middle">{"16,000 sf \u00B7 0.37 ac"}</text>
                {/* Active pulse */}
                <rect x={270} y={90} width={140} height={100} rx={4} fill="none" stroke="rgba(0,124,90,0.15)" strokeWidth="3">
                  <animate attributeName="stroke-opacity" values="0.15;0.03;0.15" dur="3s" repeatCount="indefinite" />
                </rect>

                {/* ─── Zoning & Entitlement Card ─── */}
                <line x1={340} y1={190} x2={340} y2={198} stroke="rgba(0,124,90,0.3)" strokeWidth="0.75" />
                <rect x={270} y={198} width={200} height={82} rx={5} fill="rgba(6,6,10,0.92)" stroke="rgba(0,124,90,0.3)" strokeWidth="0.75" />
                <rect x={270} y={198} width={200} height={2.5} rx={1} fill="#007C5A" />
                <text x={280} y={214} fill="rgba(255,255,255,0.9)" fontSize="7.5" fontFamily="monospace" fontWeight="bold">Zoning Analysis</text>
                <rect x={375} y={206} width={50} height={12} rx={6} fill="rgba(0,124,90,0.15)" stroke="rgba(0,124,90,0.4)" strokeWidth="0.5" />
                <text x={400} y={215} fill="#007C5A" fontSize="5.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">FEASIBLE</text>
                <text x={280} y={228} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Zone</text>
                <text x={320} y={228} fill="rgba(255,255,255,0.8)" fontSize="5.5" fontFamily="monospace">C2-2D-O (Commercial)</text>
                <text x={280} y={239} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">FAR</text>
                <text x={320} y={239} fill="rgba(255,255,255,0.8)" fontSize="5.5" fontFamily="monospace">{"6:1 \u2192 96,000 sf buildable"}</text>
                <text x={280} y={250} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Height</text>
                <text x={320} y={250} fill="rgba(255,255,255,0.8)" fontSize="5.5" fontFamily="monospace">395 ft max (30 stories)</text>
                <text x={280} y={261} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Use</text>
                <text x={320} y={261} fill="rgba(255,255,255,0.8)" fontSize="5.5" fontFamily="monospace">Mixed-Use (B/R-2)</text>
                <text x={280} y={272} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Seismic</text>
                <text x={320} y={272} fill="rgba(255,255,255,0.8)" fontSize="5.5" fontFamily="monospace">{"Category D \u00B7 Type IA const."}</text>

                {/* ─── Adjacent Parcels ─── */}
                <rect x={440} y={110} width={95} height={75} rx={3} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
                <text x={488} y={145} fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace" textAnchor="middle">ADJ. PARCEL</text>
                <text x={488} y={155} fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="monospace" textAnchor="middle">0412-032</text>

                <rect x={170} y={220} width={80} height={65} rx={3} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
                <text x={210} y={250} fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="monospace" textAnchor="middle">ADJ. PARCEL</text>
                <text x={210} y={260} fill="rgba(255,255,255,0.18)" fontSize="5" fontFamily="monospace" textAnchor="middle">0413-008</text>

                {/* ─── Parking Site — Flagged ─── */}
                <rect x={490} y={240} width={130} height={85} rx={3} fill="rgba(245,158,11,0.04)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.75" strokeDasharray="4 2" />
                <text x={555} y={278} fill="rgba(245,158,11,0.5)" fontSize="6" fontFamily="monospace" textAnchor="middle">PARKING SITE</text>
                <text x={555} y={288} fill="rgba(245,158,11,0.35)" fontSize="5" fontFamily="monospace" textAnchor="middle">0412-045</text>
                <circle cx={555} cy={295} r={3} fill="#f59e0b" opacity="0.6" />
                <circle cx={555} cy={295} r={3} fill="#f59e0b">
                  <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Parking constraint card */}
                <line x1={555} y1={325} x2={555} y2={330} stroke="rgba(245,158,11,0.25)" strokeWidth="0.75" />
                <rect x={490} y={330} width={165} height={48} rx={5} fill="rgba(6,6,10,0.9)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.75" />
                <rect x={490} y={330} width={165} height={2} rx={1} fill="#f59e0b" />
                <text x={500} y={345} fill="rgba(255,255,255,0.8)" fontSize="7" fontFamily="monospace" fontWeight="bold">Parking Analysis</text>
                <rect x={605} y={337} width={42} height={12} rx={6} fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="0.5" />
                <text x={626} y={346} fill="#f59e0b" fontSize="5.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AT RISK</text>
                <text x={500} y={358} fill="rgba(245,158,11,0.55)" fontSize="5.5" fontFamily="monospace">{"Ratio deficit -12% \u00B7 Variance required"}</text>
                <text x={500} y={367} fill="rgba(245,158,11,0.4)" fontSize="5.5" fontFamily="monospace">{"192 req / 169 provided \u2192 23 short"}</text>

                {/* Background structures */}
                <rect x={110} y={70} width={55} height={45} rx={2} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <rect x={600} y={55} width={80} height={50} rx={2} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <rect x={650} y={280} width={60} height={45} rx={2} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                {/* Study area boundary */}
                <rect x={155} y={60} width={400} height={250} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="8 4" rx={4} />
                <text x={160} y={55} fill="rgba(255,255,255,0.2)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.5">FEASIBILITY STUDY AREA</text>

                {/* Coordinates */}
                <text x={12} y={393} fill="rgba(255,255,255,0.15)" fontSize="6.5" fontFamily="monospace">{"34.0522\u00B0N, 118.2437\u00B0W"}</text>
                <text x={710} y={393} fill="rgba(255,255,255,0.15)" fontSize="6.5" fontFamily="monospace">DTLA, CA</text>

                {/* Legend */}
                <rect x={620} y={8} width={170} height={44} rx={6} fill="rgba(6,6,10,0.9)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <rect x={632} y={18} width={6} height={6} rx={1} fill="rgba(0,124,90,0.3)" stroke="rgba(0,124,90,0.6)" strokeWidth="0.5" />
                <text x={643} y={24} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Subject Site</text>
                <rect x={710} y={18} width={6} height={6} rx={1} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                <text x={721} y={24} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Adjacent</text>
                <rect x={632} y={34} width={6} height={6} rx={1} fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.5" />
                <text x={643} y={40} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Flagged</text>
                <line x1={710} y1={37} x2={728} y2={37} stroke="rgba(0,124,90,0.25)" strokeWidth="0.75" strokeDasharray="3 2" />
                <text x={733} y={40} fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace">Setback</text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* ═══ FEASIBILITY ANALYSES ═══ */}
        <Card className="bg-[#12121A] border-[#1E1E2E] overflow-hidden flex-1 min-h-0 md:min-h-[250px] flex flex-col">
          <CardHeader className="border-b border-[#1E1E2E]/50 bg-[#0A0A0F]/50 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] tracking-[0.3em]">Feasibility_Analyses</CardTitle>
              <div className="flex items-center gap-3 text-[8px] font-mono hidden sm:flex">
                <span className="text-primary">6 Complete</span>
                <span className="text-white/20">|</span>
                <span className="text-yellow-500/80">1 In Review</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40">1 Pending</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto no-scrollbar">
            <Table>
              <TableHeader className="bg-[#0A0A0F] sticky top-0 z-10">
                <TableRow className="border-[#1E1E2E] hover:bg-transparent">
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Analysis</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ANALYSES.map((doc, i) => (
                  <TableRow key={i} className="border-[#1E1E2E] hover:bg-white/5 transition-colors cursor-pointer group">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="size-3 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
                        <span className="text-[10px] font-mono text-white/90 font-medium">{doc.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">{doc.cat}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-1.5 rounded-full",
                          doc.status === 'COMPLETE' ? 'bg-primary' :
                          doc.status === 'IN REVIEW' ? 'bg-yellow-500' :
                          'bg-white/20'
                        )} />
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          doc.status === 'COMPLETE' ? 'text-primary/80' :
                          doc.status === 'IN REVIEW' ? 'text-yellow-500/80' :
                          'text-white/40'
                        )}>{doc.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[9px] font-mono text-muted-foreground">{doc.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
