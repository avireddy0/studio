'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';
import { Database, Layers, GitPullRequestArrow, Mail, MessageSquare, FileText, Phone, Zap, Target, ShieldCheck, Share2, BrainCircuit, Activity, Lock, Cpu, TrendingUp, AlertTriangle } from 'lucide-react';

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
  { text: "When are we getting a CO for Flow Aventura?", scenarioId: 2 },
  { text: "Can't we just do this with ChatGPT?", scenarioId: 3 },
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
        { text: "What's the cost code for that rework?", scenarioId: 4 },
        { text: "Draft an RFI to the architect about this.", scenarioId: 5 },
      ]
    },
    2: {
      query: 'When are we receiving a Certificate of Occupancy for Flow Aventura?',
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
          { text: "Tell me more about the permit logs.", scenarioId: 6},
          { text: "Who is the PM for Flow Aventura?", scenarioId: 7}
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
        "<span class='text-[var(--accent-amber)] font-bold'>Transparency is not a feature, it's the foundation.</span>",
      meta: 'System Policy: The Structural Reality',
      followUp: [
          { text: "Which jobs are off budget?", scenarioId: 1 },
          { text: "When are we getting a CO for Flow Aventura?", scenarioId: 2 },
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
     6: {
        query: "Tell me more about the permit logs.",
        routes: [
            { text: "Context Preservation: Linking to Flow Aventura", delay: 300},
            { text: "Executing: get_document_summary", status: "complete", delay: 900},
        ],
        answer: "The City of Aventura permit log shows Permit #BLD23-0815 as 'Final Inspection Passed'. This is the final green light required for occupancy.",
        metric: "No outstanding inspections found.",
        meta: "Source: City of Aventura Public Records",
        followUp: [
             { text: "Thanks!", scenarioId: 8 },
        ]
    },
     7: {
        query: "Who is the PM for Flow Aventura?",
        routes: [
            { text: "Route to: HR / Project Directory", status: "complete", delay: 500},
            { text: "Executing: get_personnel_by_project", delay: 900},
        ],
        answer: "The Project Manager for Flow Aventura is <strong>Maria Sanchez</strong>.",
        metric: "",
        meta: "Source: internal_directory",
        followUp: [
             { text: "Thanks!", scenarioId: 8 },
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
     9: {
        query: "Show me other open RFIs.",
        routes: [
            { text: "Route to: Project Specialist", status: "complete", delay: 500},
            { text: "Executing: procore_list_rfis(status='open')", delay: 1100},
        ],
        answer: "There are 4 other open RFIs for Job 402. The most critical is #2024-112 regarding foundation curing times, which is due for response tomorrow.",
        metric: "",
        meta: "Source: procore_api",
        followUp: [
             { text: "Thanks!", scenarioId: 8 },
        ]
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

      await sleep(1200);
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
            `<strong>Envision OS is online.</strong><br/><span class="text-[var(--text-secondary)] text-sm">Monitoring 23 platforms. Risk Audit Engine: Active.</span>`,
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
            tuTargetRotation += 0.015;
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
        tuTargetRotation += (xNorm * 0.15); 
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
                    plugins: { legend: { display: false }, tooltip: { bodyFont: { family: 'Inter' } } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#232733' }, ticks: { color: '#94A3B8', font: { family: 'Inter', weight: '500' } } },
                        y: { grid: { display: false }, ticks: { color: '#94A3B8', font: { family: 'Inter', weight: '600' } } }
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
                    labels: ['Finance', 'Comms', 'Project', 'HR/Ops', 'Sales', 'Research', 'Infra'],
                    datasets: [{
                        data: [58, 85, 53, 42, 40, 50, 62],
                        backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'],
                        borderWidth: 2,
                        borderColor: '#121212'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: { 
                        legend: { display: false },
                        tooltip: { 
                            bodyFont: { family: 'Inter' },
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.label}: ${context.parsed}% Data Verification`;
                                }
                            }
                        }
                    }
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
    <div className="flex flex-col w-full bg-[#030303]">
      <nav className="fixed top-0 w-full z-50 bg-[rgba(3,3,3,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-violet)]"></div>
            Envision OS
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#control-plane" className="hover:text-white transition-colors">Control Plane</a>
            <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
            <a href="#context" className="hover:text-white transition-colors">Context</a>
            <a href="#architecture" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <div className="scroll-snap-section pt-[45vh] pb-32 text-center relative px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight mb-8 bg-gradient-to-b from-white to-[#A8B2C1] text-transparent bg-clip-text drop-shadow-2xl fade-in-up delay-100">
          Where Development meets Data
        </h1>
        <div className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-5xl mx-auto leading-relaxed mb-12 fade-in-up delay-200">
          <strong className="text-white block font-semibold mb-4 text-2xl md:text-4xl">Commercial construction is no longer a black box.</strong>
          Envision OS turns fragmented project reality into verified profit protection through{' '}
          <span className="bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-cyan)] text-transparent bg-clip-text font-semibold">
            continuous multi-platform audit cycles
          </span>
          .
        </div>
      </div>

      {/* 2. CONTROL PLANE */}
      <div id="control-plane" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 0: The Command Center</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">Orchestrator Control Plane</h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Experience Envision OS deliver instant intelligence through its multimodal agentic AI across 23 software platforms in real-time.
          </p>
        </div>
      </div>
      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 w-full h-full flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[600px] rounded-[32px] border border-zinc-700/60 bg-zinc-900/30 p-1 shadow-2xl backdrop-blur-3xl overflow-hidden">
            <div className="bg-black/40 rounded-[28px] border border-zinc-800/80 flex h-full flex-col overflow-hidden backdrop-blur-xl">
              <div className="p-5 border-b border-zinc-800 flex items-center gap-3 bg-transparent">
                <div className="w-3 h-3 rounded-full bg-[var(--accent-emerald)] shadow-[0_0_12px_var(--accent-emerald)]"></div>
                <div className="font-semibold text-sm">#project-command</div>
                <div className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">Envision-MCP • 390 Tools Active</div>
              </div>
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-1" ref={chatBodyRef}>
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
                  <div className="suggestions-wrapper flex flex-col items-end mt-6">
                      {suggestedReplies.map((reply, index) => (
                          <button
                              key={index}
                              className="suggestion-item text-right mb-3 px-5 py-3 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95"
                              onClick={() => runSimulation(reply.scenarioId)}
                              disabled={isRunning.current}
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
      </div>

      {/* 3. INGESTION */}
      <div id="ingestion" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 1: Multi-Stream Ingestion</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">From Chaos to Verified Truth</h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              Construction data is fragmented across thousands of emails, text messages, field notes, and broken spreadsheets. Envision OS captures it all simultaneously.
            </p>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
              Before an LLM ever sees a prompt, our <strong className="text-white">Ingestion Pipeline</strong> parses and normalizes every communication stream into a singular, queryable project reality.
            </p>
          </div>
        </div>
      </div>
      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="ingestion-viz w-full shadow-[0_0_100px_rgba(139,92,246,0.1)]">
            <div className="ingest-engine-core">
              <div className="engine-box">
                <div className="css-icon-parser">{'{ }'}</div>
                <span className="text-[0.7rem] font-bold tracking-widest mt-2">PARSER</span>
                <div className="engine-laser"></div>
              </div>
            </div>
            
            <div className="organized-stream">
                <div className="json-node data-out-stream" style={{'--d': '0s'} as any}>{'{ "job": 402, "variance": 0.12, "status": "flagged" }'}</div>
                <div className="json-node data-out-stream" style={{'--d': '1s'} as any}>{'{ "rfi": "2024-118", "type": "architectural", "target": "Job 402" }'}</div>
                <div className="json-node data-out-stream" style={{'--d': '2s'} as any}>{'{ "permit": "BLD23-0815", "city": "Aventura", "status": "cleared" }'}</div>
            </div>

            {[...Array(30)].map((_, i) => {
                const types = ['EMAIL', 'TEXT', 'DOC', 'MSG', 'CALL'];
                const type = types[i % types.length];
                return (
                  <div key={i} className="flow-item" style={{ 
                      '--d': `${i * 0.1}s`, 
                      '--y': `${10 + (i * 15)%80}%`, 
                      '--r': `${-30 + (i*15)%60}deg`, 
                      '--c': '#FFFFFF'
                  } as any}>
                      <div className="flurry-item">
                          <div className="skeleton"></div>
                          <div className="skeleton" style={{ width: '60%' }}></div>
                          <div className="icon-box uppercase">{type}</div>
                      </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>

      {/* 4. CONTEXT */}
      <div id="context" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">Context is Everything.</h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              A $50,000 budget variance is just an alarming number until you know the owner verbally approved the rework in a meeting yesterday.
            </p>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
              This is the <strong>Context Fusion Engine</strong>. It automatically cross-references qualitative data—Slack, Zoom, and RFIs—to tag project reality with 99% accuracy.
            </p>
          </div>
        </div>
      </div>
      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="context-fusion-viz w-full shadow-[0_0_100px_rgba(59,130,246,0.1)]">
            <div className="fusion-bubbles">
              <div className="bubble-snippet b-1">
                <div className="b-label" style={{ '--c': 'var(--accent-blue)' } as any}>OWNER MEETING</div>
                <p>"Authorized the upgrade to Italian marble for the lobby. Impact already discussed."</p>
              </div>
              <div className="bubble-snippet b-2">
                <div className="b-label" style={{ '--c': 'var(--accent-amber)' } as any}>SLACK: #PROJECT-FLOW</div>
                <p>"Marble lead time is 4 weeks. Adjusting procurement schedule now."</p>
              </div>
              <div className="bubble-snippet b-3">
                <div className="b-label" style={{ '--c': 'var(--accent-violet)' } as any}>EMAIL: ARCHITECT</div>
                <p>"Marble specs verified. Request for payment authorized."</p>
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
                    <h4 className="text-2xl font-bold mb-4">Lobby Finish Upgrade</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                            <span className="text-[var(--text-tertiary)] uppercase font-mono tracking-tighter text-[10px]">Variance Status</span>
                            <span className="text-emerald-400 font-bold">Approved by Owner</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                            <span className="text-[var(--text-tertiary)] uppercase font-mono tracking-tighter text-[10px]">Confidence Score</span>
                            <span className="text-white font-bold">98.4%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[var(--text-tertiary)] uppercase font-mono tracking-tighter text-[10px]">Margin Impact</span>
                            <span className="text-emerald-400 font-bold">Protected</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ARCHITECTURE */}
      <div id="architecture" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 3: Execution</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">The Intelligence Layer</h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Our architectural stack maps queries from plain English through LLM agents down to 390 specific MCP tools in under 200 milliseconds.
          </p>
        </div>
      </div>
      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 h-full flex items-center justify-center overflow-visible">
          <div className="intelligence-stack-container">
            <div className="intelligence-stack">
              <div className="stack-layer layer-4">
                 <div className="layer-header">
                    <div className="layer-tag">L4: ACTION INTERFACE</div>
                    <div className="layer-icon"><Share2 className="size-4"/></div>
                 </div>
                 <div className="layer-content">
                    <h4>Tool Gateway</h4>
                    <p>Managing OAuth2 sessions for 390+ specific platform-sync tools for Procore, Sage, and more.</p>
                 </div>
              </div>
              <div className="stack-layer layer-3">
                 <div className="layer-header">
                    <div className="layer-tag">L3: COGNITIVE ENGINE</div>
                    <div className="layer-icon"><BrainCircuit className="size-4"/></div>
                 </div>
                 <div className="layer-content">
                    <h4>Reasoning Hub</h4>
                    <p>7 specialized LLM agents analyzing project intent and orchestrating technical data requests.</p>
                 </div>
              </div>
              <div className="stack-layer layer-2">
                 <div className="layer-header">
                    <div className="layer-tag">L2: UNIFIED KNOWLEDGE</div>
                    <div className="layer-icon"><Activity className="size-4"/></div>
                 </div>
                 <div className="layer-content">
                    <h4>Live Context</h4>
                    <p>Dynamic vector-search layer consolidating communications and qualitative data into real-time truth.</p>
                 </div>
              </div>
              <div className="stack-layer layer-1">
                 <div className="layer-header">
                    <div className="layer-tag">L1: NORMALIZED CORE</div>
                    <div className="layer-icon"><Database className="size-4"/></div>
                 </div>
                 <div className="layer-content">
                    <h4>Field Data Core</h4>
                    <p>The ground truth: BigQuery & Vertex AI storing normalized construction data across all siloes.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. ECOSYSTEM */}
      <div id="ecosystem" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 4: The Tool Universe</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">390 Tools. 7 Platforms. One Reality.</h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Orchestrating complex data flows across your entire construction software ecosystem in real-time.
          </p>
        </div>
      </div>
      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="tu-container w-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.05)]" ref={tuContainerRef}>
            <div className="tu-scene flex items-center justify-center" ref={tuSceneRef}>
                <div className="tu-grid"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. METRICS */}
      <div id="metrics" className="scroll-snap-section py-24 border-t border-[var(--border-strong)] bg-[#030303]">
        <div className="container mx-auto px-6 text-center">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Bottom Line Impact</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">Risk Discovery Acceleration</h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-16 leading-relaxed">
                Envision OS delivers institutional-grade audit integrity, shifting the needle on risk discovery from weeks to milliseconds.
            </p>
        </div>
      </div>

      <div className="visual-snap-section bg-[#030303]">
        <div className="container mx-auto px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full py-12">
              <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-[40px] border border-zinc-700/60 shadow-2xl flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                      <div>
                          <h3 className="text-3xl font-bold mb-2">Discovery Velocity</h3>
                          <p className="text-[var(--text-secondary)]">Time required to identify budget and field variances.</p>
                      </div>
                      <div className="text-right mt-6 md:mt-0">
                          <p className="text-6xl font-bold text-emerald-400 tracking-tighter">0.01s</p>
                          <p className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-widest mt-2">vs 14 Day Manual Cycle</p>
                      </div>
                  </div>
                  <div className="flex-1 min-h-[300px]"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-[40px] border border-zinc-700/60 shadow-2xl flex flex-col items-center justify-center text-center">
                  <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-emerald-400 font-mono">Investment Transparency</h3>
                  <div className="relative w-full aspect-square max-w-[240px] mb-10">
                      <canvas ref={coverageChartRef}></canvas>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-5xl font-bold text-white">98%</span>
                          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-mono tracking-tighter mt-1">Audit Shield</span>
                      </div>
                  </div>
                  <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
                          <h4 className="text-sm font-bold text-white mb-2">Institutional Integrity</h4>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Every project dollar is automatically cross-referenced against field reality and the master schedule for 100% audit transparency.</p>
                      </div>
                      <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">System Status: Active Monitoring</p>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#030303] border-t border-[var(--border-strong)] py-16 text-center text-sm text-[var(--text-tertiary)]">
        <div className="container mx-auto px-6">
          <p className="text-lg font-bold text-white mb-4">Envision OS</p>
          <p>The All-Seeing Eye for Construction Project Management</p>
          <p className="mt-4 font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] text-[10px]">The Single Source of Truth.</p>
        </div>
      </footer>
    </div>
  );
}
