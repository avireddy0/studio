'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Chart from 'chart.js/auto';

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

export default function CanvasPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const basetenVizStackRef = useRef<HTMLDivElement>(null);
  const basetenStackInnerRef = useRef<HTMLDivElement>(null);
  const tuContainerRef = useRef<HTMLDivElement>(null);
  const tuSceneRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState(initialSuggestions);
  const [messages, setMessages] = useState<any[]>([]);

  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: '@EnvisionOS which jobs are off budget?',
      routes: [
        { text: 'Query Enrichment: Injecting user context', delay: 400 },
        { text: 'Semantic Router: TEI embeddings (<200ms)', delay: 700 },
        {
          text: 'Route to: Finance Specialist',
          status: 'complete',
          delay: 1000,
        },
        { text: 'Executing: sage_get_gl, procore_budget', delay: 1300 },
      ],
      answer:
        'Job 402. Drywall is 12% over.<br>Architectural deltas confirm rework.',
      metric:
        "<span class='text-[var(--accent-emerald)] font-bold'>Decision latency: 0 minutes</span>",
      meta: 'Source: sage_intacct, procore_data',
      followUp: [
        { text: "What's the cost code for that rework?", scenarioId: 4 },
        { text: "Draft an RFI to the architect about this.", scenarioId: 5 },
      ]
    },
    2: {
      query: '@EnvisionOS when are we receiving a CO for Flow Aventura?',
      routes: [
        { text: "Context Layer: Entity match 'Flow Aventura'", delay: 300 },
        {
          text: 'Route to: Project Specialist',
          status: 'complete',
          delay: 800,
        },
        { text: 'Executing: get_living_context', delay: 1200 },
        { text: 'Vertex Search: Scanning 227 docs...', delay: 1600 },
      ],
      answer:
        'March 14th.<br>Verified against MEP progress sets and City of Aventura permit logs.',
      metric:
        "<span class='text-[var(--accent-emerald)] font-bold'>Confidence: 94%</span>",
      meta: 'Source: ACC_Annexure_002, unified_communications',
      followUp: [
          { text: "Tell me more about the permit logs.", scenarioId: 6},
          { text: "Who is the PM for Flow Aventura?", scenarioId: 7}
      ]
    },
    3: {
      query: "Can't we just do this with ChatGPT?",
      routes: [
        { text: "Conversation Manager: Intent 'System Refutation'", delay: 500 },
        { text: "Instant Match: Rule triggered (<1ms)", status: 'complete', delay: 900 },
      ],
      answer:
        'Generic AI assumes clean, structured data.<br>Construction data is fragmented across PDFs, emails, and broken spreadsheets.',
      metric:
        "<span class='text-[var(--accent-amber)] font-bold'>Intelligence without infrastructure hallucinates.</span>",
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
        answer: "The cost code is <span class='font-mono'>14-550-3B-R01</span>.",
        metric: "This has been logged to the budget audit trail.",
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
        answer: "The City of Aventura permit log (updated Feb 21) shows Permit #BLD23-0815 as 'Final Inspection Passed'.<br>This confirms all MEP work is complete.",
        metric: "No outstanding inspections are listed.",
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
        answer: "You're welcome. How else can I help?",
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
        answer: "There are 4 other open RFIs for Job 402.<br>The most critical is #2024-112 regarding foundation curing times, due tomorrow.",
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

      await sleep(1500);
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
    [addMessage, addTyping, scrollToBottom, scenarios]
  );
  
  useEffect(() => {
      if(messages.length === 0) {
        addMessage(
            `<strong>Envision OS is online.</strong><br/><span class="text-[var(--text-secondary)] text-sm">Connected to 23 platforms. 17 Data Routers active.</span>`,
            'system'
        );
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom, suggestedReplies]);
  
  useEffect(() => {
    const chartInstances: Chart[] = [];
    const isMobile = window.innerWidth < 768;


    const vizContainerStack = basetenVizStackRef.current;
    const stackInner = basetenStackInnerRef.current;
    const handleStackMouseMove = (e: MouseEvent) => {
        if (!vizContainerStack || !stackInner) return;
        const rect = vizContainerStack.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xNorm = (x / rect.width) * 2 - 1;
        const yNorm = (y / rect.height) * 2 - 1;
        stackInner.style.transform = `rotateX(${55 - (yNorm * 8)}deg) rotateZ(${-30 + (xNorm * 10)}deg)`;
    };
    const handleStackMouseLeave = () => {
        if (stackInner) {
            stackInner.style.transform = `rotateX(55deg) rotateZ(-30deg)`;
        }
    };
    if (vizContainerStack) {
        vizContainerStack.addEventListener('mousemove', handleStackMouseMove);
        vizContainerStack.addEventListener('mouseleave', handleStackMouseLeave);
    }

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
            tuTargetRotation += 0.02;
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
        tuTargetRotation += (xNorm * 0.2); 
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
                    labels: ['Risk Detection', 'Variance Discovery', 'Audit Time', 'Envision OS'],
                    datasets: [{
                        label: 'Hours to Intelligence',
                        data: [168, 720, 48, 0.01], 
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
                                    return ` ${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    }
                }
            }));
        }
    }

    return () => {
        if (vizContainerStack) {
            vizContainerStack.removeEventListener('mousemove', handleStackMouseMove);
            vizContainerStack.removeEventListener('mouseleave', handleStackMouseLeave);
        }
        if (tuContainer) {
            tuContainer.removeEventListener('mousemove', handleTuMouseMove);
            tuContainer.removeEventListener('mouseleave', handleTuMouseLeave);
        }
        cancelAnimationFrame(animationFrameId);
        chartInstances.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <nav className="fixed top-0 w-full z-50 bg-[rgba(3,3,3,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
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
      <div className="scroll-snap-section pt-[28rem] md:pt-[36rem] pb-24 text-center relative">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-8 bg-gradient-to-b from-white to-[#A8B2C1] text-transparent bg-clip-text drop-shadow-lg fade-in-up delay-100">
          Where Development meets Data
        </h1>
        <div className="text-lg md:text-2xl text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed mb-12 fade-in-up delay-200">
          <strong className="text-white block font-semibold mb-2">Construction is no longer a black box.</strong>
          Envision OS turns the black box → glass box through{' '}
          <span className="bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-cyan)] text-transparent bg-clip-text font-semibold">
            continuous data verification across all platforms
          </span>
          .
        </div>
      </div>

      {/* 2. CONTROL PLANE */}
      <div id="control-plane" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 0: The Interface</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Orchestrator Control Plane</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Experience Envision OS deliver instant intelligence through its multimodal agentic AI across 23 software platforms in real-time.
          </p>
        </div>
      </div>
      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 w-full h-full flex items-center justify-center">
          <div className="w-full max-w-3xl h-full max-h-[600px] rounded-3xl border border-zinc-700/60 bg-zinc-900/30 p-1 shadow-2xl backdrop-blur-3xl overflow-hidden">
            <div className="bg-black/40 rounded-2xl border border-zinc-800/80 flex h-full flex-col overflow-hidden backdrop-blur-xl">
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-transparent">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] shadow-[0_0_10px_var(--accent-emerald)]"></div>
                <div className="font-semibold text-sm">#executive-ops</div>
                <div className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">Envision-MCP • 390 Tools</div>
              </div>
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-1" ref={chatBodyRef}>
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
                            <div className="bubble" dangerouslySetInnerHTML={{ __html: msg.html }} />
                        </div>
                    );
                })}
                {suggestedReplies.length > 0 && (
                  <div className="suggestions-wrapper flex flex-col items-end mt-4">
                      {suggestedReplies.map((reply, index) => (
                          <button
                              key={index}
                              className="suggestion-item text-right mb-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30 rounded-full text-sm transition-all"
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
      <div id="ingestion" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 1: Ingestion</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">From Chaos to Control</h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Generic AI assumes clean data; construction data is fragmented across PDFs, emails, and spreadsheets. Intelligence without infrastructure hallucinates.
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              Envision OS acts as an ingestion engine first. Before an LLM ever sees a prompt, <strong className="text-white">390 specific tools</strong> parse, normalize, and structure reality.
            </p>
          </div>
        </div>
      </div>
      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <div className="ingestion-viz w-full">
            <div className="ingest-engine-core">
              <div className="engine-box">
                <div className="css-icon-parser">{'{ }'}</div>
                <span className="text-[0.7rem] font-bold tracking-widest">PARSER</span>
                <div className="engine-laser"></div>
              </div>
            </div>
            
            <div className="organized-stream">
                <div className="json-node data-out-stream" style={{'--d': '0s'} as any}>{'{ "type": "CO", "status": "approved" }'}</div>
                <div className="json-node data-out-stream" style={{'--d': '1s'} as any}>{'{ "type": "RFI", "id": "2024-118" }'}</div>
                <div className="json-node data-out-stream" style={{'--d': '2s'} as any}>{'{ "type": "BUDGET", "variance": 0.12 }'}</div>
            </div>

            {[...Array(16)].map((_, i) => (
                <div key={i} className="flow-item" style={{ 
                    '--d': `${i * 0.15}s`, 
                    '--y': `${10 + (i * 12)%80}%`, 
                    '--r': `${-30 + (i*15)%60}deg`, 
                    '--c': i % 4 === 0 ? 'var(--accent-pink)' : i % 4 === 1 ? 'var(--accent-emerald)' : i % 4 === 2 ? 'var(--accent-blue)' : 'var(--accent-amber)' 
                } as any}>
                    <div className="flurry-item">
                        <div className="skeleton"></div>
                        <div className="skeleton" style={{ width: '60%' }}></div>
                        <div className="icon-box">
                            {i % 4 === 0 ? 'DOC' : i % 4 === 1 ? 'MSG' : i % 4 === 2 ? 'CALL' : 'EMAIL'}
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CONTEXT */}
      <div id="context" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl text-left">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Context is Everything.</h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              A $50,000 budget variance is just an alarming number until you know the owner verbally approved the rework in a meeting yesterday.
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              This is the <strong>Context Fusion Engine</strong>. It automatically parses qualitative data—Slack, Zoom, and RFIs—to tag project reality.
            </p>
          </div>
        </div>
      </div>
      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <div className="context-fusion-viz w-full">
            <div className="fusion-sources">
              <div className="fusion-card fc-1">
                <div className="fc-head" style={{ '--c': 'var(--accent-blue)' } as any}>Owner Meeting Notes</div>
                <div className="fc-body">"Authorized the upgrade to Italian marble for the lobby. Impact already discussed."</div>
              </div>
              <div className="fusion-card fc-2">
                <div className="fc-head" style={{ '--c': 'var(--accent-emerald)' } as any}>PM Slack Thread</div>
                <div className="fc-body">"Marble lead time is 4 weeks. Adjusting procurement schedule now."</div>
              </div>
            </div>
            <div className="fusion-core">
                <div className="fusion-pulse"></div>
            </div>
            <div className="fusion-result">
                <div className="result-card">
                    <div className="result-head flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-bold text-emerald-400 text-xs tracking-widest uppercase">Context Verified</span>
                    </div>
                    <div className="text-xl font-bold mb-2">Lobby Finish Upgrade</div>
                    <div className="space-y-2">
                        <p className="text-sm text-[var(--text-secondary)]">Confidence Score: <span className="text-white">98%</span></p>
                        <p className="text-sm text-[var(--text-secondary)]">Variance Status: <span className="text-emerald-400">Approved by Owner</span></p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ARCHITECTURE */}
      <div id="architecture" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 3: Execution</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Intelligence Requires Infrastructure.</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Our architectural stack maps queries from plain English through LLM agents down to 390 specific MCP tools in under 200 milliseconds.
          </p>
        </div>
      </div>
      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <div className="arch-viz-container w-full" ref={basetenVizStackRef}>
            <div className="arch-stack" ref={basetenStackInnerRef}>
              <div className="arch-layer al-1"><div className="layer-head"><h4>Field Data Core</h4><span className="tag">L1</span></div><p>BigQuery & Vertex AI storing normalized construction truth across all platform silos.</p></div>
              <div className="arch-layer al-2"><div className="layer-head"><h4>Compute Hub</h4><span className="tag">L2</span></div><p>GKE Clusters processing real-time telemetry, LiDAR feeds, and schedule deltas.</p></div>
              <div className="arch-layer al-3"><div className="layer-head"><h4>Reasoning Agent</h4><span className="tag">L3</span></div><p>7 specialized LLMs determining project intent and orchestrating specialized tools.</p></div>
              <div className="arch-layer al-4"><div className="layer-head"><h4>Tool Gateway</h4><span className="tag">L4</span></div><p>Cloud Run instances managing 390 specific platform-sync tools for Procore, Sage, etc.</p></div>
              <div className="arch-layer al-5"><div className="layer-head"><h4>Multi-Platform Memory</h4><span className="tag">L5</span></div><p>Persistent state layer syncing communications into a verified living history.</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. ECOSYSTEM */}
      <div id="ecosystem" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">Phase 4: The Tool Universe</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">390 Tools. 7 Platforms.</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Orchestrating complex data flows across your entire software ecosystem in real-time.
          </p>
        </div>
      </div>
      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <div className="tu-container w-full flex items-center justify-center" ref={tuContainerRef}>
            <div className="tu-scene flex items-center justify-center" ref={tuSceneRef}>
                <div className="tu-grid"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. METRICS */}
      <div id="metrics" className="scroll-snap-section py-16 md:py-24 border-t border-[var(--border-strong)] scroll-mt-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Quantitative Impact</span>
            <h2 className="text-4xl font-bold tracking-tight mb-6">Executive Command Metrics</h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
                Envision OS delivers a "glass box" view into project reality, shifting the needle on risk and audit integrity.
            </p>
        </div>
      </div>

      <div className="visual-snap-section">
        <div className="container mx-auto px-4 md:px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full py-8">
              <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-3xl border border-zinc-700/60 shadow-2xl flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                      <div>
                          <h3 className="text-2xl font-bold mb-1">Risk Discovery Acceleration</h3>
                          <p className="text-[var(--text-secondary)] text-sm">Time to identify budget & schedule risks.</p>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                          <p className="text-5xl font-bold text-emerald-400">99%</p>
                          <p className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-widest">Latency Reduction</p>
                      </div>
                  </div>
                  <div className="flex-1 min-h-[250px]"><canvas ref={latencyChartRef}></canvas></div>
              </div>
              
              <div className="bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-3xl border border-zinc-700/60 shadow-2xl flex flex-col">
                  <h3 className="text-xl font-bold mb-4">Continuous Compliance & Audit</h3>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-full aspect-square max-w-[180px] mb-6">
                        <canvas ref={coverageChartRef}></canvas>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold">98%</span>
                            <span className="text-[8px] text-[var(--text-tertiary)] uppercase font-mono text-center px-4">Automatic Verification</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-br from-white to-slate-500 text-transparent bg-clip-text">Verified Truth</p>
                        <p className="text-[var(--text-secondary)] text-xs font-medium mt-2 leading-relaxed">
                            Every project communication is automatically cross-referenced against field reality and the master schedule.
                        </p>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-strong)] py-12 text-center text-sm text-[var(--text-tertiary)]">
        <div className="container mx-auto">
          <p>Envision OS Demo — Version 4.13.0 — Glass Box Architecture</p>
          <p className="mt-2 font-mono text-[var(--text-secondary)]">Truth Always On.</p>
        </div>
      </footer>
    </div>
  );
}
