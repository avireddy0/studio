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
  Share2,
  BrainCircuit,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { EnvisionOSLogo } from "@/components/icons";

type Scenario = {
  query: string;
  routes: { text: string; delay: number; status?: string }[];
  answer: string;
  metric: string;
  meta: string;
  followUp?: { text: string; scenarioId: number }[];
};

type Scenarios = {
  [key: number]: Scenario;
};

const initialSuggestions = [
  { text: "Which jobs are off budget?", scenarioId: 1 },
  { text: "When are we getting a CO?", scenarioId: 2 },
  { text: "Why not use ChatGPT?", scenarioId: 3 },
];

export default function DashboardPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const tuContainerRef = useRef<HTMLDivElement>(null);
  const tuSceneRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState(initialSuggestions);
  const [messages, setMessages] = useState<any[]>([]);
  const [particleStyles, setParticleStyles] = useState<{ top: string }[]>([]);
  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: 'Which jobs are currently off budget?',
      routes: [
        { text: 'Semantic Router: Mapping to Finance', delay: 400 },
        { text: 'Executing: sage_get_gl, procore_budget', status: 'complete', delay: 800 },
      ],
      answer:
        'Job 402 is 12% over budget. This is primarily due to drywall rework requested by the tenant. We have already logged the recovery claim with the subcontractor to protect your margins.',
      metric:
        "<span class='text-emerald-500 font-bold'>Profit Protection: $124,500 saved.</span>",
      meta: 'Source: sage_intacct, procore_data',
      followUp: [
        { text: "What's the cost code?", scenarioId: 4 },
        { text: "Draft an RFI about this.", scenarioId: 5 },
      ]
    },
    2: {
      query: 'When are we receiving a CO for Flow Aventura?',
      routes: [
        { text: 'Route to: Project Specialist', status: 'complete', delay: 800 },
        { text: 'Vertex Search: Scanning document streams...', delay: 1200 },
      ],
      answer:
        'March 14th. The City of Aventura verified all fire safety systems today. This clears the final hurdle for the scheduled tenant move-ins.',
      metric:
        "<span class='text-emerald-500 font-bold'>Schedule Integrity: No delays detected.</span>",
      meta: 'Source: ACC_Annexure_002, City Permit Logs',
      followUp: [
          { text: "Tell me more about permit logs.", scenarioId: 6},
          { text: "Who is the PM?", scenarioId: 7}
      ]
    },
    3: {
      query: "Can't we just do this with ChatGPT?",
      routes: [
        { text: "Instant Match: Policy triggered", status: 'complete', delay: 900 },
      ],
      answer:
        'Generic AI assumes clean data. Envision OS handles the mess—fragmented PDFs, phone call transcripts, and broken spreadsheets—turning chaos into verified governance and institutional-grade security.',
      metric:
        "<span class='text-amber-500 font-bold'>Governance is the foundation.</span>",
      meta: 'System Policy: Structural Reality',
      followUp: [
          { text: "Which jobs are off budget?", scenarioId: 1 },
          { text: "When are we getting a CO?", scenarioId: 2 },
      ]
    },
    4: {
        query: "What's the cost code for that rework?",
        routes: [
            { text: "Executing: sage_get_cost_code", status: "complete", delay: 800},
        ],
        answer: "The cost code is <span class='font-mono'>14-550-3B-R01</span>. This has been reconciled with the main contract budget.",
        metric: "Automatic budget audit complete.",
        meta: "Source: sage_intacct",
        followUp: [
          { text: "Thanks!", scenarioId: 8 },
        ]
    },
    5: {
        query: "Draft an RFI about this.",
        routes: [
            { text: "Executing: procore_generate_rfi", delay: 1200},
        ],
        answer: "RFI draft #2024-118 created in Procore.<br>Subject: Discrepancy in Drywall Budget vs. Architectural Deltas for Job 402.",
        metric: "Awaiting your review before sending.",
        meta: "Source: procore_api",
        followUp: [
            { text: "Show me other open RFIs.", scenarioId: 9 },
        ]
    },
    6: {
        query: "Tell me more about permit logs.",
        routes: [
            { text: "Data Normalization: Parsing PDF logs", status: "complete", delay: 900},
        ],
        answer: "Fire safety verification was confirmed at 10:42 AM today by Inspector Davis. Envision OS detected this update within 4 minutes of upload.",
        metric: "<span class='text-emerald-500 font-bold'>Latency: 99% faster than manual check.</span>",
        meta: "Source: City of Aventura",
        followUp: [
          { text: "Who is the PM?", scenarioId: 7 },
          { text: "Thanks!", scenarioId: 8 },
        ]
    },
    7: {
        query: "Who is the PM for this job?",
        routes: [
            { text: "Directory Match: Sarah Jenkins", delay: 200},
        ],
        answer: "The PM is Sarah Jenkins. She has been automatically notified of the fire safety pass.",
        metric: "Communication loop: Active.",
        meta: "Source: HRIS / Project Directory",
        followUp: [
            { text: "Thanks!", scenarioId: 8 },
        ]
    },
    8: {
        query: "Thanks!",
        routes: [],
        answer: "You're welcome. Envision OS is monitoring 23 platforms for project risk. How else can I help today?",
        metric: "",
        meta: "",
        followUp: initialSuggestions
    },
    9: {
        query: "Show me other open RFIs.",
        routes: [
            { text: "Query: list_open_rfis", delay: 500},
        ],
        answer: "There are 4 open RFIs. 2 are high priority related to structural steel lead times.",
        metric: "<span class='text-amber-500 font-bold'>Risk: Potential 2-week delay.</span>",
        meta: "Source: Procore RFI Log",
        followUp: [
            { text: "Thanks!", scenarioId: 8 },
        ]
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

  const addMessage = useCallback((html: string, type: 'user' | 'system', meta = '') => {
    setMessages(prev => [...prev, {html, type, meta}])
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
      await sleep(200);
      scrollToBottom();
      
      const typingId = addTyping();
      scrollToBottom();

      await sleep(1000);
      setMessages(prev => prev.filter(m => m.id !== typingId));

      addMessage(
        `${data.answer}<br><br>${data.metric}`,
        'system',
        data.meta
      );
      
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
            `<strong>Envision OS is online.</strong><br/><span class="text-slate-500 text-[10px] uppercase tracking-widest font-black">Active Audit Engine: Monitoring 23 platform streams.</span>`,
            'system'
        );
      }
      
      // Hydration-safe particle generation
      setParticleStyles([...Array(8)].map(() => ({
        top: `${20 + Math.random() * 60}%`
      })));
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);
  
  useEffect(() => {
    const chartInstances: Chart[] = [];
    
    // --- TOOL UNIVERSE LOGIC ---
    const tuScene = tuSceneRef.current;
    if (tuScene) {
      const isMobile = window.innerWidth < 768;
      const orbRadius = isMobile ? 120 : 260;
      const platforms = [
          { id: 'finance', name: 'Finance', color: '#3B82F6', tools: 58 },
          { id: 'comms', name: 'Comms', color: '#8B5CF6', tools: 85 },
          { id: 'project', name: 'Project', color: '#10B981', tools: 53 },
          { id: 'hr', name: 'HR/Ops', color: '#F59E0B', tools: 42 },
          { id: 'sales', name: 'Sales', color: '#EC4899', tools: 40 },
          { id: 'research', name: 'Research', color: '#F43F5E', tools: 50 },
          { id: 'infra', name: 'Infra', color: '#64748B', tools: 62 }
      ];

      tuScene.innerHTML = '';

      const hub = document.createElement('div');
      hub.className = 'tu-hub';
      hub.innerHTML = `
        <div class="tu-hub-content">
            <div class="tu-hub-core"></div>
            <div class="tu-hub-label">
                <span style="font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.02em;">Envision OS</span>
                <span style="font-size: 0.7rem; color: #3B82F6; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em;">Orchestrator</span>
            </div>
        </div>
      `;
      tuScene.appendChild(hub);

      platforms.forEach((p, i) => {
          const angle = (i / platforms.length) * Math.PI * 2;
          const x = Math.cos(angle) * orbRadius;
          const y = Math.sin(angle) * orbRadius;

          const line = document.createElement('div');
          line.className = 'tu-line';
          line.style.width = `${orbRadius}px`;
          line.style.transform = `rotateZ(${angle}rad)`;
          line.innerHTML = `<div class="tu-pulse" style="background: ${p.color}; box-shadow: 0 0 15px ${p.color}; animation-delay: ${Math.random() * 2}s"></div>`;
          tuScene.appendChild(line);

          const sat = document.createElement('div');
          sat.className = 'tu-sat';
          sat.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          sat.innerHTML = `
            <div class="tu-sat-card" style="border-top: 3px solid ${p.color}">
                <h3 style="color: ${p.color}; font-weight: 900; font-size: 1rem; margin-bottom: 2px;">${p.name}</h3>
                <p style="font-size: 0.7rem; color: #94A3B8; font-weight: 600;">${p.tools} Platforms Syncing</p>
            </div>
          `;
          tuScene.appendChild(sat);
      });

      let tuRotation = 0;
      let animationFrameId: number;

      const animateTu = () => {
          tuRotation += 0.002;
          if (tuScene) {
            tuScene.style.transform = `rotateX(60deg) rotateZ(${tuRotation}rad)`;
            const cards = tuScene.querySelectorAll('.tu-sat-card, .tu-hub-label');
            cards.forEach(c => {
                const htmlC = c as HTMLElement;
                htmlC.style.transform = `rotateZ(${-tuRotation}rad) rotateX(-60deg)`;
            });
          }
          animationFrameId = requestAnimationFrame(animateTu);
      }
      animateTu();

      return () => cancelAnimationFrame(animationFrameId);
    }

    // --- CHARTS LOGIC ---
    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['Manual', 'Excel', 'Envision'],
                    datasets: [{
                        label: 'Days',
                        data: [45, 14, 0.01], 
                        backgroundColor: ['#475569', '#3b82f6', '#10b981'],
                        borderRadius: 8,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8', font: { weight: 'bold' } } },
                        y: { grid: { display: false }, ticks: { color: '#94A3B8', font: { weight: 'bold' } } }
                    }
                }
            }));
        }
    }
    
    if (coverageChartRef.current) {
        const ctxCoverage = coverageChartRef.current.getContext('2d');
        if (ctxCoverage) {
            chartInstances.push(new Chart(ctxCoverage, {
                type: 'doughnut',
                data: {
                    labels: ['Protected', 'Other'],
                    datasets: [{
                        data: [98, 2],
                        backgroundColor: ['#10B981', 'rgba(255,255,255,0.05)'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    return () => chartInstances.forEach(chart => chart.destroy());
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#020202] text-white overflow-x-hidden selection:bg-primary selection:text-white">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5" role="navigation">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <EnvisionOSLogo className="size-7 text-primary" />
            Envision OS
          </div>
          <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#command-center" className="hover:text-white transition-colors">Command Center</a>
            <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
            <a href="#context" className="hover:text-white transition-colors">Context Fusion</a>
            <a href="#architecture" className="hover:text-white transition-colors">Telemetry Fabric</a>
            <a href="#metrics" className="hover:text-white transition-colors">Security</a>
          </div>
          <button className="bg-white text-black px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors hidden sm:block">Request Access</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center pt-20 pb-20 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-12 fade-in-up">
                <Globe className="size-3.5" />
                <span>Institutional Data Orchestration v2.4</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] mb-14 fade-in-up delay-100">
              Where Assets <br/> meet Intelligence
            </h1>
            <p className="text-2xl md:text-4xl text-slate-400 max-w-4xl mx-auto leading-tight mb-16 fade-in-up delay-200 font-medium">
              Turn fragmented data into <span className="text-white">verified profit protection</span> through continuous, multi-platform audit cycles.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center fade-in-up delay-200">
                <a href="#command-center" className="bg-primary text-white px-12 py-6 rounded-2xl text-base font-black uppercase tracking-widest hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all">Launch Simulation</a>
                <button className="px-12 py-6 rounded-2xl text-base font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">Read Protocol <ChevronRight className="size-5" /></button>
            </div>
        </div>
      </section>

      {/* COMMAND CENTER */}
      <section id="command-center" className="py-40 border-t border-white/5 bg-[#020202] scroll-mt-24">
        <div className="container mx-auto px-6 text-center mb-28">
          <span className="text-accent-emerald text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Multimodal Simulation</span>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10">Command Center</h2>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            An AI monitoring 23 platform streams to protect institutional project margins in real-time.
          </p>
        </div>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[850px] bg-white rounded-[44px] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-sm">
                      <EnvisionOSLogo className="size-7" />
                  </div>
                  <div>
                      <div className="font-bold text-xl text-slate-900 leading-none mb-1.5">Envision OS</div>
                      <div className="text-[11px] text-accent-emerald font-black uppercase tracking-[0.1em] flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
                        Active Audit Engine
                      </div>
                  </div>
              </div>
              <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
            </div>
            
            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col gap-8 bg-white" ref={chatBodyRef}>
              {messages.map((msg, index) => {
                  if (msg.type === 'typing') {
                    return (
                        <div key={msg.id} className="flex justify-start items-end gap-3 mb-2 animate-pulse">
                            <div className="bg-[#e9e9eb] px-8 py-4 rounded-3xl rounded-bl-sm">
                              <div className="flex gap-2 items-center h-5">
                                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full opacity-60"></span>
                                  <span className="w-2 h-2 bg-slate-400 rounded-full opacity-30"></span>
                              </div>
                            </div>
                        </div>
                    );
                  }
                  
                  const isUser = msg.type === 'user';
                  return (
                      <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-400`}>
                          <div className={`max-w-[85%] px-8 py-5 text-lg md:text-xl ${isUser ? 'bg-[#007AFF] text-white rounded-[32px] rounded-br-sm' : 'bg-[#e9e9eb] text-slate-900 rounded-[32px] rounded-bl-sm'} shadow-sm font-medium leading-relaxed`}>
                              <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                              {msg.meta && <div className="mt-4 text-[11px] opacity-40 font-black uppercase tracking-widest border-t border-black/5 pt-3">{msg.meta}</div>}
                          </div>
                      </div>
                  );
              })}

              {suggestedReplies.length > 0 && (
                <div className="mt-auto pt-16 flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-700">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest">
                      <MousePointerClick className="size-4" />
                      <span>Select a query to simulate</span>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {suggestedReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="px-10 py-5 bg-[#e9e9eb] text-slate-800 hover:bg-primary hover:text-white rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-transparent"
                                onClick={() => runSimulation(reply.scenarioId)}
                                disabled={isRunning.current}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INGESTION PIPELINE */}
      <section id="ingestion" className="py-40 border-t border-white/5 scroll-mt-24">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 text-left">
            <span className="text-accent-violet text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Multi-Stream Normalization</span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 leading-tight">From Chaos <br/> to Intelligence</h2>
            <p className="text-2xl text-slate-400 mb-14 leading-relaxed font-medium">
              Construction data lives in silos: thousands of emails, field notes, and broken PDFs. Envision OS ingests it all simultaneously.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-[36px] bg-white/5 border border-white/5 hover:border-accent-violet/50 transition-colors group">
                    <Mail className="size-8 text-accent-violet mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-xl mb-3 text-white">Comms Mining</h4>
                    <p className="text-base text-slate-500 leading-relaxed font-medium">Unstructured emails and chats parsed in real-time.</p>
                </div>
                <div className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-xl animate-ingest-float flex items-center justify-between group" style={{ animationDelay: `0s` }}>
                    <div className="flex items-center gap-3">
                        <FileText className={`size-4 text-accent-violet`} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Normalization</span>
                    </div>
                    <div className="size-1.5 rounded-full bg-accent-violet animate-ping"></div>
                </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-3xl">
              <div className="ingestion-viz w-full rounded-[44px] border border-white/10 bg-[#050505] p-10 relative overflow-hidden h-[550px] flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Source Fragments */}
                <div className="flex flex-col gap-6 z-10 w-full md:w-1/3 order-2 md:order-1">
                    {[
                        { label: 'EMAIL', icon: Mail, color: 'text-blue-400' },
                        { label: 'SLACK', icon: MessageSquare, color: 'text-amber-400' },
                        { label: 'PDF LOG', icon: FileText, color: 'text-accent-violet' },
                        { label: 'PROCORE', icon: Activity, color: 'text-emerald-400' }
                    ].map((s, i) => (
                        <div key={i} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl animate-ingest-float flex items-center justify-between group" style={{ animationDelay: `${i * 0.5}s` }}>
                            <div className="flex items-center gap-3">
                                <s.icon className={`size-4 ${s.color}`} />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{s.label}</span>
                            </div>
                            <div className="size-1.5 rounded-full bg-accent-violet animate-ping"></div>
                        </div>
                    ))}
                </div>

                {/* Center: AI Parser Core */}
                <div className="relative flex items-center justify-center z-20 order-1 md:order-2">
                    {/* Flow Particles - Hydration Safe */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
                        {particleStyles.map((style, i) => (
                            <div 
                                key={i} 
                                className="absolute size-2 bg-accent-violet rounded-full blur-[2px] animate-particle-fly" 
                                style={{ 
                                    animationDelay: `${i * 0.4}s`,
                                    top: style.top
                                }}
                            ></div>
                        ))}
                    </div>

                    <div className="size-36 bg-black border-2 border-accent-violet rounded-[40px] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.4)] relative group">
                        <span className="text-4xl font-bold text-white mb-2 leading-none">{'</>'}</span>
                        <span className="text-[10px] font-black tracking-[0.2em] text-accent-violet uppercase">AI Parser</span>
                        <div className="absolute inset-0 rounded-[40px] border border-accent-violet animate-pulse opacity-40"></div>
                    </div>
                </div>

                {/* Right: Structured Linear Stream */}
                <div className="flex flex-col gap-5 z-10 w-full md:w-1/3 order-3 items-end">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-2.5 bg-white/5 border border-white/5 rounded-full w-full max-w-[180px] relative overflow-hidden group">
                            <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-violet/60 to-transparent animate-ingest-stream" 
                                style={{ animationDelay: `${i * 0.3}s` }}
                            ></div>
                        </div>
                    ))}
                    <div className="mt-4 px-6 py-3 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="size-3.5" />
                        Normalized truth output
                    </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* CONTEXT FUSION SEQUENCE */}
      <section id="context" className="py-40 border-t border-white/5 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-32">
            <span className="text-accent-blue text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Context Fusion Engine</span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-white">Context is Everything</h2>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed">
              We verify decisions by cross-referencing thousands of multi-platform signals to eliminate blind spots and "mint" verified truth.
            </p>
          </div>
          
          <div className="relative min-h-[650px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
              {/* SOURCE SIGNALS */}
              <div className="flex flex-col gap-6 w-full lg:w-1/3 z-20">
                  {[
                      { label: "Meeting Note: OAC", text: "Authorize lobby upgrade. Use premium marble.", icon: MessageCircle, color: "text-blue-400", delay: "0s" },
                      { label: "Slack: #Project-Flow", text: "Procurement lead time is now 4 weeks.", icon: MessageSquare, color: "text-amber-400", delay: "0.2s" },
                      { label: "Email: Procurement", text: "Marble shipment confirmed. ETA matching baseline.", icon: Mail, color: "text-violet-400", delay: "0.4s" }
                  ].map((s, i) => (
                      <div key={i} className="p-8 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-3xl animate-in slide-in-from-left duration-1000 group hover:bg-white/10 transition-all cursor-default overflow-hidden flex-shrink-0" style={{ animationDelay: s.delay }}>
                          <div className="flex items-center gap-3 mb-3">
                              <s.icon className={`size-4 ${s.color}`} />
                              <span className={`text-[11px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</span>
                          </div>
                          <p className="text-lg text-slate-300 font-medium leading-relaxed italic">"{s.text}"</p>
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-current opacity-20 transition-all group-hover:w-full group-hover:opacity-5"></div>
                      </div>
                  ))}
              </div>

              {/* FUSION CORE */}
              <div className="relative flex items-center justify-center w-full lg:w-1/3 min-h-[300px] lg:min-h-[450px] flex-1">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="size-[250px] lg:size-[400px] border border-primary/20 rounded-full animate-pulse-slow"></div>
                      <div className="size-[180px] lg:size-[300px] border border-primary/30 rounded-full animate-pulse-fast"></div>
                  </div>
                  <div className="size-36 lg:size-56 bg-primary rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(59,130,246,0.5)] animate-bounce-slow z-10">
                      <Zap className="size-16 lg:size-20 text-white" />
                  </div>
                  {/* DATA STREAMS */}
                  <div className="absolute inset-0 flex items-center justify-center -z-0">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer"></div>
                  </div>
              </div>

              {/* VERIFIED OUTPUT */}
              <div className="w-full lg:w-1/3 flex justify-center lg:justify-end z-20">
                  <div className="p-10 lg:p-14 rounded-[48px] bg-white text-slate-900 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] animate-in zoom-in duration-1000 delay-1000 border-t-[10px] border-accent-emerald max-w-sm w-full relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-10 text-accent-emerald">
                          <ShieldCheck className="size-7" />
                          <span className="text-[12px] font-black uppercase tracking-[0.4em]">Context Verified</span>
                      </div>
                      <h4 className="text-4xl lg:text-5xl font-bold mb-10 tracking-tighter text-slate-900 leading-none">Lobby Finish Upgrade</h4>
                      <div className="space-y-8 border-t border-slate-100 pt-10 font-bold">
                          <div className="flex justify-between items-center text-base">
                              <span className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Decision Status</span>
                              <span className="text-emerald-600 font-black flex items-center gap-2"><CheckCircle2 className="size-4" /> Authorized by Owner</span>
                          </div>
                          <div className="flex justify-between items-center text-base">
                              <span className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Fusion Confidence</span>
                              <span className="text-slate-900 font-black text-xl">99.2%</span>
                          </div>
                      </div>
                      <div className="mt-12 pt-6 flex gap-1.5 justify-center opacity-30">
                          {[...Array(6)].map((_, i) => <div key={i} className="size-1.5 bg-slate-400 rounded-full"></div>)}
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* TELEMETRY FABRIC (DIGITAL TWIN) */}
      <section id="architecture" className="py-40 border-t border-white/5 scroll-mt-24">
        <div className="container mx-auto px-6 text-center mb-32">
          <span className="text-accent-violet text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Digital Twin & Real-time Telemetry</span>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-white">Telemetry Fabric</h2>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            A high-fidelity project nervous system turning fragmented data into real-time verified intelligence.
          </p>
        </div>
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="arch-stack">
                {[
                    { id: "L4: ACTION GATEWAY", name: "Multi-Platform Orchestrator", desc: "Real-time orchestration across 390+ field sensors and platform streams.", icon: Activity, color: "text-blue-400", cls: "layer-high" },
                    { id: "L3: COGNITIVE FABRIC", name: "Heuristic reasoning engine for data validation.", desc: "Dynamic reasoning across project layers.", icon: Layers, color: "text-violet-400", cls: "layer-mid-high" },
                    { id: "L2: UNIFIED CONTEXT", name: "Vector Memory Hub", desc: "Unified vector memory for high-frequency construction telemetry.", icon: Database, color: "text-amber-400", cls: "layer-mid-low" },
                    { id: "L1: TRUTH CORE", name: "Normalized Data Core", desc: "Normalized immutable truth core, secured via SOC2 and AES-256.", icon: Fingerprint, color: "text-emerald-400", cls: "layer-low" }
                ].map((layer, i) => (
                    <div key={i} className={`stack-layer ${layer.cls} group`}>
                        <div className="layer-glass"></div>
                        <div className="layer-content">
                            <div className={`size-20 rounded-2xl bg-white/5 flex items-center justify-center ${layer.color} border border-white/5 shadow-inner transition-transform group-hover:scale-110`}>
                                <layer.icon className="size-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="layer-id">{layer.id}</span>
                                <h4 className="text-2xl font-bold mb-2 text-white">{layer.name}</h4>
                                <p className="layer-description">{layer.desc}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-emerald text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="size-1 bg-accent-emerald rounded-full animate-pulse"></span>
                                    Syncing
                                </div>
                            </div>
                        </div>
                        <div className="layer-glow"></div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* NEURAL HUB (ECOSYSTEM) */}
      <section id="ecosystem" className="py-40 border-t border-white/5 scroll-mt-24">
        <div className="container mx-auto px-6 text-center mb-32">
          <span className="text-accent-emerald text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Connectivity Hub</span>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-white">Neural Hub</h2>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Our multi-platform nervous system orchestrates thousands of data points through a single point of truth.
          </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="tu-container w-full h-[700px] rounded-[48px] border border-white/10 bg-slate-900/50 backdrop-blur-3xl overflow-hidden flex items-center justify-center" ref={tuContainerRef}>
            <div className="tu-scene" ref={tuSceneRef}></div>
          </div>
        </div>
      </section>

      {/* SECURITY & COMPLIANCE */}
      <section id="metrics" className="py-40 border-t border-white/5 scroll-mt-24 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-40">
            <span className="text-accent-violet text-[11px] font-black uppercase tracking-[0.3em] mb-6 block">Institutional Security</span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 text-white">Security & Compliance</h2>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                Shifting project risk discovery and data protection from weeks to milliseconds.
            </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 rounded-[48px] border border-white/10 bg-white/5 p-16 md:p-20">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
                      <div>
                          <h3 className="text-5xl font-bold mb-5 flex items-center gap-4 text-white"><BarChart3 className="text-accent-emerald size-10" /> Discovery Velocity</h3>
                          <p className="text-slate-500 text-xl font-medium">Time to identify project field variances.</p>
                      </div>
                      <div className="text-right">
                          <p className="text-8xl md:text-[10rem] font-black text-accent-emerald tracking-tighter leading-none">0.01s</p>
                          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mt-6 font-mono">VS 14-DAY MANUAL AUDIT</p>
                      </div>
                  </div>
                  <div className="h-[450px] w-full"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="rounded-[48px] border border-white/10 bg-white/5 p-16 md:p-20 flex flex-col items-center justify-center text-center">
                  <div className="size-24 rounded-3xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald mb-14 border border-accent-emerald/20 shadow-inner"><Lock className="size-12" /></div>
                  <h3 className="text-[12px] font-black mb-14 uppercase tracking-[0.5em] text-accent-emerald font-mono">GOVERNANCE SHIELD</h3>
                  <div className="relative size-72 mb-14">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-7xl font-black text-white leading-none">98%</span>
                          <span className="text-[12px] text-slate-500 uppercase font-black tracking-widest mt-4">PROTECTION</span>
                      </div>
                  </div>
                  <div className="p-10 bg-black/40 rounded-[40px] border border-white/5 text-left w-full backdrop-blur-2xl">
                      <h4 className="text-2xl font-bold text-white mb-5">Data Loss Prevention</h4>
                      <p className="text-lg text-slate-400 leading-relaxed font-medium">Institutional-grade DLP and granular Access Control ensure high-fidelity sensitive data protection. Continuous SOC2/ISO compliance monitoring across 23 data streams.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/5 py-32 text-center">
        <div className="container mx-auto px-6">
          <p className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Envision OS</p>
          <p className="max-w-xl mx-auto text-slate-500 text-xl font-medium mb-14 leading-relaxed">The Unified Source of Truth for Institutional Construction Asset Management.</p>
          <div className="inline-block px-8 py-3 rounded-full bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-[0.5em] text-slate-600">
            Compliance & Security Integrity Engines Active.
          </div>
        </div>
      </footer>
    </div>
  );
}
