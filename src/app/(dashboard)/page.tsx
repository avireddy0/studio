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
  ShieldAlert
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
  { text: "AUDIT: Jobs off budget", scenarioId: 1 },
  { text: "STATUS: Flow Aventura CO", scenarioId: 2 },
  { text: "PROTOCOL: Data Integrity", scenarioId: 3 },
];

export default function DashboardPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const tuSceneRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState(initialSuggestions);
  const [messages, setMessages] = useState<any[]>([]);
  const [particleStyles, setParticleStyles] = useState<{ top: string, delay: string }[]>([]);
  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: 'Identify all active jobs exceeding budget thresholds.',
      routes: [
        { text: 'ROUTING > FINANCIAL_ANALYTICS', delay: 400 },
        { text: 'FETCHING > SAGE_INTACCT_GL, PROCORE_BUDGET', status: 'complete', delay: 800 },
      ],
      answer:
        'CRITICAL: Job 402 (Tenant Buildout) is 12.4% over variance. Analysis identifies dry-wall rework as the primary driver. Subcontractor recovery protocols initiated.',
      metric:
        "<span class='text-primary font-bold'>MARGIN PROTECTION: $124,500 secured.</span>",
      meta: 'SOURCE: sage_finance_stream, procore_api_v4',
      followUp: [
        { text: "GET: Cost Code 14-550", scenarioId: 4 },
        { text: "DRAFT: Recovery RFI", scenarioId: 5 },
      ]
    },
    2: {
      query: 'Current status of Certificate of Occupancy for Flow Aventura.',
      routes: [
        { text: 'ROUTING > PROJECT_OPERATIONS', status: 'complete', delay: 800 },
        { text: 'SCANNING > PERMIT_DOC_STREAM', delay: 1200 },
      ],
      answer:
        'ESTIMATED CO: MARCH 14. Fire safety systems verified by Aventura Inspector Davis at 10:42 AM. Schedule integrity remains nominal.',
      metric:
        "<span class='text-primary font-bold'>SCHEDULE_CONFIDENCE: 98.4%</span>",
      meta: 'SOURCE: city_permit_logs, field_inspection_report_v2',
      followUp: [
          { text: "VIEW: Inspection Logs", scenarioId: 6},
          { text: "PING: Project Manager", scenarioId: 7}
      ]
    },
    3: {
      query: "Envision OS protocol vs. generic AI.",
      routes: [
        { text: "SECURITY_CHECK > COMPLIANCE_TRIGGERED", status: 'complete', delay: 900 },
      ],
      answer:
        'PROTOCOL: Envision OS operates on verified multi-platform data fusion. Unlike generic LLMs, we provide institutional-grade transparency through continuous audit cycles and deterministic data grounding.',
      metric:
        "<span class='text-primary font-bold'>DATA_INTEGRITY: AES-256 + SOC2</span>",
      meta: 'SYSTEM_POLICY: MISSION_CRITICAL',
      followUp: [
          { text: "AUDIT: Jobs off budget", scenarioId: 1 },
          { text: "STATUS: Flow Aventura CO", scenarioId: 2 },
      ]
    },
    4: {
        query: "Provide cost code data for rework.",
        routes: [
            { text: "EXECUTING > SAGE_GL_QUERY", status: "complete", delay: 800},
        ],
        answer: "COST_CODE: <span class='font-mono'>14-550-3B-R01</span>. Reconciled with prime contract budget line 42.",
        metric: "BUDGET_AUDIT_SYNC: COMPLETE",
        meta: "SOURCE: sage_intacct",
        followUp: [
          { text: "TERMINATE_SESSION", scenarioId: 8 },
        ]
    },
    5: {
        query: "Generate RFI draft for recovery claim.",
        routes: [
            { text: "EXECUTING > PROCORE_RFI_GEN", delay: 1200},
        ],
        answer: "RFI_DRAFT #2024-118 initialized in Procore.<br>SUBJECT: Architectural Discrepancy Recovery - Job 402.",
        metric: "STATUS: AWAITING_PM_APPROVAL",
        meta: "SOURCE: procore_write_stream",
        followUp: [
            { text: "LIST: Open RFIs", scenarioId: 9 },
        ]
    },
    6: {
        query: "Display city permit inspection details.",
        routes: [
            { text: "NORMALIZING > PDF_STREAM", status: "complete", delay: 900},
        ],
        answer: "INSPECTION_ID: AV-992. Fire safety verification confirmed. Latency between field event and OS detection: 3.8 minutes.",
        metric: "<span class='text-primary font-bold'>AUDIT_VELOCITY: 100% FIELD_PASS</span>",
        meta: "SOURCE: City of Aventura",
        followUp: [
          { text: "PING: Project Manager", scenarioId: 7 },
          { text: "TERMINATE_SESSION", scenarioId: 8 },
        ]
    },
    7: {
        query: "Notify PM of fire safety approval.",
        routes: [
            { text: "DIRECTORY_MATCH > SARAH_JENKINS", delay: 200},
        ],
        answer: "NOTIFICATION_SENT: PM Sarah Jenkins alert triggered via Envision App + Email. Automated schedule update queued.",
        metric: "LOOP_STATUS: ACTIVE",
        meta: "SOURCE: project_directory",
        followUp: [
            { text: "TERMINATE_SESSION", scenarioId: 8 },
        ]
    },
    8: {
        query: "TERMINATE_SESSION",
        routes: [],
        answer: "SESSION_ENDED. Envision OS continues monitoring 23 platforms for institutional project risk. Ready for next command.",
        metric: "",
        meta: "",
        followUp: initialSuggestions
    },
    9: {
        query: "Summarize all high-priority open RFIs.",
        routes: [
            { text: "QUERYING > RFI_LOG_SYNC", delay: 500},
        ],
        answer: "4 OPEN RFIs DETECTED. 2 designated HIGH_PRIORITY (Structural Steel lead times). Potential critical path impact: 14 days.",
        metric: "<span class='text-red-500 font-bold'>RISK_LEVEL: ELEVATED</span>",
        meta: "SOURCE: procore_rfi_stream",
        followUp: [
            { text: "TERMINATE_SESSION", scenarioId: 8 },
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
            `<span class="font-mono text-primary">ENVISION_OS_CONNECTED_V3.1</span><br/><span class="text-slate-500 text-[10px] uppercase tracking-widest font-black">ACTIVE MONITORING: 23 PLATFORM STREAMS ONLINE</span>`,
            'system'
        );
      }
      
      // Hydration-safe particle generation for Ingestion Stream
      setParticleStyles([...Array(12)].map((_, i) => ({
        top: `${10 + Math.random() * 80}%`,
        delay: `${i * 0.4}s`
      })));
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);
  
  useEffect(() => {
    const chartInstances: Chart[] = [];
    
    // --- TACTICAL NEURAL HUB LOGIC ---
    const tuScene = tuSceneRef.current;
    if (tuScene) {
      const isMobile = window.innerWidth < 768;
      const orbRadius = isMobile ? 140 : 280;
      const platforms = [
          { id: 'finance', name: 'FINANCE', tools: 58 },
          { id: 'comms', name: 'COMMS', tools: 85 },
          { id: 'project', name: 'PROJECT', tools: 53 },
          { id: 'ops', name: 'OPERATIONS', tools: 42 },
          { id: 'legal', name: 'LEGAL', tools: 50 },
          { id: 'sensors', name: 'SENSORS', tools: 62 }
      ];

      tuScene.innerHTML = '';

      const hub = document.createElement('div');
      hub.className = 'tu-hub';
      hub.innerHTML = `
        <div class="tu-hub-content">
            <div class="tu-hub-core" style="border: 2px solid #007C5A; border-radius: 4px; box-shadow: 0 0 50px rgba(0, 124, 90, 0.5);"></div>
            <div class="tu-hub-label">
                <span style="font-size: 1.6rem; font-weight: 950; color: #fff; letter-spacing: -0.05em;">ENVISION OS</span>
                <span style="font-size: 0.7rem; color: #007C5A; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4em;">COMMAND_CORE</span>
            </div>
        </div>
      `;
      tuScene.appendChild(hub);

      platforms.forEach((p, i) => {
          const angle = (i / platforms.length) * Math.PI * 2;
          const x = Math.cos(angle) * orbRadius;
          const y = Math.sin(angle) * orbRadius;

          const sat = document.createElement('div');
          sat.className = 'tu-sat';
          sat.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          sat.innerHTML = `
            <div class="tu-sat-card tactical-border" style="background: rgba(2,2,2,0.9); padding: 12px 20px;">
                <h3 style="color: #007C5A; font-weight: 950; font-size: 0.9rem; margin-bottom: 2px; font-family: 'JetBrains Mono';">${p.name}</h3>
                <p style="font-size: 0.6rem; color: #64748B; font-weight: 700; letter-spacing: 0.1em;">SYNC_STABLE</p>
            </div>
          `;
          tuScene.appendChild(sat);
      });

      let tuRotation = 0;
      let animationFrameId: number;

      const animateTu = () => {
          tuRotation += 0.0012;
          if (tuScene) {
            tuScene.style.transform = `rotateX(55deg) rotateZ(${tuRotation}rad)`;
            const cards = tuScene.querySelectorAll('.tu-sat-card, .tu-hub-label');
            cards.forEach(c => {
                const htmlC = c as HTMLElement;
                htmlC.style.transform = `rotateZ(${-tuRotation}rad) rotateX(-55deg)`;
            });
          }
          animationFrameId = requestAnimationFrame(animateTu);
      }
      animateTu();

      return () => cancelAnimationFrame(animationFrameId);
    }

    // --- TACTICAL ANALYTICS ---
    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['MANUAL', 'LEGACY_CRM', 'ENVISION_OS'],
                    datasets: [{
                        label: 'DAYS_TO_VERIFY',
                        data: [45, 14, 0.01], 
                        backgroundColor: ['#1A1A1A', '#262626', '#007C5A'],
                        borderRadius: 0,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } } },
                        y: { grid: { display: false }, ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } } }
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
                    labels: ['PROTECTED', 'RESIDUAL'],
                    datasets: [{
                        data: [98.2, 1.8],
                        backgroundColor: ['#007C5A', '#1A1A1A'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '88%',
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    return () => chartInstances.forEach(chart => chart.destroy());
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#020202] text-white overflow-x-hidden selection:bg-primary/40 selection:text-white font-body">
      {/* TACTICAL NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-black/95 backdrop-blur-md border-b border-white/5" role="navigation">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 font-black text-xl tracking-widest uppercase">
            <EnvisionOSLogo className="size-6 text-primary" />
            ENVISION OS
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 font-mono">
            <a href="#command-center" className="hover:text-primary transition-colors">01_COMMAND_CENTER</a>
            <a href="#ingestion" className="hover:text-primary transition-colors">02_SENSOR_INGEST</a>
            <a href="#context" className="hover:text-primary transition-colors">03_CONTEXT_FUSION</a>
            <a href="#architecture" className="hover:text-primary transition-colors">04_TELEMETRY_FABRIC</a>
          </div>
          <button className="border border-primary text-primary px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all font-mono">ACCESS_GATEWAY</button>
        </div>
      </nav>

      {/* HERO SECTION - MISSION CRITICAL FEEL */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center pt-20 pb-20 text-center px-6 relative overflow-hidden scanline">
        <div className="absolute inset-0 grid-overlay opacity-20"></div>
        <div className="relative z-10 max-w-6xl">
            <div className="inline-flex items-center gap-3 px-6 py-2 border border-primary/40 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.5em] text-primary mb-12 fade-in-up font-mono">
                <Crosshair className="size-3.5" />
                <span>INSTITUTIONAL_INTEL_SYSTEM_v3.1</span>
            </div>
            <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-14 fade-in-up delay-100 uppercase">
              Mission <br/><span className="text-primary">Controlled</span> Data
            </h1>
            <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 fade-in-up delay-200 font-medium tracking-tight">
              A high-fidelity project nervous system turning fragmented data into <span className="text-white font-bold">verified institutional intelligence</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up delay-200">
                <a href="#command-center" className="bg-primary text-white px-10 py-5 rounded-sm text-[12px] font-black uppercase tracking-widest hover:envision-glow transition-all font-mono flex items-center gap-3">INITIALIZE_COMMAND_OS <ChevronRight className="size-4" /></a>
                <button className="px-10 py-5 rounded-sm text-[12px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all font-mono">READ_PROTOCOL</button>
            </div>
        </div>
      </section>

      {/* COMMAND CENTER - TACTICAL OS INTERFACE */}
      <section id="command-center" className="py-40 border-t border-white/5 bg-[#020202] scroll-mt-24 relative">
        <div className="container mx-auto px-6 text-center mb-28">
          <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6 block font-mono">// TACTICAL_OPERATING_SYSTEM</span>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 uppercase">Command Center</h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            AI-driven project orchestration monitoring institutional project margins through a secure mission-control interface.
          </p>
        </div>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-full max-w-6xl h-[850px] bg-[#050505] rounded-sm shadow-2xl overflow-hidden flex flex-col border border-white/10 relative">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black z-10">
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Terminal className="size-6" />
                  </div>
                  <div>
                      <div className="font-black text-sm tracking-[0.2em] text-white uppercase font-mono">ENVISION_OS_TERMINAL</div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] flex items-center gap-2 font-mono mt-1">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        MISSION_STATUS: ACTIVE
                      </div>
                  </div>
              </div>
              <div className="flex gap-6 font-mono text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  <span>SECURE_NODE: AV-4</span>
                  <span>ENCRYPT: AES-256</span>
              </div>
            </div>
            
            <div className="flex-1 p-8 md:p-14 overflow-y-auto flex flex-col gap-10 bg-[#020202]" ref={chatBodyRef}>
              {messages.map((msg, index) => {
                  if (msg.type === 'typing') {
                    return (
                        <div key={msg.id} className="flex justify-start items-center gap-3 mb-2 font-mono text-primary text-sm font-bold">
                            <span className="animate-pulse">_PROCESSING_TELEMETRY...</span>
                        </div>
                    );
                  }
                  
                  const isUser = msg.type === 'user';
                  return (
                      <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-400`}>
                          <div className={`max-w-[85%] px-8 py-6 text-lg md:text-xl border ${isUser ? 'bg-primary/15 border-primary/40 text-white' : 'bg-white/5 border-white/10 text-slate-200'} font-bold leading-relaxed rounded-sm tactical-border`}>
                              <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                              {msg.meta && <div className="mt-6 text-[10px] text-primary font-black uppercase tracking-[0.3em] border-t border-white/10 pt-4 font-mono">{msg.meta}</div>}
                          </div>
                      </div>
                  );
              })}

              {suggestedReplies.length > 0 && (
                <div className="mt-auto pt-20 flex flex-col items-center gap-10 animate-in fade-in duration-700">
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] font-mono">
                      <Pulse className="size-4 text-primary" />
                      SELECT_QUERY_PARAMETER
                    </div>
                    <div className="flex flex-wrap gap-5 justify-center">
                        {suggestedReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="px-10 py-4 bg-white/5 text-slate-400 hover:bg-primary hover:text-white border border-white/10 hover:border-primary rounded-sm text-[12px] font-black tracking-[0.2em] transition-all font-mono uppercase"
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

      {/* SENSOR INGESTION - LINEAR TACTICAL FLOW */}
      <section id="ingestion" className="py-40 border-t border-white/5 bg-[#050505] relative overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 grid-overlay opacity-10"></div>
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-28">
          <div className="flex-1 text-left relative z-10">
            <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6 block font-mono">// SENSOR_INGESTION_PIPELINE</span>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] uppercase">Data <br/> Ingestion</h2>
            <p className="text-xl text-slate-500 mb-16 leading-relaxed font-medium">
              Mapping fragmented project signals across the ecosystem into a high-fidelity linear intelligence stream.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-10 border border-white/10 bg-white/2 backdrop-blur-md group hover:border-primary/50 transition-colors">
                    <Pulse className="size-10 text-primary mb-8 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-xl mb-4 text-white uppercase tracking-[0.2em] font-mono">Telemetry Mining</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold">Real-time parsing of fragmented comms and field sensor data with institutional precision.</p>
                </div>
                <div className="p-10 border border-white/10 bg-white/2 backdrop-blur-md flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-2 rounded-full bg-primary animate-ping"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white font-mono">NORMALIZING_STREAM_AV4</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 overflow-hidden">
                        <div className="h-full bg-primary animate-shimmer w-1/3"></div>
                    </div>
                </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-4xl z-10">
              <div className="w-full border border-white/15 bg-[#020202] p-12 h-[550px] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden tactical-border">
                {/* Left: Fragments flying in */}
                <div className="flex flex-col gap-8 w-full md:w-1/3 order-2 md:order-1">
                    {[
                        { label: 'EMAIL_HASH', icon: Mail },
                        { label: 'SLACK_ID', icon: MessageSquare },
                        { label: 'PDF_PARCEL', icon: FileText },
                        { label: 'SAGE_TELEMETRY', icon: Activity }
                    ].map((s, i) => (
                        <div key={i} className="px-8 py-5 border border-white/5 bg-white/2 backdrop-blur-md animate-technical-fly flex items-center justify-between group" style={{ animationDelay: `${i * 1.2}s` }}>
                            <div className="flex items-center gap-4">
                                <s.icon className={`size-4 text-primary`} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white font-mono">{s.label}</span>
                            </div>
                            <div className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_#007C5A]"></div>
                        </div>
                    ))}
                </div>

                {/* Center: AI Parser Core */}
                <div className="relative flex items-center justify-center z-20 order-1 md:order-2">
                    <div className="size-40 bg-black border-2 border-primary flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,124,90,0.4)] relative group rounded-sm">
                        <span className="text-4xl font-black text-white mb-2 leading-none font-mono">{'<AI>'}</span>
                        <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase font-mono">PARSER_CORE</span>
                        <div className="absolute inset-0 border border-primary animate-pulse opacity-40"></div>
                        
                        {/* Flying particles inside ingestion engine */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
                            {particleStyles.map((style, i) => (
                                <div 
                                    key={i} 
                                    className="absolute size-2 bg-primary rounded-full blur-[2px] animate-particle-fly" 
                                    style={{ 
                                        animationDelay: style.delay, 
                                        top: style.top,
                                        left: '-100px'
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Linear Structured Truth */}
                <div className="flex flex-col gap-6 z-10 w-full md:w-1/3 order-3 items-end">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-2 border border-white/5 bg-white/2 rounded-sm w-full max-w-[180px] relative overflow-hidden">
                            <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/70 to-transparent animate-ingest-stream" 
                                style={{ animationDelay: `${i * 0.5}s` }}
                            ></div>
                        </div>
                    ))}
                    <div className="mt-8 px-8 py-3 border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] font-mono flex items-center gap-3 tactical-border">
                        <Shield className="size-4" />
                        TRUTH_CORE_OUTPUT
                    </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* CONTEXT FUSION - TACTICAL VERIFICATION SEQUENCE */}
      <section id="context" className="py-40 border-t border-white/5 scroll-mt-24 relative bg-[#020202]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-36">
            <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6 block font-mono">// SENSOR_FUSION_PROTOCOL</span>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white uppercase">Context Fusion</h2>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed">
              Verifying institutional decisions by cross-referencing multi-platform signals to eliminate project blind spots and mitigate risk.
            </p>
          </div>
          
          <div className="relative min-h-[700px] w-full flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-0">
              <div className="flex flex-col gap-8 w-full lg:w-1/3 z-20">
                  {[
                      { label: "OAC_RECORD_ID", text: "Lobby upgrade authorization confirmed by developer.", icon: MessageCircle, delay: "0s" },
                      { label: "SLACK_TRANSCRIPT", text: "Procurement lead time verified: 4 weeks for marble.", icon: MessageSquare, delay: "0.2s" },
                      { label: "EMAIL_TELEMETRY", text: "Shipment status confirmed. ETA matching project baseline.", icon: Mail, delay: "0.4s" }
                  ].map((s, i) => (
                      <div key={i} className="p-10 border border-white/15 bg-white/2 backdrop-blur-3xl animate-in slide-in-from-left duration-1200 group hover:border-primary/60 transition-all cursor-default overflow-hidden tactical-border" style={{ animationDelay: s.delay }}>
                          <div className="flex items-center gap-4 mb-4">
                              <s.icon className={`size-4 text-primary`} />
                              <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-primary font-mono`}>{s.label}</span>
                          </div>
                          <p className="text-lg text-slate-200 font-bold leading-relaxed">"{s.text}"</p>
                      </div>
                  ))}
              </div>

              <div className="relative flex items-center justify-center w-full lg:w-1/3 min-h-[350px] lg:min-h-[500px]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="size-[300px] lg:size-[450px] border border-primary/15 animate-pulse-slow"></div>
                      <div className="size-[220px] lg:size-[350px] border border-primary/25 animate-pulse-fast"></div>
                  </div>
                  <div className="size-40 lg:size-56 bg-primary/15 border-2 border-primary flex items-center justify-center shadow-[0_0_100px_rgba(0,124,90,0.4)] z-10 rounded-sm">
                      <Pulse className="size-20 text-primary" />
                  </div>
              </div>

              <div className="w-full lg:w-1/3 flex justify-center lg:justify-end z-20">
                  <div className="p-12 lg:p-14 border-2 border-primary bg-[#050505] shadow-2xl animate-in zoom-in duration-1200 delay-1200 max-w-md w-full relative rounded-sm tactical-border">
                      <div className="flex items-center gap-4 mb-10 text-primary">
                          <ShieldCheck className="size-8" />
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] font-mono">SIGNAL_VERIFIED</span>
                      </div>
                      <h4 className="text-4xl lg:text-5xl font-black mb-12 tracking-tighter text-white uppercase leading-none">Lobby Upgrade</h4>
                      <div className="space-y-8 border-t border-white/10 pt-10 font-mono">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 uppercase tracking-[0.3em] font-bold">DECISION_STATUS</span>
                              <span className="text-primary font-black flex items-center gap-3">AUTHORIZED</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 uppercase tracking-[0.3em] font-bold">FUSION_CONFIDENCE</span>
                              <span className="text-white font-black text-2xl">99.2%</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* TELEMETRY FABRIC - MISSION CRITICAL ARCHITECTURE */}
      <section id="architecture" className="py-40 border-t border-white/5 bg-[#050505] scroll-mt-24">
        <div className="container mx-auto px-6 text-center mb-36">
          <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6 block font-mono">// SYSTEM_FABRIC_TOPOLOGY</span>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white uppercase">Telemetry Fabric</h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            High-fidelity institutional nervous system mapping multi-platform telemetry into unified project intelligence.
          </p>
        </div>
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="arch-stack">
                {[
                    { id: "L4: ORCHESTRATOR", name: "ACTION_GATEWAY", desc: "Real-time orchestration across 23 active platform streams with AES-256 verification.", icon: Eye, cls: "layer-high" },
                    { id: "L3: COGNITIVE", name: "HEURISTIC_ENGINE", desc: "Vector reasoning across project layers for mission-critical signal validation.", icon: BrainCircuit, cls: "layer-mid-high" },
                    { id: "L2: MEMORY", name: "CONTEXT_HUB", desc: "Unified high-frequency project memory for deterministic project data.", icon: Database, cls: "layer-mid-low" },
                    { id: "L1: TRUTH", name: "NORMALIZED_CORE", desc: "Immutable institutional truth core secured via SOC2 and isolated encryption.", icon: Fingerprint, cls: "layer-low" }
                ].map((layer, i) => (
                    <div key={i} className={`stack-layer ${layer.cls} group`}>
                        <div className="layer-glass tactical-border"></div>
                        <div className="layer-content">
                            <div className={`size-20 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/30 transition-transform group-hover:scale-110`}>
                                <layer.icon className="size-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="layer-id">{layer.id}</span>
                                <h4 className="text-2xl font-black mb-2 text-white uppercase tracking-[0.1em] font-mono">{layer.name}</h4>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">{layer.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* INSTITUTIONAL SECURITY ENFORCEMENT */}
      <section id="metrics" className="py-40 border-t border-white/5 scroll-mt-24 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-44">
            <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6 block font-mono">// DATA_SOVEREIGNTY_ENFORCEMENT</span>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white uppercase">Compliance OS</h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                Shifting project risk discovery and data protection from weeks to milliseconds through institutional audit cycles.
            </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 border border-white/10 bg-white/2 p-14 md:p-20 tactical-border">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-12">
                      <div>
                          <h3 className="text-5xl font-black mb-6 flex items-center gap-5 text-white uppercase font-mono"><BarChart3 className="text-primary size-10" /> AUDIT_VELOCITY</h3>
                          <p className="text-slate-500 text-lg font-bold uppercase tracking-widest">Time to identify project variance.</p>
                      </div>
                      <div className="text-right">
                          <p className="text-9xl md:text-[10rem] font-black text-primary tracking-tighter leading-none font-mono">0.01s</p>
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600 mt-8 font-mono">LEGACY_AUDIT: 14_DAYS</p>
                      </div>
                  </div>
                  <div className="h-[450px] w-full"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="border border-white/10 bg-white/2 p-14 md:p-20 flex flex-col items-center justify-center text-center tactical-border">
                  <div className="size-24 rounded-sm bg-primary/10 flex items-center justify-center text-primary mb-14 border border-primary/30 shadow-[0_0_30px_rgba(0,124,90,0.2)]"><Lock className="size-12" /></div>
                  <h3 className="text-[11px] font-black mb-16 uppercase tracking-[0.6em] text-primary font-mono">GOVERNANCE_PROTOCOL</h3>
                  <div className="relative size-72 mb-16">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-7xl font-black text-white leading-none font-mono">98%</span>
                          <span className="text-[11px] text-slate-500 uppercase font-black tracking-[0.3em] mt-6 font-mono">PROTECTED</span>
                      </div>
                  </div>
                  <div className="p-10 bg-black border border-white/10 text-left w-full rounded-sm">
                      <div className="flex items-center gap-3 mb-6">
                          <ShieldAlert className="size-5 text-primary" />
                          <h4 className="text-xl font-black text-white uppercase tracking-[0.1em] font-mono">Data Sovereignty</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider">Institutional DLP and granular Access Control (RBAC) ensure sovereign data integrity. Continuous SOC2/ISO audit compliance enforced at every node.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* FOOTER - TACTICAL BRANDING */}
      <footer className="bg-black border-t border-white/10 py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-4xl font-black text-white mb-8 uppercase tracking-[0.5em] font-mono">ENVISION OS</p>
          <p className="max-w-2xl mx-auto text-slate-500 text-xl font-bold mb-16 leading-relaxed tracking-tight uppercase">Unified Source of Truth for Institutional Construction Asset Management.</p>
          <div className="inline-block px-10 py-4 border border-white/20 bg-white/5 text-[10px] font-black uppercase tracking-[0.7em] text-slate-600 font-mono tactical-border">
            PROTOCOL_ACTIVE: MISSION_CRITICAL_TRANSPARENCY
          </div>
        </div>
      </footer>

      {/* GLOBAL TACTICAL STYLES */}
      <style jsx global>{`
        .scanline::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 124, 90, 0.03) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 50;
        }

        .grid-overlay {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(0, 124, 90, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 124, 90, 0.15) 1px, transparent 1px);
        }

        @keyframes particle-fly {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(400px); opacity: 0; }
        }

        .animate-particle-fly {
          animation: particle-fly 3s infinite linear;
        }

        @keyframes ingest-stream {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-ingest-stream {
          animation: ingest-stream 2.5s infinite linear;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }

        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.4; }
        }

        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
        .animate-pulse-fast { animation: pulse-fast 3s infinite ease-in-out; }

        .tu-hub {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
        }

        .tu-hub-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .tu-hub-core {
            width: 120px;
            height: 120px;
            margin-bottom: 20px;
        }

        .tu-sat {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -30px;
            margin-left: -80px;
        }

        /* Responsive Architecture Stack */
        @media (max-width: 768px) {
            .arch-stack { height: 600px; }
            .stack-layer { max-width: 100%; height: 160px; }
            .layer-high { transform: translateZ(120px) !important; }
            .layer-mid-high { transform: translateZ(60px) !important; }
            .layer-mid-low { transform: translateZ(0px) !important; }
            .layer-low { transform: translateZ(-60px) !important; }
            
            .layer-content { padding: 16px; }
            .layer-content h4 { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}

