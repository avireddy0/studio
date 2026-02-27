'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';
import { Database, Layers, Mail, MessageSquare, FileText, Phone, Zap, Target, ShieldCheck, Share2, BrainCircuit, Activity, Lock, Cpu, TrendingUp, AlertTriangle, ChevronRight, Globe, BarChart3, Fingerprint, MousePointerClick } from 'lucide-react';

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
  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: 'Which jobs are currently off budget?',
      routes: [
        { text: 'Query Enrichment: Injecting project context', delay: 400 },
        { text: 'Semantic Router: Mapping to Finance Specialist', delay: 700 },
        { text: 'Executing: sage_get_gl, procore_budget', status: 'complete', delay: 1000 },
      ],
      answer:
        'Job 402 is 12% over budget. This is primarily due to drywall rework requested by the tenant. We have already logged the recovery claim with the subcontractor to protect your margins.',
      metric:
        "<span class='text-emerald-600 font-bold'>Profit Protection: $124,500 saved via automated claim detection.</span>",
      meta: 'Source: sage_intacct, procore_data',
      followUp: [
        { text: "What's the cost code?", scenarioId: 4 },
        { text: "Draft an RFI about this.", scenarioId: 5 },
      ]
    },
    2: {
      query: 'When are we receiving a CO for Flow Aventura?',
      routes: [
        { text: "Context Layer: Entity match 'Flow Aventura'", delay: 300 },
        { text: 'Route to: Project Specialist', status: 'complete', delay: 800 },
        { text: 'Vertex Search: Scanning 227 document streams...', delay: 1200 },
      ],
      answer:
        'March 14th. The City of Aventura verified all fire safety systems today. This clears the final hurdle for the scheduled tenant move-ins.',
      metric:
        "<span class='text-emerald-600 font-bold'>Schedule Integrity: No delays detected.</span>",
      meta: 'Source: ACC_Annexure_002, City Permit Logs',
      followUp: [
          { text: "Tell me more about permit logs.", scenarioId: 6},
          { text: "Who is the PM?", scenarioId: 7}
      ]
    },
    3: {
      query: "Can't we just do this with ChatGPT?",
      routes: [
        { text: "Conversation Manager: Intent 'System Refutation'", delay: 500 },
        { text: "Instant Match: Policy triggered (<1ms)", status: 'complete', delay: 900 },
      ],
      answer:
        'Generic AI assumes clean data. Envision OS handles the mess—fragmented PDFs, phone call transcripts, and broken spreadsheets—turning chaos into verified profit protection and institutional-grade transparency.',
      metric:
        "<span class='text-amber-600 font-bold'>Transparency is the foundation.</span>",
      meta: 'System Policy: The Structural Reality',
      followUp: [
          { text: "Which jobs are off budget?", scenarioId: 1 },
          { text: "When are we getting a CO?", scenarioId: 2 },
      ]
    },
    4: {
        query: "What's the cost code for that rework?",
        routes: [
            { text: "Context Preservation: Linking to Job 402", delay: 300},
            { text: "Executing: sage_get_cost_code", status: "complete", delay: 800},
        ],
        answer: "The cost code is <span class='font-mono'>14-550-3B-R01</span>. This has been automatically reconciled with the main contract budget to ensure audit readiness.",
        metric: "Automatic budget audit complete.",
        meta: "Source: sage_intacct",
        followUp: [
          { text: "Thanks!", scenarioId: 8 },
        ]
    },
    5: {
        query: "Draft an RFI to the architect about this.",
        routes: [
            { text: "Context Preservation: Linking to Job 402", delay: 300},
            { text: "Route to: RFI Generation Agent", status: "complete", delay: 900},
            { text: "Executing: procore_generate_rfi", delay: 1400},
        ],
        answer: "RFI draft #2024-118 created in Procore.<br>Subject: Discrepancy in Drywall Budget vs. Architectural Deltas for Job 402.",
        metric: "Awaiting your review before sending.",
        meta: "Source: procore_api",
        followUp: [
            { text: "Show me other open RFIs.", scenarioId: 9 },
        ]
    },
    8: {
        query: "Thanks!",
        routes: [],
        answer: "You're welcome. Envision OS is monitoring 23 platforms for any project risks. How else can I help protect your margins today?",
        metric: "",
        meta: "",
        followUp: initialSuggestions
    },
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
    async (id: keyof typeof scenarios) => {
      if (isRunning.current) return;
      isRunning.current = true;
      setSuggestedReplies([]);

      const data = scenarios[id];
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
      }

      isRunning.current = false;
    },
    [addMessage, addTyping, scrollToBottom]
  );
  
  useEffect(() => {
      if(messages.length === 0) {
        addMessage(
            `<strong>Envision OS is online.</strong><br/><span class="text-slate-500 text-xs md:text-sm">Continuous Audit Engine: Active. Monitoring 23 data streams.</span>`,
            'system'
        );
      }
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);
  
  useEffect(() => {
    const chartInstances: Chart[] = [];
    const isMobile = window.innerWidth < 768;

    const platforms = [
        { id: 'finance', name: 'Finance', color: 'var(--accent-amber)', tools: 58 },
        { id: 'comms', name: 'Comms', color: 'var(--accent-blue)', tools: 85 },
        { id: 'project', name: 'Project', color: 'var(--accent-emerald)', tools: 53 },
        { id: 'hr', name: 'HR/Ops', color: 'var(--accent-violet)', tools: 42 },
        { id: 'sales', name: 'Sales', color: 'var(--accent-pink)', tools: 40 },
        { id: 'research', name: 'Research', color: 'var(--accent-cyan)', tools: 50 },
        { id: 'infra', name: 'Infra', color: '#64748B', tools: 62 }
    ];

    const tuScene = tuSceneRef.current;
    const tuContainer = tuContainerRef.current;
    const orbRadius = isMobile ? 180 : 320;

    if (tuScene) {
      tuScene.innerHTML = '<div class="tu-grid"></div>';

      const hub = document.createElement('div');
      hub.className = 'tu-hub';
      hub.innerHTML = `
        <div class="tu-hub-front">
            <div class="tu-hub-layer" style="transform: translateZ(0px)"></div>
            <div class="tu-hub-layer" style="transform: translateZ(20px)"></div>
            <div class="tu-hub-layer" style="transform: translateZ(40px); border-color: var(--accent-blue); box-shadow: 0 0 50px var(--accent-blue-dim), inset 0 0 30px var(--accent-blue-dim)"></div>
            <div class="tu-billboard-container" style="transform: translateZ(100px)">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
                    <div class="tu-billboard" style="border-top-color: var(--accent-blue)">
                        <h3 style="font-size: 1.1rem; font-weight: 800">Envision OS</h3>
                        <p style="color: var(--accent-blue); font-size: 0.7rem; text-transform: uppercase; font-weight: 700">Orchestrator</p>
                    </div>
                </div>
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
            <div class="tu-sat-layer" style="transform: translateZ(0px); border-color: ${p.color}40; background: ${p.color}10"></div>
            <div class="tu-sat-layer" style="transform: translateZ(15px); border-color: ${p.color}80; background: ${p.color}20"></div>
            <div class="tu-sat-layer" style="transform: translateZ(30px); border-color: ${p.color}; background: ${p.color}40; box-shadow: 0 0 30px ${p.color}40"></div>
            <div class="tu-billboard-container" style="transform: translateZ(70px)">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
                    <div class="tu-billboard" style="border-top-color: ${p.color}">
                        <h3 style="color: ${p.color}; font-weight: 700">${p.name}</h3>
                        <p style="font-size: 0.65rem; color: var(--text-secondary)">${p.tools} Platforms Syncing</p>
                    </div>
                </div>
            </div>
          `;
          tuScene.appendChild(sat);
      });
    }

    let tuGlobalRotation = 0;
    let tuTargetRotation = 0;
    let tuIsHovered = false;
    let animationFrameId: number;

    function animateTuScene() {
        if (!tuIsHovered) {
            tuTargetRotation += 0.01;
        }
        tuGlobalRotation += (tuTargetRotation - tuGlobalRotation) * 0.05;
        
        if (tuScene) {
          tuScene.style.transform = `rotateX(60deg) rotateZ(${tuGlobalRotation}deg)`;
          const billboards = tuScene.querySelectorAll('.tu-billboard-container');
          billboards.forEach(b => {
              const htmlB = b as HTMLElement;
              htmlB.style.transform = `rotateZ(${-tuGlobalRotation}deg) rotateX(-60deg)`;
          });
        }
        animationFrameId = requestAnimationFrame(animateTuScene);
    }
    animateTuScene();

    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['Manual Audit', 'Excel Audit', 'Envision OS'],
                    datasets: [{
                        label: 'Days to Reality',
                        data: [45, 14, 0.01], 
                        backgroundColor: ['#475569', '#3b82f6', '#10b981'],
                        borderRadius: 8,
                        barThickness: 32
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#1e1e20' }, ticks: { color: '#94A3B8' } },
                        y: { grid: { display: false }, ticks: { color: '#94A3B8' } }
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
                    labels: ['Verified', 'Scanning'],
                    datasets: [{
                        data: [98, 2],
                        backgroundColor: ['#10B981', '#0f0f11'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '82%',
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    return () => {
        cancelAnimationFrame(animationFrameId);
        chartInstances.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#020202] overflow-x-hidden selection:bg-primary selection:text-white">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-[rgba(2,2,2,0.85)] backdrop-blur-xl border-b border-white/5" role="navigation">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white group cursor-pointer">
            <div className="size-5 rounded-sm bg-gradient-to-br from-primary to-accent-violet group-hover:rotate-12 transition-transform" aria-hidden="true"></div>
            Envision OS
          </div>
          <div className="hidden lg:flex gap-10 text-sm font-semibold text-slate-400">
            <a href="#command-center" className="hover:text-white transition-colors">Command Center</a>
            <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
            <a href="#context" className="hover:text-white transition-colors">Context</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#metrics" className="hover:text-white transition-colors">Audit Integrity</a>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors hidden sm:block">Get Access</button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="scroll-snap-section flex flex-col items-center justify-center pt-[48vh] pb-32 text-center relative px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
            <div className="absolute top-[20%] left-[10%] w-[30%] aspect-square rounded-full bg-primary/20 blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[40%] aspect-square rounded-full bg-accent-violet/20 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-8 fade-in-up">
                <Globe className="size-3" />
                <span>MULTI-PLATFORM ORCHESTRATOR v2.4</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-10 bg-gradient-to-b from-white via-white to-slate-500 text-transparent bg-clip-text fade-in-up delay-100">
              Where Development <br/> meets Data
            </h1>
            <div className="text-lg md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12 fade-in-up delay-200">
              <span className="text-white block font-semibold mb-4">Construction reality is no longer a black box.</span>
              Turn fragmented communication into verified profit protection through continuous, 
              <span className="text-white"> multi-platform audit cycles</span>.
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up delay-200">
                <button className="bg-primary text-white px-8 py-4 rounded-2xl text-base font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">Start Audit Simulation</button>
                <button className="px-8 py-4 rounded-2xl text-base font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">Read Whitepaper <ChevronRight className="size-4" /></button>
            </div>
        </div>
      </section>

      {/* 2. COMMAND CENTER (REPLACED CONTROL PLANE) */}
      <section id="command-center" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-md bg-accent-emerald-dim text-accent-emerald font-mono text-[10px] uppercase tracking-widest mb-4">Phase 0: The Command Center</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Command Center</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the multimodal AI that monitors 23 software platforms and protects project margins in real-time.
          </p>
        </div>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[700px] glass-card p-1 shadow-2xl overflow-hidden group">
            <div className="bg-[#121212] rounded-[31px] border border-white/5 flex h-full flex-col overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse"></div>
                    <div className="font-bold text-sm tracking-tight">ENVISION OS COMMAND</div>
                </div>
                <div className="font-mono text-[11px] text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter">Live Audit Stream</div>
              </div>
              
              {/* iMessage Inspired Chat Interface */}
              <div className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col gap-4 bg-[#0a0a0a]" ref={chatBodyRef}>
                {messages.map((msg, index) => {
                    if (msg.type === 'typing') {
                      return (
                          <div key={msg.id} className="flex justify-start items-end gap-2 mb-2">
                              <div className="bg-[#e9e9eb] px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="typing-indicator flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                              </div>
                          </div>
                      );
                    }
                    
                    const isUser = msg.type === 'user';
                    return (
                        <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`max-w-[85%] px-5 py-3 text-sm md:text-base ${isUser ? 'bg-[#007AFF] text-white rounded-3xl rounded-br-sm' : 'bg-[#e9e9eb] text-black rounded-3xl rounded-bl-sm'} shadow-sm`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                                {msg.meta && <div className="mt-2 text-[10px] opacity-60 font-mono uppercase tracking-tighter border-t border-black/10 pt-1">{msg.meta}</div>}
                            </div>
                        </div>
                    );
                })}

                {/* Pick an Option Highlight */}
                {suggestedReplies.length > 0 && (
                  <div className="mt-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                      <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold animate-pulse">
                        <MousePointerClick className="size-4" />
                        <span>PICK AN OPTION TO START SIMULATION</span>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center">
                          {suggestedReplies.map((reply, index) => (
                              <button
                                  key={index}
                                  className="px-8 py-4 bg-white text-black hover:bg-primary hover:text-white rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(255,255,255,0.1)] border border-transparent"
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
        </div>
      </section>

      {/* 3. INGESTION */}
      <section id="ingestion" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-left">
            <span className="inline-block px-3 py-1 rounded-md bg-accent-violet-dim text-accent-violet font-mono text-[10px] uppercase tracking-widest mb-4">Phase 1: Multi-Stream Ingestion</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">From Chaos <br/> to Intelligence</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Construction data lives in fragmented silos: thousands of emails, field notes, phone calls, and spreadsheets. Envision OS captures it all simultaneously.
            </p>
            <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-violet/50 transition-colors">
                    <div className="size-10 rounded-xl bg-accent-violet-dim flex items-center justify-center text-accent-violet flex-shrink-0"><Mail className="size-5" /></div>
                    <div>
                        <h4 className="font-bold mb-1">Communication Mining</h4>
                        <p className="text-sm text-slate-500">Unstructured communication is parsed and indexed in real-time.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-violet/50 transition-colors">
                    <div className="size-10 rounded-xl bg-accent-violet-dim flex items-center justify-center text-accent-violet flex-shrink-0"><FileText className="size-5" /></div>
                    <div>
                        <h4 className="font-bold mb-1">Document Normalization</h4>
                        <p className="text-sm text-slate-500">PDFs and spreadsheets are converted into queryable structural truth.</p>
                    </div>
                </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-2xl">
              <div className="ingestion-viz w-full">
                <div className="ingest-engine-core">
                  <div className="engine-box">
                    <div className="css-icon-parser" aria-label="Parser Interface">{'{ }'}</div>
                    <span className="text-[10px] font-black tracking-[0.2em] mt-3 text-accent-violet">AUDIT CORE</span>
                    <div className="engine-laser"></div>
                  </div>
                </div>
                <div className="organized-stream">
                    <div className="json-node data-out-stream" style={{'--d': '0s'} as any}>{'{ "job": 402, "delta": "DRYWALL" }'}</div>
                    <div className="json-node data-out-stream" style={{'--d': '1s'} as any}>{'{ "rfi": 118, "status": "DRAFT" }'}</div>
                    <div className="json-node data-out-stream" style={{'--d': '2s'} as any}>{'{ "permit": "F1", "status": "PASS" }'}</div>
                </div>
                {[...Array(24)].map((_, i) => {
                    const types = ['EMAIL', 'TEXT', 'DOC', 'MSG', 'CALL'];
                    const type = types[i % types.length];
                    return (
                      <div key={i} className="flow-item" style={{ 
                          '--d': `${i * 0.12}s`, 
                          '--y': `${20 + (i * 15)%60}%`, 
                          '--r': `${-25 + (i*12)%50}deg`
                      } as any}>
                          <div className="flurry-item">
                              <div className="skeleton"></div>
                              <div className="skeleton w-3/4"></div>
                              <div className="icon-box">{type}</div>
                          </div>
                      </div>
                    );
                })}
              </div>
          </div>
        </div>
      </section>

      {/* 4. CONTEXT */}
      <section id="context" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 order-2 lg:order-1 w-full max-w-2xl">
              <div className="context-fusion-viz w-full">
                <div className="fusion-bubbles">
                  <div className="bubble-snippet b-1">
                    <div className="b-label" style={{ '--c': 'var(--accent-blue)' } as any}>OWNER MEETING</div>
                    <p>"Authorize the lobby upgrade. Use the premium marble as discussed."</p>
                  </div>
                  <div className="bubble-snippet b-2">
                    <div className="b-label" style={{ '--c': 'var(--accent-amber)' } as any}>SLACK: #PROJECT-FLOW</div>
                    <p>"Procurement lead time is now 4 weeks. Adjusting the master schedule."</p>
                  </div>
                </div>
                <div className="fusion-center">
                    <div className="fusion-pulse-ring"></div>
                    <div className="fusion-core-node"><Zap className="size-10" /></div>
                </div>
                <div className="fusion-verified-truth">
                    <div className="truth-card">
                        <div className="truth-badge">
                            <ShieldCheck className="size-4" />
                            <span>CONTEXT VERIFIED</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-6">Lobby Finish Upgrade</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                <span className="text-slate-500 uppercase font-mono font-bold tracking-tight">Status</span>
                                <span className="text-emerald-400 font-black">Authorized by Owner</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                <span className="text-slate-500 uppercase font-mono font-bold tracking-tight">Confidence</span>
                                <span className="text-white font-black">99.2%</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 text-left">
            <span className="inline-block px-3 py-1 rounded-md bg-accent-blue-dim text-accent-blue font-mono text-[10px] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Context is <br/> Everything.</h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              A budget variance is just a number until you have the context. Envision OS tags project reality by cross-referencing qualitative signals with financial data.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Our <strong>Context Fusion Engine</strong> verifies project decisions through thousands of multi-platform signals to eliminate operational blind spots.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTELLIGENCE LAYER (RESTORED & UPGRADED) */}
      <section id="architecture" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-md bg-accent-violet-dim text-accent-violet font-mono text-[10px] uppercase tracking-widest mb-4">Phase 3: The Intelligence Layer</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Intelligence Layer</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our multi-tiered architecture handles massive construction telemetry, turning high-latency silos into a singular source of real-time intelligence.
          </p>
        </div>
        <div className="container mx-auto px-6">
            <div className="arch-viz-container">
                <div className="arch-stack">
                    <div className="stack-layer">
                        <div className="layer-icon"><Share2 className="size-7" /></div>
                        <div className="layer-info">
                            <span className="layer-tag">L4: ACTION GATEWAY</span>
                            <h4 className="layer-title">Multi-Platform Gateway</h4>
                            <p className="layer-desc">Executing 390 specialized tools across Procore, Sage, Slack, and Autodesk.</p>
                        </div>
                    </div>
                    <div className="stack-layer">
                        <div className="layer-icon"><BrainCircuit className="size-7" /></div>
                        <div className="layer-info">
                            <span className="layer-tag">L3: COGNITIVE LAYER</span>
                            <h4 className="layer-title">Reasoning Orchestrator</h4>
                            <p className="layer-desc">7 specialized LLM agents analyzing project intent and data requests.</p>
                        </div>
                    </div>
                    <div className="stack-layer">
                        <div className="layer-icon"><Cpu className="size-7" /></div>
                        <div className="layer-info">
                            <span className="layer-tag">L2: UNIFIED CONTEXT</span>
                            <h4 className="layer-title">Vector Memory Hub</h4>
                            <p className="layer-desc">Real-time normalization of communications and qualitative data streams.</p>
                        </div>
                    </div>
                    <div className="stack-layer">
                        <div className="layer-icon"><Database className="size-7" /></div>
                        <div className="layer-info">
                            <span className="layer-tag">L1: NORMALIZED CORE</span>
                            <h4 className="layer-title">Field Data Core</h4>
                            <p className="layer-desc">Normalized construction truth stored in Vertex AI & BigQuery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. ECOSYSTEM */}
      <section id="ecosystem" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-md bg-accent-emerald-dim text-accent-emerald font-mono text-[10px] uppercase tracking-widest mb-4">Phase 4: Tool Universe</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">390 Tools. One Reality.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate silos by orchestrating real-time data flows across your entire construction software ecosystem.
          </p>
        </div>
        <div className="container mx-auto px-6 h-[800px] flex items-center justify-center">
          <div className="tu-container w-full" ref={tuContainerRef}>
            <div className="tu-scene" ref={tuSceneRef}>
                <div className="tu-grid" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. METRICS */}
      <section id="metrics" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
        <div className="container mx-auto px-6 text-center mb-24">
            <span className="inline-block px-3 py-1 rounded-md bg-accent-violet-dim text-accent-violet font-mono text-[10px] uppercase tracking-widest mb-4">Bottom Line Impact</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Performance <br/> Acceleration</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Envision OS shifts construction risk discovery from weeks to milliseconds, protecting profit margins at institutional scale.
            </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
              <div className="lg:col-span-2 glass-card p-10 md:p-14 flex flex-col shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14">
                      <div>
                          <h3 className="text-3xl font-bold mb-3 flex items-center gap-2"><BarChart3 className="text-accent-emerald" /> Discovery Velocity</h3>
                          <p className="text-slate-500 text-sm">Time required to identify project field variances.</p>
                      </div>
                      <div className="text-right mt-8 md:mt-0">
                          <p className="text-6xl md:text-8xl font-black text-accent-emerald tracking-tighter leading-none">0.01s</p>
                          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mt-3">VS 14-DAY MANUAL AUDIT</p>
                      </div>
                  </div>
                  <div className="flex-1 min-h-[350px]"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="glass-card p-10 md:p-14 flex flex-col items-center justify-center text-center shadow-2xl">
                  <div className="size-16 rounded-2xl bg-accent-emerald-dim flex items-center justify-center text-accent-emerald mb-10"><Fingerprint className="size-8" /></div>
                  <h3 className="text-sm font-black mb-10 uppercase tracking-[0.3em] text-accent-emerald font-mono">AUDIT SHIELD</h3>
                  <div className="relative w-full aspect-square max-w-[240px] mb-12">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-5xl md:text-6xl font-black text-white leading-none">98%</span>
                          <span className="text-[11px] text-slate-500 uppercase font-black tracking-widest mt-2">TRANSPARENCY</span>
                      </div>
                  </div>
                  <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 text-left w-full">
                      <h4 className="text-base font-bold text-white mb-3">Institutional Integrity</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">Every project dollar is cross-referenced against field reality and communication records for 100% audit transparency.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#020202] border-t border-white/5 py-24 text-center text-sm text-slate-500" role="contentinfo">
        <div className="container mx-auto px-6">
          <p className="text-xl font-black text-white mb-6">Envision OS</p>
          <p className="max-w-md mx-auto leading-relaxed">The Unified Source of Truth for Institutional Construction Asset Management.</p>
          <p className="mt-8 font-mono text-slate-700 uppercase tracking-[0.4em] text-[10px]">Audit Integrity Engines Active.</p>
        </div>
      </footer>
    </div>
  );
}

