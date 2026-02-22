'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';

type Scenario = {
  query: string;
  routes: { text: string; delay: number; status?: string }[];
  answer: string;
  metric: string;
  meta: string;
};

type Scenarios = {
  [key: number]: Scenario;
};

export default function CanvasPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const routingPanelRef = useRef<HTMLDivElement>(null);
  const basetenVizStackRef = useRef<HTMLDivElement>(null);
  const basetenStackInnerRef = useRef<HTMLDivElement>(null);
  const tuContainerRef = useRef<HTMLDivElement>(null);
  const tuSceneRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);

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
    },
    3: {
      query: "None can't we just do this with ChatGPT?",
      routes: [
        { text: "Conversation Manager: Intent 'System Refutation'", delay: 500 },
        { text: 'Instant Match: Rule triggered (<1ms)', status: 'complete', delay: 900 },
      ],
      answer:
        'Generic AI assumes clean, structured data.<br>Construction data is fragmented across PDFs, emails, and broken spreadsheets.',
      metric:
        "<span class='text-[var(--accent-amber)] font-bold'>Intelligence without infrastructure hallucinates.</span>",
      meta: 'System Policy: The Structural Reality',
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

  const addMessage = useCallback((html: string, type: string, meta = '') => {
    if (!chatBodyRef.current) return;
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    let metaHtml = meta ? `<div class="msg-footer">${meta}</div>` : '';
    div.innerHTML = `<div class="bubble">${html}</div>${metaHtml}`;
    chatBodyRef.current.appendChild(div);
  }, []);

  const addTyping = useCallback(() => {
    if (!chatBodyRef.current) return '';
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'msg system';
    div.id = id;
    div.innerHTML = `<div class="bubble" style="padding: 0.75rem 1rem;"><div class="typing-dot"></div><div class="typing-dot" style="margin:0 4px;"></div><div class="typing-dot"></div></div>`;
    chatBodyRef.current.appendChild(div);
    return id;
  }, []);

  const addRouteNode = useCallback((text: string, statusClass = 'active') => {
    if (!routingPanelRef.current) return;
    const prev = routingPanelRef.current.querySelector('.active');
    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('complete');
    }
    const div = document.createElement('div');
    div.className = `route-node ${statusClass} flex items-center gap-2 text-xs font-mono mb-2`;
    div.innerHTML = `<div class="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div><span>${text}</span>`;
    routingPanelRef.current.appendChild(div);
  }, []);

  const runSimulation = useCallback(
    async (id: keyof typeof scenarios) => {
      if (isRunning.current) return;
      isRunning.current = true;
      document.querySelectorAll('.prompt-btn').forEach(btn => {
        const button = btn as HTMLButtonElement;
        button.disabled = true;
      });
      if (routingPanelRef.current) routingPanelRef.current.innerHTML = '';

      const data = scenarios[id];
      addMessage(data.query, 'user');
      scrollToBottom();

      for (let step of data.routes) {
        await sleep(step.delay);
        addRouteNode(step.text, step.status);
      }

      await sleep(400);
      const typingId = addTyping();
      scrollToBottom();

      await sleep(1500);
      const typingElement = document.getElementById(typingId);
      if(typingElement) typingElement.remove();
      addMessage(
        `${data.answer}<br><br>${data.metric}`,
        'system',
        data.meta
      );

      document.querySelectorAll('.route-node.active').forEach(n => {
        n.classList.remove('active');
        n.classList.add('complete');
      });

      scrollToBottom();
       document.querySelectorAll('.prompt-btn').forEach(btn => {
        const button = btn as HTMLButtonElement;
        button.disabled = false;
      });
      isRunning.current = false;
    },
    [addMessage, addRouteNode, addTyping, scrollToBottom, scenarios]
  );
  
  useEffect(() => {
    const chartInstances: Chart[] = [];

    // --- MOUSE TRACKING FOR PHASE 3 STACK ---
    const vizContainerStack = basetenVizStackRef.current;
    const stackInner = basetenStackInnerRef.current;
    const handleStackMouseMove = (e: MouseEvent) => {
        if (!vizContainerStack || !stackInner) return;
        const rect = vizContainerStack.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xNorm = (x / rect.width) * 2 - 1;
        const yNorm = (y / rect.height) * 2 - 1;
        stackInner.style.transform = `rotateX(${60 - (yNorm * 8)}deg) rotateZ(${-40 + (xNorm * 12)}deg)`;
    };
    const handleStackMouseLeave = () => {
        if (stackInner) {
            stackInner.style.transform = `rotateX(60deg) rotateZ(-40deg)`;
        }
    };
    if (vizContainerStack) {
        vizContainerStack.addEventListener('mousemove', handleStackMouseMove);
        vizContainerStack.addEventListener('mouseleave', handleStackMouseLeave);
    }

    // --- PHASE 4: BASETEN 3D HUB & SPOKE ---
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
    const orbRadius = 380;

    if (tuScene) {
      // Clear previous elements
      tuScene.innerHTML = '<div class="tu-grid"></div>';

      const hub = document.createElement('div');
      hub.className = 'tu-hub';
      hub.innerHTML = `
          <div class="tu-hub-layer" style="transform: translateZ(0px)"></div>
          <div class="tu-hub-layer" style="transform: translateZ(20px)"></div>
          <div class="tu-hub-layer" style="transform: translateZ(40px); border-color: var(--accent-blue); box-shadow: 0 0 50px var(--accent-blue-dim), inset 0 0 30px var(--accent-blue-dim)"></div>
          <div class="tu-billboard-container" style="transform: translateZ(100px)">
               <div class="tu-billboard" style="border-top-color: var(--accent-blue)">
                   <h3>Envision OS</h3>
                   <p style="color: var(--accent-blue)">Core Router</p>
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
                  <div class="tu-billboard" style="border-top-color: ${p.color}">
                      <h3 style="color: ${p.color}">${p.name}</h3>
                      <p>${p.tools} Tools Executing</p>
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
            tuTargetRotation += 0.05;
        }
        tuGlobalRotation += (tuTargetRotation - tuGlobalRotation) * 0.1;
        
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
        tuTargetRotation += (xNorm * 1.5); 
    };
    const handleTuMouseLeave = () => {
        tuIsHovered = false;
    };
    
    if (tuContainer) {
      tuContainer.addEventListener('mousemove', handleTuMouseMove);
      tuContainer.addEventListener('mouseleave', handleTuMouseLeave);
    }
    
    // --- CHART.JS ---
    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['RFI Cycle', 'Change Order', 'Budget Audit', 'Envision OS'],
                    datasets: [{
                        label: 'Hours to Resolution',
                        data: [72, 120, 48, 0.1], 
                        backgroundColor: ['#334155', '#334155', '#334155', '#10B981'],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { bodyFont: { family: 'Inter' } } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#232733' }, ticks: { color: '#94A3B8', font: { family: 'Inter', weight: '500' } } },
                        x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { family: 'Inter', weight: '600' } } }
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
                    labels: ['Finance (58)', 'Comms (85)', 'Project (53)', 'HR (42)', 'Sales (40)', 'Research (50)', 'Infra (62)'],
                    datasets: [{
                        data: [58, 85, 53, 42, 40, 50, 62],
                        backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: { 
                        legend: { position: 'right', labels: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 11, weight: '600' } } },
                        tooltip: { bodyFont: { family: 'Inter' } }
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
  }, [runSimulation]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[rgba(3,3,3,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-violet)]"></div>
            Envision OS
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#control-plane" className="hover:text-white transition-colors">
              Control Plane
            </a>
            <a href="#ingestion" className="hover:text-white transition-colors">
              Ingestion
            </a>
            <a href="#context" className="hover:text-white transition-colors">
              Context Fusion
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Infrastructure
            </a>
            <a href="#ecosystem" className="hover:text-white transition-colors">
              Ecosystem
            </a>
            <a href="#metrics" className="hover:text-white transition-colors">
              Metrics
            </a>
          </div>
        </div>
      </nav>

      <section className="hero container mx-auto px-6 pt-48 pb-32 text-center relative">
        <div className="inline-flex items-center gap-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] px-5 py-2 rounded-full text-sm font-semibold text-[var(--accent-blue)] mb-8 shadow-[0_0_30px_var(--accent-blue-dim)] uppercase tracking-wider fade-in-up">
          System Update v4.13.0 Active
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8 bg-gradient-to-b from-white to-[#94A3B8] text-transparent bg-clip-text drop-shadow-2xl fade-in-up delay-100">
          Where Development meets Data
        </h1>
        <div className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed mb-4 fade-in-up delay-200">
          <strong className="text-white block mb-2 font-bold">
            Construction is no longer a black box.
          </strong>
          Envision OS turns the black box → glass box through{' '}
          <span className="bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-cyan)] text-transparent bg-clip-text font-bold">
            continuous data verification across all platforms
          </span>
          .
        </div>
      </section>

      <div className="container mx-auto px-6 mb-32" id="control-plane">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-lg text-[var(--text-secondary)]">
            Experience Envision OS deliver instant intelligence through its multimodal agentic AI across 23 software platforms in real-time
          </p>
        </div>

        <div className="simulator bg-[var(--bg-surface-glass)] backdrop-blur-xl border border-[var(--border-strong)] rounded-3xl p-4 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 shadow-2xl">
          <div className="sim-controls bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">
              Suggested Queries
            </div>
            <button
              className="prompt-btn bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-subtle)] text-left p-3 rounded-lg text-sm text-white/80 hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] hover:text-white transition-all"
              onClick={() => runSimulation(1)}
            >
              &quot;Which jobs are off budget?&quot;
            </button>
            <button
              className="prompt-btn bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-subtle)] text-left p-3 rounded-lg text-sm text-white/80 hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] hover:text-white transition-all"
              onClick={() => runSimulation(2)}
            >
              &quot;When are we receiving a CO for Flow Aventura?&quot;
            </button>
            <button
              className="prompt-btn bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-subtle)] text-left p-3 rounded-lg text-sm text-white/80 hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--border-strong)] hover:text-white transition-all"
              onClick={() => runSimulation(3)}
            >
              &quot;Can&apos;t we just do this with ChatGPT?&quot;
            </button>

            <div
              className="mt-auto pt-8 border-t border-[var(--border-subtle)]"
              ref={routingPanelRef}
            >
              <div className="text-center text-[var(--text-tertiary)] text-xs">
                Awaiting query execution...
              </div>
            </div>
          </div>

          <div className="sim-chat bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl flex flex-col h-[500px] overflow-hidden">
            <div className="p-5 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-surface)]">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] shadow-[0_0_10px_var(--accent-emerald)]"></div>
              <div className="font-semibold text-sm">#executive-ops</div>
              <div className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">
                Envision-MCP • 390 Tools
              </div>
            </div>
            <div
              className="flex-1 p-6 overflow-y-auto flex flex-col gap-4"
              ref={chatBodyRef}
            >
              <div className="msg system">
                <div className="bubble">
                  <strong>Envision OS is online.</strong>
                  <br />
                  <span className="text-[var(--text-secondary)] text-sm">
                    Connected to 23 platforms. 17 Data Routers active.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent my-16"></div>

      <section id="ingestion" className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div>
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">
              Phase 1: Ingestion
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Structuring the Chaos.
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Generic AI assumes clean data; construction data is fragmented
              across PDFs, emails, and spreadsheets. Intelligence without
              infrastructure hallucinates.
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              Envision OS acts as an ingestion engine first. Before an LLM ever
              sees a prompt,{' '}
              <span className="text-white font-semibold">390 specific tools</span>{' '}
              parse, normalize, and structure reality across 23 different
              platforms into a deterministic JSON graph.
            </p>
          </div>

          <div className="ingestion-viz">
            <div className="pipeline-line-right"></div>

            <div className="ingest-engine-core">
              <div className="event-horizon"></div>
              <div className="engine-box">
                <div className="css-icon-parser">{'{ }'}</div>
                <span className="text-[0.7rem] font-bold tracking-widest">
                  PARSER
                </span>
                <div className="engine-laser"></div>
              </div>
            </div>

            <div className="json-node data-out-1">
              {'{ "id": "co_04", "status": "approved" }'}
            </div>
            <div className="json-node data-out-2">
              {'{ "intent": "schedule_shift" }'}
            </div>
            <div className="json-node data-out-3">
              {'{ "variance": 0.12, "src": "sage" }'}
            </div>

            <div
              className="speed-line"
              style={{ '--d': '0.0s', '--y': '20%' } as React.CSSProperties}
            ></div>
            <div
              className="speed-line"
              style={{ '--d': '0.7s', '--y': '50%' } as React.CSSProperties}
            ></div>
            <div
              className="speed-line"
              style={{ '--d': '1.4s', '--y': '80%' } as React.CSSProperties}
            ></div>
            <div
              className="speed-line"
              style={{ '--d': '0.3s', '--y': '35%' } as React.CSSProperties}
            ></div>
            <div
              className="speed-line"
              style={{ '--d': '1.1s', '--y': '65%' } as React.CSSProperties}
            ></div>

            <div
              className="flow-item"
              style={
                {
                  '--d': '0.0s',
                  '--y': '10%',
                  '--r': '-25deg',
                  '--s': '1.2',
                  '--c': '#EF4444',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton"></div>
                <div className="skeleton short"></div>
                <div className="doc-tag">.PDF</div>
              </div>
            </div>
            <div
              className="flow-item"
              style={
                {
                  '--d': '0.3s',
                  '--y': '85%',
                  '--r': '45deg',
                  '--s': '0.8',
                  '--c': '#10B981',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton"></div>
                <div className="skeleton"></div>
                <div className="doc-tag">.XLSX</div>
              </div>
            </div>
            <div
              className="flow-item"
              style={
                {
                  '--d': '0.6s',
                  '--y': '30%',
                  '--r': '-15deg',
                  '--s': '1.0',
                  '--c': '#3B82F6',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton"></div>
                <div className="doc-tag">.EML</div>
              </div>
            </div>
            <div
              className="flow-item"
              style={
                {
                  '--d': '0.9s',
                  '--y': '70%',
                  '--r': '30deg',
                  '--s': '1.1',
                  '--c': '#F59E0B',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton short"></div>
                <div className="doc-tag">RFI</div>
              </div>
            </div>
            <div
              className="flow-item"
              style={
                {
                  '--d': '1.2s',
                  '--y': '15%',
                  '--r': '10deg',
                  '--s': '0.9',
                  '--c': '#8B5CF6',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton"></div>
                <div className="skeleton"></div>
                <div className="doc-tag">.DWG</div>
              </div>
            </div>
            <div
              className="flow-item"
              style={
                {
                  '--d': '1.5s',
                  '--y': '90%',
                  '--r': '-40deg',
                  '--s': '1.3',
                  '--c': '#06B6D4',
                } as React.CSSProperties
              }
            >
              <div className="doc-file">
                <div className="skeleton short"></div>
                <div className="doc-tag">SUB</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="context" className="container mx-auto px-6 py-24">
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center"
          dir="rtl"
        >
          <div dir="ltr">
            <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">
              Phase 2: Project Intelligence
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Context is Everything.
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Clean data requires context. A $50,000 budget variance is just an
              alarming number until you know the owner verbally approved the
              rework in a Zoom call yesterday.
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              This is the <strong>Context Fusion Engine</strong>. It
              automatically parses qualitative data—Slack threads, meeting
              transcripts, and RFIs—highlights the critical intent, and tags it
              to your project timeline so you have verified truth, instantly.
            </p>
          </div>

          <div className="context-dovetail-viz" dir="ltr">
            <div className="dt-sources">
              <div className="dt-card dt-card-1">
                <div
                  className="dt-card-head"
                  style={{ '--c': 'var(--accent-blue)' } as React.CSSProperties}
                >
                  Slack: #exec-ops
                </div>
                <div className="dt-card-body">
                  &quot;We reviewed the budget. The VP{' '}
                  <span className="dt-highlight dt-hl-1">
                    approved the $50k overrun
                  </span>{' '}
                  on drywall.&quot;
                </div>
              </div>
              <div className="dt-card dt-card-2">
                <div
                  className="dt-card-head"
                  style={
                    { '--c': 'var(--accent-emerald)' } as React.CSSProperties
                  }
                >
                  Zoom Transcript (S2S API)
                </div>
                <div className="dt-card-body">
                  &quot;Architectural delta is fine.{' '}
                  <span className="dt-highlight dt-hl-2">
                    Proceed with the rework.
                  </span>
                  &quot;
                </div>
              </div>
              <div className="dt-card dt-card-3">
                <div
                  className="dt-card-head"
                  style={
                    { '--c': 'var(--accent-violet)' } as React.CSSProperties
                  }
                >
                  Procore RFI-42
                </div>
                <div className="dt-card-body">
                  &quot;
                  <span className="dt-highlight dt-hl-3">
                    Architectural delta confirmed.
                  </span>{' '}
                  Pending owner execution.&quot;
                </div>
              </div>
            </div>

            <div className="dt-particle dt-p-1"></div>
            <div className="dt-particle dt-p-2"></div>
            <div className="dt-particle dt-p-3"></div>

            <div className="dt-insight">
              <div className="dt-insight-card">
                <div className="dt-insight-head">
                  <div className="css-checkmark"></div>
                  <span className="ml-2">Verified Context</span>
                </div>
                <div className="dt-tags">
                  <div className="dt-tag dt-tag-1">Financial Approval</div>
                  <div className="dt-tag dt-tag-2">Verbal Proceed</div>
                  <div className="dt-tag dt-tag-3">Design Confirmed</div>
                </div>
                <div className="dt-conclusion">
                  <h4>Rework Approved</h4>
                  <p>Decision Latency: 0 Minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="container mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">
            Phase 3: Execution
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Intelligence Requires Infrastructure.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            The intelligence demonstrated above is powered by a robust 5-layer
            infrastructure built entirely on Google Cloud Platform. This
            architectural stack maps queries from plain English through LLM
            agents down to 390 specific MCP tools in under 200 milliseconds.
          </p>
        </div>

        <div className="context-viz-container" ref={basetenVizStackRef}>
          <div className="baseten-stack" ref={basetenStackInnerRef}>
            <div className="baseten-layer bl-1">
              <div className="layer-head">
                <h4>Data Layer</h4>
                <span className="tag">L1</span>
              </div>
              <p>BigQuery Warehouse • Vertex AI Search</p>
            </div>
            <div className="baseten-layer bl-2">
              <div className="layer-head">
                <h4>Compute Layer</h4>
                <span className="tag">L2</span>
              </div>
              <p>GKE Clusters • BIM • LiDAR • Vision</p>
            </div>
            <div className="baseten-layer bl-3">
              <div className="layer-head">
                <h4>Agent Layer</h4>
                <span className="tag">L3</span>
              </div>
              <p>Vertex AI Engine • 7 Domain LLMs</p>
            </div>
            <div className="baseten-layer bl-4">
              <div className="layer-head">
                <h4>Gateway Layer</h4>
                <span className="tag">L4</span>
              </div>
              <p>Cloud Run • FastMCP • 390 Tools</p>
            </div>
            <div className="baseten-layer bl-5">
              <div className="layer-head">
                <h4>Context Layer</h4>
                <span className="tag">L5</span>
              </div>
              <p>Colab Enterprise • Project Configurations</p>
            </div>

            <div className="data-stream ds-1"></div>
            <div className="data-stream ds-2"></div>
            <div className="data-stream ds-3"></div>
          </div>
        </div>
      </section>

      <section
        id="ecosystem"
        className="container mx-auto px-6 py-32 border-t border-[var(--border-strong)]"
      >
        <div className="max-w-4xl mx-auto text-center mb-16 relative z-20">
          <span className="block font-mono text-xs text-[var(--accent-emerald)] uppercase tracking-widest mb-4">
            Phase 4: The Tool Universe
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            390 Tools. 7 Platforms.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            The true measure of Envision OS is the scale of its execution. The
            entire architectural topology is rendered below as a massive 3D Hub
            & Spoke environment. The central Envision OS router acts as the hub,
            streaming live execution data out to 7 glowing domain datastacks.
          </p>
        </div>
        <div className="tu-container" ref={tuContainerRef}>
          <div className="tu-scene" ref={tuSceneRef}>
            <div className="tu-grid"></div>
          </div>
        </div>
      </section>

      <section
        id="metrics"
        className="container mx-auto px-6 py-24 border-t border-[var(--border-strong)]"
      >
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">
            Quantitative Impact
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            Measuring the Glass Box.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            This section quantifies the operational impact of the Envision OS
            system, comparing traditional workflow latencies against instant
            resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-strong)]">
            <h3 className="text-2xl font-bold mb-2">
              Decision Latency Collapse
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 text-sm">
              Traditional cycles vs. Envision OS instant resolution.
            </p>
            <div className="chart-container">
              <canvas ref={latencyChartRef}></canvas>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-strong)]">
            <h3 className="text-2xl font-bold mb-2">
              Specialist Tool Coverage
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 text-sm">
              390 Active Tools distributed across domain specialists.
            </p>
            <div className="chart-container">
              <canvas ref={coverageChartRef}></canvas>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-strong)] py-12 text-center text-sm text-[var(--text-tertiary)]">
        <div className="container mx-auto">
          <p>Envision OS Demo — Version 4.13.0 — Glass Box Architecture</p>
          <p className="mt-2 font-mono text-[var(--text-secondary)]">
            Truth Always On.
          </p>
        </div>
      </footer>
    </>
  );
}
