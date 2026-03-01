'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';
import { 
  Database, 
  Layers, 
  Mail, 
  MessageSquare, 
  FileText, 
  Zap, 
  Target, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  ChevronRight, 
  Globe, 
  BarChart3, 
  Fingerprint, 
  MousePointerClick, 
  CheckCircle2, 
  MessageCircle, 
  Lock,
  Terminal,
  ArrowRight,
  Crosshair,
  Shield,
  Activity as Pulse,
  Eye,
  BrainCircuit,
  Settings,
  ShieldAlert,
  Smartphone,
  Server,
  Cloud,
  FileSearch
} from 'lucide-react';
import { EnvisionOSLogo } from "@/components/icons";

type Scenario = {
  query: string;
  answer: string;
  metric: string;
  meta: string;
  followUp?: { text: string; scenarioId: number }[];
};

type Scenarios = {
  [key: number]: Scenario;
};

const initialSuggestions = [
  { text: "AUDIT: Jobs off budget", scenarioId: 1 },
  { text: "STATUS: Flow Aventura CO", scenarioId: 2 },
  { text: "PROTOCOL: Data Integrity", scenarioId: 3 },
];

export default function DashboardPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState(initialSuggestions);
  const [messages, setMessages] = useState<any[]>([]);
  const [particleStyles, setParticleStyles] = useState<{ top: string, delay: string }[]>([]);
  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: 'Identify all active jobs exceeding budget thresholds.',
      answer: 'CRITICAL: Job 402 is 12.4% over variance. Dryer-wall rework identified as the primary cost driver. Subcontractor recovery protocols initiated.',
      metric: "MARGIN PROTECTION: $124,500 secured.",
      meta: 'SOURCE: sage_finance, procore_api',
      followUp: [
        { text: "GET: Cost Code 14-550", scenarioId: 4 },
        { text: "DRAFT: Recovery RFI", scenarioId: 5 },
      ]
    },
    2: {
      query: 'Current status of Certificate of Occupancy for Flow Aventura.',
      answer: 'ESTIMATED CO: MARCH 14. Fire safety systems verified by Aventura Inspector Davis at 10:42 AM. Schedule integrity remains nominal.',
      metric: "SCHEDULE_CONFIDENCE: 98.4%",
      meta: 'SOURCE: city_permit_logs, field_reports',
      followUp: [
          { text: "VIEW: Inspection Logs", scenarioId: 6},
          { text: "PING: Project Manager", scenarioId: 7}
      ]
    },
    3: {
      query: "Envision OS protocol vs. generic AI.",
      answer: 'PROTOCOL: Envision OS operates on verified multi-platform data fusion. We provide institutional-grade transparency through continuous audit cycles and deterministic grounding.',
      metric: "DATA_INTEGRITY: AES-256 + SOC2",
      meta: 'SYSTEM_POLICY: MISSION_CRITICAL',
      followUp: [
          { text: "AUDIT: Jobs off budget", scenarioId: 1 },
          { text: "STATUS: Flow Aventura CO", scenarioId: 2 },
      ]
    },
    4: {
        query: "Provide cost code data for rework.",
        answer: "COST_CODE: 14-550-3B-R01. Reconciled with prime contract budget line 42.",
        metric: "BUDGET_AUDIT_SYNC: COMPLETE",
        meta: "SOURCE: sage_intacct",
        followUp: [{ text: "TERMINATE_SESSION", scenarioId: 8 }]
    },
    8: {
        query: "TERMINATE_SESSION",
        answer: "SESSION_ENDED. Envision OS continues monitoring 23 platforms for institutional risk. Ready for next command.",
        metric: "",
        meta: "",
        followUp: initialSuggestions
    }
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const addMessage = useCallback((content: string, type: 'user' | 'system', meta = '', metric = '') => {
    setMessages(prev => [...prev, {content, type, meta, metric}])
  }, []);
  
  const addTyping = useCallback(() => {
    const id = 'typing-' + Date.now();
    setMessages(prev => [...prev, {id, type: 'typing'}]);
    return id;
  }, []);

  const runSimulation = useCallback(
    async (id: number) => {
      if (isRunning.current) return;
      isRunning.current = true;
      setSuggestedReplies([]);

      const data = scenarios[id];
      if (!data) {
          isRunning.current = false;
          setSuggestedReplies(initialSuggestions);
          return;
      }

      addMessage(data.query, 'user');
      await sleep(400);
      scrollToBottom();
      
      const typingId = addTyping();
      scrollToBottom();

      await sleep(1200);
      setMessages(prev => prev.filter(m => m.id !== typingId));

      addMessage(data.answer, 'system', data.meta, data.metric);
      
      scrollToBottom();
      await sleep(500);

      if (data.followUp) {
          setSuggestedReplies(data.followUp);
      } else {
          setSuggestedReplies(initialSuggestions);
      }

      isRunning.current = false;
    },
    [addMessage, addTyping, scrollToBottom]
  );
  
  useEffect(() => {
      if(messages.length === 0) {
        addMessage(
            "ENVISION_OS_CONNECTED_V3.1. ACTIVE MONITORING: 23 PLATFORM STREAMS ONLINE.",
            'system'
        );
      }
      
      setParticleStyles([...Array(10)].map((_, i) => ({
        top: `${15 + Math.random() * 70}%`,
        delay: `${i * 0.4}s`
      })));
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);
  
  useEffect(() => {
    const chartInstances: Chart[] = [];
    
    if (latencyChartRef.current) {
        const ctx = latencyChartRef.current.getContext('2d');
        if (ctx) {
            chartInstances.push(new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['MANUAL', 'LEGACY_CRM', 'ENVISION_OS'],
                    datasets: [{
                        label: 'DAYS_TO_VERIFY',
                        data: [45, 14, 0.01], 
                        backgroundColor: ['#1A1A1A', '#333333', '#007C5A'],
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#666', font: { family: 'JetBrains Mono', size: 10 } } },
                        y: { grid: { display: false }, ticks: { color: '#666', font: { family: 'JetBrains Mono', size: 10 } } }
                    }
                }
            }));
        }
    }
    
    if (coverageChartRef.current) {
        const ctx = coverageChartRef.current.getContext('2d');
        if (ctx) {
            chartInstances.push(new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['PROTECTED', 'RESIDUAL'],
                    datasets: [{
                        data: [98.2, 1.8],
                        backgroundColor: ['#007C5A', '#E2E8F0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '85%',
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    return () => chartInstances.forEach(chart => chart.destroy());
  }, []);

  return (
    <div className="flex flex-col w-full bg-white text-black overflow-x-hidden font-body selection:bg-primary/20">
      {/* TACTICAL NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2 font-black text-lg tracking-tighter uppercase">
          <EnvisionOSLogo className="size-6 text-primary" />
          ENVISION OS
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 font-mono">
          <a href="#command" className="hover:text-primary transition-colors">01_COMMAND</a>
          <a href="#ingestion" className="hover:text-primary transition-colors">02_INGEST</a>
          <a href="#fusion" className="hover:text-primary transition-colors">03_FUSION</a>
          <a href="#architecture" className="hover:text-primary transition-colors">04_ARCHITECTURE</a>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all font-mono">ACCESS_GATEWAY</button>
      </nav>

      {/* HERO SECTION - WHITE BLUEPRINT STYLE */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-20 text-center px-6 tactical-grid bg-white relative">
        <div className="relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-black/10 bg-black/5 text-[9px] font-black uppercase tracking-[0.4em] text-black/60 mb-10 font-mono rounded-full">
                <Shield className="size-3" />
                <span>INSTITUTIONAL_INTEL_SYSTEM_v3.1</span>
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.9] mb-12 uppercase text-black">
              Mission <br/><span className="text-primary underline decoration-4 underline-offset-8">Controlled</span> Data
            </h1>
            <p className="text-xl md:text-2xl text-black/50 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
              Turning fragmented project noise into <span className="text-black font-bold">verified institutional intelligence</span> with absolute accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="#command" className="bg-black text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-all font-mono flex items-center gap-3 shadow-xl">INITIALIZE_OS <ChevronRight className="size-4" /></a>
                <button className="px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all font-mono">READ_PROTOCOL</button>
            </div>
        </div>
      </section>

      {/* COMMAND CENTER - OBSIDIAN MISSION CONTROL WITH IMESSAGE */}
      <section id="command" className="py-40 bg-black text-white scroll-mt-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-24">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">// TACTICAL_INTERFACE</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase">Command Center</h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium">
            AI-driven project orchestration through a familiar, high-fidelity secure terminal interface.
          </p>
        </div>
        
        <div className="container mx-auto px-6 flex justify-center">
          <div className="w-full max-w-4xl h-[750px] bg-[#0A0A0A] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Smartphone className="size-5" />
                  </div>
                  <div>
                      <div className="font-bold text-sm text-white">Envision AI</div>
                      <div className="text-[9px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        SECURE_NODE_ONLINE
                      </div>
                  </div>
              </div>
              <div className="font-mono text-[9px] text-white/30 font-bold uppercase tracking-widest">
                  AES-256 ENCRYPTED
              </div>
            </div>
            
            <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col gap-6 bg-black" ref={chatBodyRef}>
              {messages.map((msg, index) => {
                  if (msg.type === 'typing') {
                    return (
                        <div key={msg.id} className="imessage-bubble imessage-system animate-pulse opacity-50 flex items-center gap-2">
                            <span className="size-1 bg-white/40 rounded-full"></span>
                            <span className="size-1 bg-white/40 rounded-full"></span>
                            <span className="size-1 bg-white/40 rounded-full"></span>
                        </div>
                    );
                  }
                  
                  const isUser = msg.type === 'user';
                  return (
                      <div key={index} className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                          <div className={`imessage-bubble ${isUser ? 'imessage-user' : 'imessage-system'}`}>
                              {msg.content}
                          </div>
                          {msg.metric && <div className="mt-2 text-[10px] text-primary font-black uppercase tracking-widest px-2 font-mono">{msg.metric}</div>}
                          {msg.meta && <div className="mt-1 text-[9px] text-white/20 font-bold uppercase tracking-widest px-2 font-mono">{msg.meta}</div>}
                      </div>
                  );
              })}
            </div>

            <div className="p-8 border-t border-white/5 bg-black/50 backdrop-blur-xl z-20">
                <div className="flex flex-wrap gap-3 justify-center">
                    {suggestedReplies.map((reply, index) => (
                        <button
                            key={index}
                            className="px-6 py-2.5 bg-white/5 text-white/60 hover:bg-primary hover:text-white border border-white/10 rounded-full text-[10px] font-black tracking-widest transition-all font-mono uppercase"
                            onClick={() => runSimulation(reply.scenarioId)}
                            disabled={isRunning.current}
                        >
                            {reply.text}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SENSOR INGESTION - WHITE TECHNICAL FLOW */}
      <section id="ingestion" className="py-40 bg-white border-y border-black/5 scroll-mt-20 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">// SENSOR_INGESTION_PIPELINE</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase text-black">Data <br/> Ingestion</h2>
            <p className="text-lg text-black/50 mb-12 leading-relaxed font-medium">
              Capturing fragmented project telemetry across 23 platforms and mapping them into a unified, high-fidelity intelligence stream.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 border border-black/5 bg-black/2 rounded-2xl group hover:border-primary/30 transition-all">
                    <Cloud className="size-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-base mb-2 text-black uppercase tracking-widest font-mono">Stream Mining</h4>
                    <p className="text-xs text-black/40 leading-relaxed font-bold">Real-time parsing of fragmented data with institutional precision.</p>
                </div>
                <div className="p-8 border border-black/5 bg-black/2 rounded-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-1.5 rounded-full bg-primary animate-ping"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black font-mono">NORMALIZING_AV4</span>
                    </div>
                    <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-2/3"></div>
                    </div>
                </div>
            </div>
          </div>
          <div className="flex-1 w-full">
              <div className="w-full border border-black/10 bg-black/[0.02] p-8 md:p-12 h-[500px] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="flex flex-col gap-6 w-full md:w-1/3 z-10">
                    {[
                        { label: 'HASH_8812', icon: Mail, delay: '0s' },
                        { label: 'PDF_X8', icon: FileSearch, delay: '1s' },
                        { label: 'SAGE_LOG', icon: Activity, delay: '2s' },
                        { label: 'SLACK_ID', icon: MessageSquare, delay: '3s' }
                    ].map((s, i) => (
                        <div key={i} className="px-5 py-4 border border-black/5 bg-white/50 backdrop-blur-md rounded-xl animate-fly-in flex items-center justify-between group" style={{ animationDelay: s.delay }}>
                            <div className="flex items-center gap-3">
                                <s.icon className="size-3.5 text-black/40" />
                                <span className="text-[9px] font-black text-black font-mono">{s.label}</span>
                            </div>
                            <div className="size-1 rounded-full bg-primary"></div>
                        </div>
                    ))}
                </div>

                <div className="relative flex items-center justify-center z-20">
                    <div className="size-32 bg-white border border-black/10 flex flex-col items-center justify-center shadow-2xl relative rounded-3xl group pulse-ring">
                        <Cpu className="size-10 text-primary mb-2" />
                        <span className="text-[8px] font-black tracking-[0.3em] text-black/40 uppercase font-mono">AI_PARSER</span>
                        
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
                            {particleStyles.map((style, i) => (
                                <div 
                                    key={i} 
                                    className="absolute size-1.5 bg-primary/40 rounded-full blur-[1px] animate-fly-in" 
                                    style={{ 
                                        animationDelay: style.delay, 
                                        top: style.top,
                                        left: '-50px',
                                        width: '100px'
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 z-10 w-full md:w-1/3 items-end">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 bg-primary/20 rounded-full w-full max-w-[140px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
                        </div>
                    ))}
                    <div className="mt-6 px-6 py-2.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.4em] font-mono flex items-center gap-2 rounded-full shadow-lg">
                        <ShieldCheck className="size-3.5" />
                        TRUTH_SYNC
                    </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* CONTEXT FUSION - OBSIDIAN STORYTELLING */}
      <section id="fusion" className="py-40 bg-black text-white scroll-mt-20 relative">
        <div className="container mx-auto px-6 text-center mb-32">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">// CONTEXT_FUSION_PROTOCOL</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase">Context Fusion</h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminating blind spots by cross-referencing thousands of multi-platform signals to verify institutional decisions.
          </p>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                <div className="space-y-6">
                    {[
                        { label: "OAC_RECORD", text: "Lobby upgrade authorization confirmed.", icon: MessageCircle, delay: "0s" },
                        { label: "SLACK_SYNC", text: "Marble lead time: 4 weeks verified.", icon: MessageSquare, delay: "0.2s" },
                        { label: "EMAIL_INTEL", text: "Shipment status confirmed by PM.", icon: Mail, delay: "0.4s" }
                    ].map((s, i) => (
                        <div key={i} className="p-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl animate-in slide-in-from-left duration-1000" style={{ animationDelay: s.delay }}>
                            <div className="flex items-center gap-3 mb-3">
                                <s.icon className="size-4 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary font-mono">{s.label}</span>
                            </div>
                            <p className="text-base text-white/80 font-bold italic">"{s.text}"</p>
                        </div>
                    ))}
                </div>

                <div className="relative flex items-center justify-center min-h-[300px]">
                    <div className="size-40 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(0,124,90,0.3)] z-10">
                        <BrainCircuit className="size-16 text-primary" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center -z-0">
                        <div className="size-[400px] border border-white/5 rounded-full animate-pulse opacity-20"></div>
                        <div className="size-[250px] border border-primary/20 rounded-full animate-ping opacity-10"></div>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <div className="p-10 border-2 border-primary bg-black shadow-2xl rounded-[32px] max-w-sm w-full animate-in zoom-in duration-1000">
                        <div className="flex items-center gap-3 mb-8 text-primary">
                            <ShieldCheck className="size-6" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">VERIFIED_TRUTH</span>
                        </div>
                        <h4 className="text-3xl font-black mb-10 tracking-tighter text-white uppercase leading-none">Lobby Upgrade</h4>
                        <div className="space-y-6 border-t border-white/10 pt-8 font-mono">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-white/40 uppercase font-bold">STATUS</span>
                                <span className="text-primary font-black">AUTHORIZED</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-white/40 uppercase font-bold">CONFIDENCE</span>
                                <span className="text-white font-black text-xl">99.2%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ARCHITECTURE - WHITE BLUEPRINT */}
      <section id="architecture" className="py-40 bg-white border-t border-black/5 scroll-mt-20">
        <div className="container mx-auto px-6 text-center mb-28">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">// SYSTEM_ARCHITECTURE</span>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-black uppercase">Telemetry Fabric</h2>
          <p className="text-lg text-black/50 max-w-2xl mx-auto font-medium">
            High-fidelity institutional nervous system mapping multi-platform telemetry into unified project intelligence.
          </p>
        </div>
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="arch-stack space-y-4">
                {[
                    { id: "L4: ACTION", name: "GATEWAY", desc: "Real-time orchestration across 23 platforms with absolute verification.", icon: Eye },
                    { id: "L3: LOGIC", name: "HEURISTIC", desc: "Vector reasoning across project layers for mission-critical signal validation.", icon: BrainCircuit },
                    { id: "L2: MEMORY", name: "CONTEXT", desc: "Unified high-frequency project memory for deterministic data grounding.", icon: Database },
                    { id: "L1: TRUTH", name: "IMMUTABLE", desc: "Sovereign data core secured via SOC2 and isolated high-end encryption.", icon: Fingerprint }
                ].map((layer, i) => (
                    <div key={i} className="stack-layer p-8 border border-black/5 bg-white shadow-xl flex items-center gap-8 group hover:border-primary/50 cursor-pointer rounded-2xl">
                        <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <layer.icon className="size-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] font-mono mb-1 block">{layer.id}</span>
                            <h4 className="text-xl font-black text-black uppercase tracking-widest font-mono">{layer.name}</h4>
                            <p className="text-[11px] text-black/40 font-bold leading-relaxed">{layer.desc}</p>
                        </div>
                        <ArrowRight className="size-5 text-black/20 group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* METRICS - OBSIDIAN WAR ROOM */}
      <section className="py-40 bg-black text-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 border border-white/5 bg-white/[0.02] p-12 md:p-16 rounded-[40px]">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                      <div>
                          <h3 className="text-4xl font-black mb-4 flex items-center gap-4 text-white uppercase font-mono"><BarChart3 className="text-primary size-8" /> AUDIT_VELOCITY</h3>
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Time to identify project variance.</p>
                      </div>
                      <div className="text-right">
                          <p className="text-8xl font-black text-primary tracking-tighter leading-none font-mono">0.01s</p>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 font-mono">LEGACY: 14_DAYS</p>
                      </div>
                  </div>
                  <div className="h-[400px] w-full"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="border border-white/5 bg-white/[0.02] p-12 md:p-16 flex flex-col items-center justify-center text-center rounded-[40px]">
                  <div className="size-20 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary mb-10 border border-primary/20 shadow-2xl"><Lock className="size-10" /></div>
                  <h3 className="text-[10px] font-black mb-12 uppercase tracking-[0.5em] text-primary font-mono">GOVERNANCE_PROTOCOL</h3>
                  <div className="relative size-60 mb-12">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-6xl font-black text-white leading-none font-mono">98%</span>
                          <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-4 font-mono">PROTECTED</span>
                      </div>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 text-left w-full rounded-3xl">
                      <div className="flex items-center gap-3 mb-4">
                          <ShieldAlert className="size-4 text-primary" />
                          <h4 className="text-base font-black text-white uppercase tracking-widest font-mono">DLP Enforcement</h4>
                      </div>
                      <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase">Sovereign data integrity and RBAC enforced at every project node. Continuous compliance audit cycles.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-black/5 py-32 text-center">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 font-black text-2xl tracking-tighter uppercase mb-6">
            <EnvisionOSLogo className="size-8 text-primary" />
            ENVISION OS
          </div>
          <p className="max-w-xl mx-auto text-black/50 text-lg font-bold mb-12 leading-relaxed tracking-tight uppercase">Unified Source of Truth for Institutional Assets.</p>
          <div className="inline-block px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] font-mono rounded-full">
            PROTOCOL_ACTIVE: MISSION_CRITICAL
          </div>
        </div>
      </footer>
    </div>
  );
}
