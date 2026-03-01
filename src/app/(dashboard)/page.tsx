'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';
import { 
  Database, 
  Mail, 
  MessageSquare, 
  Activity, 
  Cpu, 
  ChevronRight, 
  BarChart3, 
  Fingerprint, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Shield,
  BrainCircuit,
  ShieldAlert,
  Smartphone,
  Cloud,
  FileSearch,
  Crosshair,
  Terminal,
  Eye,
  Layers,
  Zap,
  Target,
  CheckCircle2,
  MessageCircle
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
      metric: "MARGIN PROTECTION: $124,500 SECURED.",
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
            "ENVISION_OS_V3.1_NODE_CONNECTED. MISSION_CRITICAL_MODE_ACTIVE.",
            'system'
        );
      }
      
      setParticleStyles([...Array(10)].map((_, i) => ({
        top: `${15 + Math.random() * 70}%`,
        delay: `${i * 0.35}s`
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
    <div className="flex flex-col w-full bg-white text-black overflow-x-hidden font-sans selection:bg-primary/20">
      {/* MISSION CRITICAL NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-black/5 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tighter uppercase">
          <EnvisionOSLogo className="size-6 text-primary" />
          ENVISION OS
        </div>
        <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 font-mono">
          <a href="#command" className="hover:text-primary transition-colors flex items-center gap-2">01<span className="opacity-40">/</span>COMMAND</a>
          <a href="#ingestion" className="hover:text-primary transition-colors flex items-center gap-2">02<span className="opacity-40">/</span>INGEST</a>
          <a href="#fusion" className="hover:text-primary transition-colors flex items-center gap-2">03<span className="opacity-40">/</span>FUSION</a>
          <a href="#architecture" className="hover:text-primary transition-colors flex items-center gap-2">04<span className="opacity-40">/</span>FABRIC</a>
        </div>
        <div className="flex items-center gap-4">
            <span className="hidden md:block text-[9px] font-bold text-black/20 font-mono tracking-widest uppercase">NODE_8812_SECURE</span>
            <button className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all font-mono">ACCESS_GATEWAY</button>
        </div>
      </nav>

      {/* HERO SECTION - TACTICAL BLUEPRINT */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-20 text-center px-6 tactical-grid bg-white relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] border border-black/5 rounded-full -z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] border border-black/[0.02] rounded-full -z-0"></div>
        
        <div className="relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-black/10 bg-black/5 text-[10px] font-bold uppercase tracking-[0.5em] text-black/60 mb-12 font-mono rounded-sm">
                <Crosshair className="size-3.5 text-primary" />
                <span>INSTITUTIONAL_INTEL_SYSTEM_v3.1</span>
            </div>
            <h1 className="text-6xl md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-14 uppercase text-black">
              Verified <br/><span className="text-primary">Profit</span> Core
            </h1>
            <p className="text-xl md:text-2xl text-black/40 max-w-3xl mx-auto leading-relaxed mb-20 font-medium">
              Eliminating fragmented project noise with <span className="text-black font-bold">institutional-grade accuracy</span> and verified multi-platform data fusion.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center font-mono">
                <a href="#command" className="bg-black text-white px-12 py-5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-3 shadow-2xl">INITIALIZE_OS <ArrowRight className="size-4" /></a>
                <button className="px-12 py-5 rounded-sm text-[11px] font-bold uppercase tracking-widest border border-black/10 hover:bg-black/5 transition-all">PROTOCOL_AUDIT</button>
            </div>
        </div>
        
        {/* CORNER DECORATIONS */}
        <div className="absolute top-24 left-10 text-[9px] font-bold text-black/10 font-mono tracking-[0.2em] hidden md:block">LAT_40.7128_LON_-74.0060</div>
        <div className="absolute top-24 right-10 text-[9px] font-bold text-black/10 font-mono tracking-[0.2em] hidden md:block">TRUTH_VERIFIED_8.1.1</div>
      </section>

      {/* COMMAND CENTER - SECURE MISSION CONTROL */}
      <section id="command" className="py-48 bg-black text-white scroll-mt-20 overflow-hidden relative">
        <div className="absolute inset-0 tactical-grid opacity-20 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 text-center mb-32 relative z-10">
          <span className="text-primary text-[11px] font-bold uppercase tracking-[0.6em] mb-6 block font-mono">// SECURE_OS_TERMINAL</span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 uppercase">Command Center</h2>
          <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-driven project orchestration through a familiar, high-fidelity secure operating interface.
          </p>
        </div>
        
        <div className="container mx-auto px-6 flex justify-center relative z-20">
          <div className="w-full max-w-5xl h-[800px] bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-3xl overflow-hidden flex flex-col relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/80 backdrop-blur-2xl">
              <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Smartphone className="size-6" />
                  </div>
                  <div>
                      <div className="font-bold text-base text-white tracking-tight">Envision OS AI</div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] flex items-center gap-2 font-mono">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        SECURE_NODE_CONNECTED
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-8">
                  <div className="hidden lg:block text-right">
                      <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">SESSION_ID</div>
                      <div className="text-[10px] text-white/60 font-bold font-mono">TX_99-102-X</div>
                  </div>
                  <div className="font-mono text-[10px] text-primary/40 font-bold uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-sm">
                      AES-256
                  </div>
              </div>
            </div>
            
            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col gap-8 bg-black/40" ref={chatBodyRef}>
              {messages.map((msg, index) => {
                  if (msg.type === 'typing') {
                    return (
                        <div key={msg.id} className="imessage-bubble imessage-system opacity-40 flex items-center gap-2">
                            <span className="size-1.5 bg-white/40 rounded-full animate-bounce"></span>
                            <span className="size-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="size-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    );
                  }
                  
                  const isUser = msg.type === 'user';
                  return (
                      <div key={index} className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                          <div className={`imessage-bubble ${isUser ? 'imessage-user' : 'imessage-system'}`}>
                              {msg.content}
                          </div>
                          {msg.metric && <div className="mt-3 text-[11px] text-primary font-bold uppercase tracking-[0.3em] px-3 font-mono">{msg.metric}</div>}
                          {msg.meta && <div className="mt-1 text-[10px] text-white/20 font-bold uppercase tracking-widest px-3 font-mono">{msg.meta}</div>}
                      </div>
                  );
              })}
            </div>

            <div className="p-10 border-t border-white/5 bg-black/80 backdrop-blur-2xl">
                <div className="flex flex-wrap gap-4 justify-center">
                    {suggestedReplies.map((reply, index) => (
                        <button
                            key={index}
                            className="px-8 py-3.5 bg-white/5 text-white/50 hover:bg-primary hover:text-white border border-white/10 rounded-sm text-[11px] font-bold tracking-[0.2em] transition-all font-mono uppercase"
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

      {/* SENSOR INGESTION - TECHNICAL BLUEPRINT */}
      <section id="ingestion" className="py-48 bg-white border-y border-black/5 scroll-mt-20 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-24 relative z-10">
          <div className="flex-1">
            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.6em] mb-6 block font-mono">// SENSOR_INGESTION_FLOW</span>
            <h2 className="text-6xl md:text-[7rem] font-bold tracking-tighter mb-10 leading-none uppercase text-black">Data <br/> Ingestion</h2>
            <p className="text-xl text-black/40 mb-14 leading-relaxed font-medium">
              Capturing fragmented project telemetry across 23 platforms and mapping them into a unified, high-fidelity intelligence stream.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono">
                <div className="p-10 border border-black/5 bg-black/[0.02] rounded-sm group hover:border-primary/40 transition-all">
                    <Cloud className="size-10 text-primary mb-8 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-lg mb-3 text-black uppercase tracking-widest">Stream Mining</h4>
                    <p className="text-[11px] text-black/30 leading-relaxed font-bold uppercase tracking-widest">Real-time parsing of fragmented data with institutional precision.</p>
                </div>
                <div className="p-10 border border-black/5 bg-black/[0.02] rounded-sm flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-2 rounded-full bg-primary animate-ping"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">NORMALIZING_TEL_V4</span>
                    </div>
                    <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-3/4"></div>
                    </div>
                    <div className="mt-4 flex justify-between text-[9px] font-bold text-black/20 tracking-widest">
                        <span>SYNC_INIT</span>
                        <span>88.4%</span>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
              <div className="w-full border border-black/10 bg-black/[0.01] p-10 md:p-16 h-[550px] rounded-sm flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 tactical-grid opacity-20"></div>
                
                <div className="flex flex-col gap-8 w-full md:w-1/3 z-10">
                    {[
                        { label: 'HASH_88A', icon: Mail, delay: '0s' },
                        { label: 'PDF_DOC_X', icon: FileSearch, delay: '1s' },
                        { label: 'SAGE_LOG', icon: Activity, delay: '2s' },
                        { label: 'SLACK_ID', icon: MessageSquare, delay: '3s' }
                    ].map((s, i) => (
                        <div key={i} className="px-6 py-5 border border-black/5 bg-white shadow-sm rounded-sm animate-fly-in-technical flex items-center justify-between group" style={{ animationDelay: s.delay }}>
                            <div className="flex items-center gap-4">
                                <s.icon className="size-4 text-black/40" />
                                <span className="text-[10px] font-bold text-black font-mono tracking-widest uppercase">{s.label}</span>
                            </div>
                            <div className="size-1.5 rounded-full bg-primary"></div>
                        </div>
                    ))}
                </div>

                <div className="relative flex items-center justify-center z-20">
                    <div className="size-40 bg-white border border-black/10 flex flex-col items-center justify-center shadow-2xl relative rounded-sm group pulse-ring">
                        <Cpu className="size-12 text-primary mb-3" />
                        <span className="text-[9px] font-bold tracking-[0.4em] text-black/40 uppercase font-mono">AI_PARSER</span>
                        
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
                            {particleStyles.map((style, i) => (
                                <div 
                                    key={i} 
                                    className="absolute size-2 bg-primary/20 rounded-full blur-[2px] animate-fly-in-technical" 
                                    style={{ 
                                        animationDelay: style.delay, 
                                        top: style.top,
                                        left: '-80px',
                                        width: '160px'
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 z-10 w-full md:w-1/3 items-end font-mono">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 bg-primary/10 rounded-full w-full max-w-[160px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
                        </div>
                    ))}
                    <div className="mt-8 px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.5em] flex items-center gap-3 rounded-sm shadow-xl">
                        <ShieldCheck className="size-4" />
                        TRUTH_SYNC
                    </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* CONTEXT FUSION - MISSION CRITICAL STORYTELLING */}
      <section id="fusion" className="py-48 bg-black text-white scroll-mt-20 relative">
        <div className="absolute inset-0 tactical-grid opacity-20"></div>
        
        <div className="container mx-auto px-6 text-center mb-40 relative z-10">
          <span className="text-primary text-[11px] font-bold uppercase tracking-[0.6em] mb-6 block font-mono">// CONTEXT_FUSION_PROTOCOL</span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 uppercase">Context Fusion</h2>
          <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminating blind spots by cross-referencing multi-platform signals to verify mission-critical institutional decisions.
          </p>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                <div className="space-y-8 font-mono">
                    {[
                        { label: "OAC_RECORD", text: "Lobby upgrade authorization confirmed.", icon: MessageCircle, delay: "0s" },
                        { label: "SLACK_SYNC", text: "Marble lead time: 4 weeks verified.", icon: MessageSquare, delay: "0.2s" },
                        { label: "EMAIL_INTEL", text: "Shipment status confirmed by PM.", icon: Mail, delay: "0.4s" }
                    ].map((s, i) => (
                        <div key={i} className="p-10 border border-white/10 bg-white/[0.03] backdrop-blur-3xl rounded-sm animate-in slide-in-from-left duration-1000" style={{ animationDelay: s.delay }}>
                            <div className="flex items-center gap-4 mb-4">
                                <s.icon className="size-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{s.label}</span>
                            </div>
                            <p className="text-lg text-white/90 font-medium italic tracking-tight leading-relaxed">"{s.text}"</p>
                        </div>
                    ))}
                </div>

                <div className="relative flex items-center justify-center min-h-[400px]">
                    <div className="size-48 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(0,124,90,0.2)] z-10 animate-data-pulse">
                        <BrainCircuit className="size-20 text-primary" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center -z-0">
                        <div className="size-[500px] border border-white/5 rounded-full animate-pulse opacity-10"></div>
                        <div className="size-[350px] border border-primary/20 rounded-full animate-ping opacity-5"></div>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <div className="p-12 border-2 border-primary bg-black shadow-3xl rounded-sm max-w-md w-full animate-in zoom-in duration-1000">
                        <div className="flex items-center gap-4 mb-10 text-primary">
                            <ShieldCheck className="size-8" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.5em] font-mono">VERIFIED_TRUTH</span>
                        </div>
                        <h4 className="text-4xl font-bold mb-12 tracking-tighter text-white uppercase leading-none">Lobby Upgrade</h4>
                        <div className="space-y-8 border-t border-white/10 pt-10 font-mono">
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-white/40 uppercase font-bold tracking-widest">STATUS</span>
                                <span className="text-primary font-bold tracking-widest">AUTHORIZED</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-white/40 uppercase font-bold tracking-widest">CONFIDENCE</span>
                                <span className="text-white font-bold text-2xl tracking-tighter">99.2%</span>
                            </div>
                        </div>
                        <div className="mt-12 p-4 bg-primary/5 border border-primary/20 rounded-sm">
                            <p className="text-[9px] text-primary font-bold uppercase tracking-[0.3em] text-center">INSTITUTIONAL_LOCK_ENGAGED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FABRIC ARCHITECTURE - TECHNICAL STACK */}
      <section id="architecture" className="py-48 bg-white border-t border-black/5 scroll-mt-20 relative">
        <div className="container mx-auto px-6 text-center mb-32 relative z-10">
          <span className="text-primary text-[11px] font-bold uppercase tracking-[0.6em] mb-6 block font-mono">// TELEMETRY_FABRIC</span>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 text-black uppercase">Technical Fabric</h2>
          <p className="text-xl text-black/40 max-w-2xl mx-auto font-medium leading-relaxed">
            High-fidelity institutional nervous system mapping multi-platform telemetry into unified project intelligence.
          </p>
        </div>
        
        <div className="container mx-auto px-6 max-w-5xl relative z-20">
            <div className="arch-stack space-y-5">
                {[
                    { id: "L4: ACTION", name: "GATEWAY", desc: "Real-time orchestration across 23 platforms with absolute verification.", icon: Eye },
                    { id: "L3: LOGIC", name: "HEURISTIC", desc: "Vector reasoning across project layers for mission-critical signal validation.", icon: BrainCircuit },
                    { id: "L2: MEMORY", name: "CONTEXT", desc: "Unified high-frequency project memory for deterministic data grounding.", icon: Database },
                    { id: "L1: TRUTH", name: "IMMUTABLE", desc: "Sovereign data core secured via SOC2 and isolated high-end encryption.", icon: Fingerprint }
                ].map((layer, i) => (
                    <div key={i} className="stack-layer p-10 border border-black/5 bg-white shadow-xl flex items-center gap-10 group hover:border-primary/50 cursor-pointer rounded-sm">
                        <div className="size-16 rounded-sm bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/10">
                            <layer.icon className="size-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] font-mono mb-2 block">{layer.id}</span>
                            <h4 className="text-2xl font-bold text-black uppercase tracking-widest font-mono">{layer.name}</h4>
                            <p className="text-xs text-black/40 font-bold leading-relaxed uppercase tracking-widest mt-1">{layer.desc}</p>
                        </div>
                        <ArrowRight className="size-6 text-black/20 group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* METRICS - INSTITUTIONAL AUDIT */}
      <section className="py-48 bg-black text-white scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0 tactical-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 border border-white/10 bg-white/[0.02] p-16 md:p-20 rounded-sm backdrop-blur-3xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
                      <div>
                          <h3 className="text-5xl font-bold mb-5 flex items-center gap-6 text-white uppercase font-mono tracking-tighter"><BarChart3 className="text-primary size-10" /> Audit Velocity</h3>
                          <p className="text-white/30 text-[11px] font-bold uppercase tracking-[0.4em] font-mono">Telemetry sync latency across all nodes.</p>
                      </div>
                      <div className="text-right font-mono">
                          <p className="text-9xl font-bold text-primary tracking-tighter leading-none">0.01s</p>
                          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/10 mt-6">LEGACY_BASELINE: 14_DAYS</p>
                      </div>
                  </div>
                  <div className="h-[450px] w-full"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="border border-white/10 bg-white/[0.02] p-16 md:p-20 flex flex-col items-center justify-center text-center rounded-sm backdrop-blur-3xl">
                  <div className="size-24 rounded-sm bg-primary/10 flex items-center justify-center text-primary mb-12 border border-primary/20 shadow-2xl animate-data-pulse"><Lock className="size-12" /></div>
                  <h3 className="text-[11px] font-bold mb-14 uppercase tracking-[0.6em] text-primary font-mono">// GOVERNANCE_PROTOCOL</h3>
                  <div className="relative size-72 mb-14">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
                          <span className="text-7xl font-bold text-white leading-none tracking-tighter">98%</span>
                          <span className="text-[11px] text-white/30 uppercase font-bold tracking-[0.5em] mt-6">PROTECTED</span>
                      </div>
                  </div>
                  <div className="p-10 bg-white/5 border border-white/10 text-left w-full rounded-sm font-mono">
                      <div className="flex items-center gap-4 mb-5">
                          <ShieldAlert className="size-5 text-primary" />
                          <h4 className="text-base font-bold text-white uppercase tracking-[0.4em]">DLP Enforcement</h4>
                      </div>
                      <p className="text-[10px] text-white/30 leading-relaxed font-bold uppercase tracking-[0.2em]">Sovereign data integrity and RBAC enforced at every project node. Continuous compliance audit cycles.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-black/5 py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 tactical-grid opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 font-bold text-3xl tracking-tighter uppercase mb-8">
            <EnvisionOSLogo className="size-10 text-primary" />
            ENVISION OS
          </div>
          <p className="max-w-2xl mx-auto text-black/40 text-xl font-bold mb-16 leading-relaxed tracking-tight uppercase">Institutional Truth for the Future of Construction.</p>
          <div className="inline-block px-10 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.6em] font-mono rounded-sm shadow-2xl">
            PROTOCOL_ACTIVE: MISSION_CRITICAL
          </div>
        </div>
      </footer>
    </div>
  );
}
