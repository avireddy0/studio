'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';
import { Database, Layers, Mail, MessageSquare, FileText, Phone, Zap, Target, ShieldCheck, Share2, BrainCircuit, Activity, Lock, Cpu, TrendingUp, AlertTriangle } from 'lucide-react';

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
        "<span class='text-[var(--accent-emerald)] font-bold'>Profit Protection: $124,500 saved via automated claim detection.</span>",
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
        "<span class='text-[var(--accent-emerald)] font-bold'>Schedule Integrity: No delays detected.</span>",
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
        "<span class='text-[var(--accent-amber)] font-bold'>Transparency is the foundation.</span>",
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
            `<strong>Envision OS is online.</strong><br/><span class="text-[var(--text-secondary)] text-xs md:text-sm">Monitoring 23 platforms. Risk Audit Engine: Active.</span>`,
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
                        <h3>Envision OS</h3>
                        <p style="color: var(--accent-blue)">Orchestrator</p>
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
                        <h3 style="color: ${p.color}">${p.name}</h3>
                        <p>${p.tools} Tools Executing</p>
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
            tuTargetRotation += 0.012;
        }
        tuGlobalRotation += (tuTargetRotation - tuGlobalRotation) * 0.05;
        
        if (tuScene) {
          tuScene.style.transform = `rotateX(60deg) rotateZ(${tuGlobalRotation}deg)`;
          const billboards = tuScene.querySelectorAll('.tu-billboard-container');
          billboards.forEach(b => {
              const htmlB = b as HTMLElement;
              const currentZMatch = htmlB.style.transform.match(/translateZ\((.*?)\)/);
              const currentZ = currentZMatch ? currentZMatch[0] : 'translateZ(0px)';
              htmlB.style.transform = `${currentZ} rotateZ(${-tuGlobalRotation}deg) rotateX(-60deg)`;
          });
        }
        animationFrameId = requestAnimationFrame(animateTuScene);
    }
    animateTuScene();

    const handleTuMouseMove = (e: MouseEvent) => {
        if (!tuContainer) return;
        tuIsHovered = true;
        const rect = tuContainer.getBoundingClientRect();
        const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        tuTargetRotation += (xNorm * 0.1); 
    };
    const handleTuMouseLeave = () => {
        tuIsHovered = false;
    };
    
    if (tuContainer) {
      tuContainer.addEventListener('mousemove', handleTuMouseMove);
      tuContainer.addEventListener('mouseleave', handleTuMouseLeave);
    }
    
    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['Manual Audit', 'Excel Tracking', 'Risk Logging', 'Envision OS'],
                    datasets: [{
                        label: 'Days to Discovery',
                        data: [45, 14, 7, 0.01], 
                        backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#232733' }, ticks: { color: '#94A3B8' } },
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
                    labels: ['Audit Shield', 'Remaining Risk'],
                    datasets: [{
                        data: [98, 2],
                        backgroundColor: ['#10B981', '#1e1e1e'],
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

    return () => {
        if (tuContainer) {
            tuContainer.removeEventListener('mousemove', handleTuMouseMove);
            tuContainer.removeEventListener('mouseleave', handleTuMouseLeave);
        }
        cancelAnimationFrame(animationFrameId);
        chartInstances.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#030303] overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] bg-[rgba(3,3,3,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)]" role="navigation">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-violet)]" aria-hidden="true"></div>
            Envision OS
          </div>
          <div className="hidden lg:flex gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#control-plane" className="hover:text-white transition-colors">Control Plane</a>
            <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
            <a href="#context" className="hover:text-white transition-colors">Context</a>
            <a href="#architecture" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="scroll-snap-section flex flex-col items-center justify-center pt-[45vh] pb-32 text-center relative px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight mb-8 bg-gradient-to-b from-white to-[#A8B2C1] text-transparent bg-clip-text drop-shadow-2xl fade-in-up delay-100">
          Where Development meets Data
        </h1>
        <div className="text-lg md:text-2xl text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed mb-12 fade-in-up delay-200">
          <strong className="text-white block font-semibold mb-4 text-xl md:text-3xl">Commercial construction is no longer a black box.</strong>
          Envision OS turns fragmented project reality into verified profit protection through{' '}
          <span className="bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-cyan)] text-transparent bg-clip-text font-semibold">
            continuous multi-platform audit cycles
          </span>.
        </div>
      </section>

      {/* 2. CONTROL PLANE */}
      <section id="control-plane" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 0: The Command Center</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Orchestrator Control Plane</h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Experience Envision OS deliver instant intelligence through its multimodal agentic AI across 23 software platforms in real-time.
          </p>
        </div>
        <div className="container mx-auto px-6 flex items-center justify-center">
          <div className="w-full max-w-4xl h-[600px] rounded-[32px] border border-white/10 bg-zinc-900/30 p-1 shadow-2xl backdrop-blur-3xl overflow-hidden">
            <div className="bg-black/40 rounded-[28px] border border-white/5 flex h-full flex-col overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] animate-pulse"></div>
                    <div className="font-semibold text-xs md:text-sm">#project-command</div>
                </div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)]">390 Tools Active</div>
              </div>
              <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col gap-2" ref={chatBodyRef}>
                {messages.map((msg, index) => {
                    if (msg.type === 'typing') {
                      return (
                          <div key={msg.id} className="msg system">
                              <div className="bubble"><div className="typing-indicator"><span></span><span></span><span></span></div></div>
                          </div>
                      );
                    }
                    return (
                        <div key={index} className={`msg ${msg.type}`}>
                            <div className="bubble shadow-xl" dangerouslySetInnerHTML={{ __html: msg.html }} />
                        </div>
                    );
                })}
                {suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end mt-6">
                      {suggestedReplies.map((reply, index) => (
                          <button
                              key={index}
                              className="px-4 py-2 bg-zinc-800/80 hover:bg-[var(--accent-blue)] border border-white/10 rounded-full text-xs md:text-sm font-medium transition-all"
                              onClick={() => runSimulation(reply.scenarioId)}
                              disabled={isRunning.current}
                              aria-label={`Ask: ${reply.text}`}
                          >
                              {reply.text}
                          </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INGESTION */}
      <section id="ingestion" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 1: Multi-Stream Ingestion</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">From Chaos to Verified Truth</h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
              Construction data is fragmented across thousands of emails, texts, field notes, and spreadsheets. Envision OS captures it all simultaneously.
            </p>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              Our <strong className="text-white font-semibold">Ingestion Pipeline</strong> parses and normalizes every communication stream into a singular, queryable project reality.
            </p>
          </div>
          <div className="flex-1 w-full max-w-2xl">
              <div className="ingestion-viz w-full">
                <div className="ingest-engine-core">
                  <div className="engine-box">
                    <div className="css-icon-parser" aria-label="Parser Interface">{'{ }'}</div>
                    <span className="text-[10px] font-bold tracking-widest mt-2 text-[var(--accent-violet)]">PARSER</span>
                    <div className="engine-laser"></div>
                  </div>
                </div>
                <div className="organized-stream">
                    <div className="json-node data-out-stream" style={{'--d': '0s'} as any}>{'{ "job": 402, "variance": 12% }'}</div>
                    <div className="json-node data-out-stream" style={{'--d': '1s'} as any}>{'{ "rfi": "2024-118", "status": "draft" }'}</div>
                    <div className="json-node data-out-stream" style={{'--d': '2s'} as any}>{'{ "permit": "Aventura-F1", "status": "passed" }'}</div>
                </div>
                {[...Array(20)].map((_, i) => {
                    const types = ['EMAIL', 'TEXT', 'DOC', 'MSG', 'CALL'];
                    const type = types[i % types.length];
                    return (
                      <div key={i} className="flow-item" style={{ 
                          '--d': `${i * 0.15}s`, 
                          '--y': `${20 + (i * 12)%60}%`, 
                          '--r': `${-20 + (i*10)%40}deg`
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
      <section id="context" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1 w-full max-w-2xl">
              <div className="context-fusion-viz w-full">
                <div className="fusion-bubbles">
                  <div className="bubble-snippet b-1">
                    <div className="b-label" style={{ '--c': 'var(--accent-blue)' } as any}>OWNER MEETING</div>
                    <p>"Authorized marble upgrade for the lobby. Adjusted variance expected."</p>
                  </div>
                  <div className="bubble-snippet b-2">
                    <div className="b-label" style={{ '--c': 'var(--accent-amber)' } as any}>SLACK: #PROJECT-FLOW</div>
                    <p>"Procurement lead time is 4 weeks. Logged as schedule delta."</p>
                  </div>
                </div>
                <div className="fusion-center">
                    <div className="fusion-pulse-ring"></div>
                    <div className="fusion-core-node"><Zap className="size-8" /></div>
                </div>
                <div className="fusion-verified-truth">
                    <div className="truth-card">
                        <div className="truth-badge">
                            <ShieldCheck className="size-4" />
                            <span>CONTEXT VERIFIED</span>
                        </div>
                        <h4 className="text-xl font-bold mb-4">Lobby Finish Upgrade</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                <span className="text-[var(--text-tertiary)] uppercase font-mono tracking-tighter">Status</span>
                                <span className="text-emerald-400 font-bold">Approved by Owner</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                <span className="text-[var(--text-tertiary)] uppercase font-mono tracking-tighter">Confidence</span>
                                <span className="text-white font-bold">98.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Context is Everything.</h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
              A $50,000 budget variance is just an alarming number until you know the owner verbally approved it in a meeting yesterday.
            </p>
            <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              This is the <strong>Context Fusion Engine</strong>. It cross-references qualitative data—Slack, Zoom, and RFIs—to tag project reality with near-perfect accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURE */}
      <section id="architecture" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 3: The Intelligence Layer</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">The Command Nervous System</h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Our architectural stack maps queries from plain English through LLM agents down to 390 specific platform tools in under 200 milliseconds.
          </p>
        </div>
        <div className="container mx-auto px-6 flex items-center justify-center">
            <div className="arch-nervous-viz w-full max-w-5xl">
                <div className="nervous-spine" aria-hidden="true"></div>
                <div className="nervous-grid">
                    <div className="nervous-layer">
                        <div className="l-icon"><Share2 className="size-6"/></div>
                        <div className="l-info">
                            <span className="l-tag">L4: ACTION INTERFACE</span>
                            <h4>Tool Gateway</h4>
                            <p>Managing OAuth2 sessions for 390+ specific platform-sync tools for Procore, Sage, and more.</p>
                        </div>
                    </div>
                    <div className="nervous-layer">
                        <div className="l-icon"><BrainCircuit className="size-6"/></div>
                        <div className="l-info">
                            <span className="l-tag">L3: COGNITIVE ENGINE</span>
                            <h4>Reasoning Hub</h4>
                            <p>7 specialized LLM agents analyzing project intent and orchestrating technical data requests.</p>
                        </div>
                    </div>
                    <div className="nervous-layer">
                        <div className="l-icon"><Activity className="size-6"/></div>
                        <div className="l-info">
                            <span className="l-tag">L2: UNIFIED KNOWLEDGE</span>
                            <h4>Live Context</h4>
                            <p>Dynamic vector-search layer consolidating communications and qualitative data into real-time truth.</p>
                        </div>
                    </div>
                    <div className="nervous-layer">
                        <div className="l-icon"><Database className="size-6"/></div>
                        <div className="l-info">
                            <span className="l-tag">L1: NORMALIZED CORE</span>
                            <h4>Field Data Core</h4>
                            <p>The ground truth: BigQuery & Vertex AI storing normalized construction data across all siloes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. ECOSYSTEM */}
      <section id="ecosystem" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 4: The Tool Universe</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">390 Tools. One Reality.</h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Orchestrating complex data flows across your entire construction software ecosystem in real-time.
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
      <section id="metrics" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center mb-24">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Bottom Line Impact</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Risk Discovery Acceleration</h2>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                Envision OS delivers institutional-grade audit integrity, shifting the needle on risk discovery from weeks to milliseconds.
            </p>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
              <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                      <div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-2">Discovery Velocity</h3>
                          <p className="text-[var(--text-secondary)] text-sm">Time required to identify field variances.</p>
                      </div>
                      <div className="text-right mt-6 md:mt-0">
                          <p className="text-5xl md:text-7xl font-bold text-emerald-400 tracking-tighter">0.01s</p>
                          <p className="text-[var(--text-tertiary)] text-[10px] font-mono uppercase tracking-widest mt-2">vs 14 Day Manual Cycle</p>
                      </div>
                  </div>
                  <div className="flex-1 min-h-[300px]"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="bg-zinc-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-bold mb-8 uppercase tracking-widest text-emerald-400 font-mono">Audit Shield</h3>
                  <div className="relative w-full aspect-square max-w-[200px] mb-10">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-4xl md:text-5xl font-bold text-white">98%</span>
                          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-mono tracking-tighter mt-1">Transparency</span>
                      </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
                      <h4 className="text-sm font-bold text-white mb-2">Institutional Integrity</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Every project dollar is cross-referenced against field reality and the master schedule for 100% audit transparency.</p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#030303] border-t border-[var(--border-strong)] py-16 text-center text-sm text-[var(--text-tertiary)]" role="contentinfo">
        <div className="container mx-auto px-6">
          <p className="text-lg font-bold text-white mb-4">Envision OS</p>
          <p>The All-Seeing Eye for Construction Project Management</p>
          <p className="mt-4 font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] text-[10px]">The Single Source of Truth.</p>
        </div>
      </footer>
    </div>
  );
}
