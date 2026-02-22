
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { Landmark, MessageCircle, HardHat, Users, TrendingUp, FlaskConical, Server } from 'lucide-react';

type Scenario = {
  query: string;
  routes: { text: string; delay: number; status?: string; }[];
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
  const basetenVizRef = useRef<HTMLDivElement>(null);
  const basetenStackRef = useRef<HTMLDivElement>(null);
  const promptButtonsRef = useRef<NodeListOf<HTMLButtonElement> | null>(null);

  const isRunning = useRef(false);

  const scenarios: Scenarios = {
    1: {
      query: "@EnvisionOS which jobs are off budget?",
      routes: [
        { text: "Query Enrichment: Injecting user context", delay: 400 },
        { text: "Semantic Router: TEI embeddings (<200ms)", delay: 700 },
        { text: "Route to: Finance Specialist", status: "complete", delay: 1000 },
        { text: "Executing: sage_get_gl, procore_budget", delay: 1300 }
      ],
      answer: "Job 402. Drywall is 12% over.<br>Architectural deltas confirm rework.",
      metric: "<span class='text-[var(--accent-emerald)] font-bold'>Decision latency: 0 minutes</span>",
      meta: "Source: sage_intacct, procore_data"
    },
    2: {
      query: "@EnvisionOS when are we receiving a CO for Flow Aventura?",
      routes: [
        { text: "Context Layer: Entity match 'Flow Aventura'", delay: 300 },
        { text: "Route to: Project Specialist", status: "complete", delay: 800 },
        { text: "Executing: get_living_context", delay: 1200 },
        { text: "Vertex Search: Scanning 227 docs...", delay: 1600 }
      ],
      answer: "March 14th.<br>Verified against MEP progress sets and City of Aventura permit logs.",
      metric: "<span class='text-[var(--accent-emerald)] font-bold'>Confidence: 94%</span>",
      meta: "Source: ACC_Annexure_002, unified_communications"
    },
    3: {
      query: "None can't we just do this with ChatGPT?",
      routes: [
        { text: "Conversation Manager: Intent 'System Refutation'", delay: 500 },
        { text: "Instant Match: Rule triggered (<1ms)", status: "complete", delay: 900 }
      ],
      answer: "Generic AI assumes clean, structured data.<br>Construction data is fragmented across PDFs, emails, and broken spreadsheets.",
      metric: "<span class='text-[var(--accent-amber)] font-bold'>Intelligence without infrastructure hallucinates.</span>",
      meta: "System Policy: The Structural Reality"
    }
  };
  
  const toolCategories = [
    {
      name: "Finance",
      count: 58,
      description: "Tools for budget tracking, cost analysis, and financial reporting across platforms like Sage and Procore.",
      icon: Landmark,
      color: "#F59E0B"
    },
    {
      name: "Communications",
      count: 85,
      description: "Connectors for Slack, email, and meeting transcripts to extract qualitative context and decisions.",
      icon: MessageCircle,
      color: "#3B82F6"
    },
    {
      name: "Project Management",
      count: 53,
      description: "Integrations for project scheduling, RFI management, and progress tracking with Procore and Autodesk.",
      icon: HardHat,
      color: "#10B981"
    },
    {
      name: "Human Resources",
      count: 42,
      description: "Tools for workforce management, payroll data sync, and safety compliance reporting.",
      icon: Users,
      color: "#8B5CF6"
    },
    {
      name: "Sales & CRM",
      count: 40,
      description: "Connectors for Salesforce and other CRMs to align project delivery with client expectations.",
      icon: TrendingUp,
      color: "#EC4899"
    },
    {
      name: "Research & Analytics",
      count: 50,
      description: "Tools for market analysis, material science lookups, and historical project data mining.",
      icon: FlaskConical,
      color: "#06B6D4"
    },
    {
      name: "Infrastructure & IT",
      count: 62,
      description: "Utilities for managing data pipelines, system monitoring, and cloud resource provisioning.",
      icon: Server,
      color: "#64748B"
    }
  ];

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
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
    if (prev) { prev.classList.remove('active'); prev.classList.add('complete'); }
    const div = document.createElement('div');
    div.className = `route-node ${statusClass} flex items-center gap-2 text-xs font-mono mb-2`;
    div.innerHTML = `<div class="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div><span>${text}</span>`;
    routingPanelRef.current.appendChild(div);
  }, []);

  const runSimulation = useCallback(async (id: keyof typeof scenarios) => {
    if (isRunning.current) return;
    isRunning.current = true;
    promptButtonsRef.current?.forEach(b => b.disabled = true);
    if(routingPanelRef.current) routingPanelRef.current.innerHTML = '';
    
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
    addMessage(`${data.answer}<br><br>${data.metric}`, 'system', data.meta);
    
    document.querySelectorAll('.route-node.active').forEach(n => {
      n.classList.remove('active');
      n.classList.add('complete');
    });
    
    scrollToBottom();
    promptButtonsRef.current?.forEach(b => b.disabled = false);
    isRunning.current = false;
  }, [addMessage, addRouteNode, addTyping, scrollToBottom]);


  useEffect(() => {
    promptButtonsRef.current = document.querySelectorAll('.prompt-btn');

    // Mouse move effect for 3D stack
    const vizContainer = basetenVizRef.current;
    const stack = basetenStackRef.current;

    const handleMouseMove = (e: MouseEvent) => {
        if (!vizContainer || !stack) return;
        const rect = vizContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xNorm = (x / rect.width) * 2 - 1;
        const yNorm = (y / rect.height) * 2 - 1;
        stack.style.transform = `rotateX(${60 - (yNorm * 8)}deg) rotateZ(${-40 + (xNorm * 12)}deg)`;
    };

    const handleMouseLeave = () => {
        if (stack) {
            stack.style.transform = `rotateX(60deg) rotateZ(-40deg)`;
        }
    };

    if (vizContainer) {
        vizContainer.addEventListener('mousemove', handleMouseMove);
        vizContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
        if (vizContainer) {
            vizContainer.removeEventListener('mousemove', handleMouseMove);
            vizContainer.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
  }, []);

  return (
    <>
    {/* Converted HTML to JSX */}
    <nav className="fixed top-0 w-full z-50 bg-[rgba(5,5,7,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-violet)]"></div>
          Envision OS
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#control-plane" className="hover:text-white transition-colors">Control Plane</a>
          <a href="#ingestion" className="hover:text-white transition-colors">Ingestion</a>
          <a href="#context" className="hover:text-white transition-colors">Context Fusion</a>
          <a href="#architecture" className="hover:text-white transition-colors">Infrastructure</a>
          <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
        </div>
      </div>
    </nav>

    <section className="hero container mx-auto px-6 pt-48 pb-32 text-center relative">
      <div className="inline-flex items-center gap-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] px-5 py-2 rounded-full text-sm font-semibold text-[var(--accent-blue)] mb-8 shadow-[0_0_30px_var(--accent-blue-dim)] uppercase tracking-wider fade-in-up">
        System Update v4.13.0 Active
      </div>
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8 bg-gradient-to-b from-white to-[#94A3B8] text-transparent bg-clip-text drop-shadow-2xl fade-in-up delay-100">
        The Black Box is Dead.
      </h1>
      <div className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-4xl mx-auto leading-relaxed mb-4 fade-in-up delay-200">
        <strong className="text-white block mb-2 font-bold">Truth shouldn&apos;t depend on who&apos;s online.</strong>
        Envision OS collapses the human phone tree, replacing faith-based execution with <span className="bg-gradient-to-r from-[var(--accent-emerald)] to-[var(--accent-cyan)] text-transparent bg-clip-text font-bold">continuous, multi-platform verification.</span>
      </div>
    </section>

    <div className="container mx-auto px-6 mb-32" id="control-plane">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-lg text-[var(--text-secondary)]">
          This section provides a live simulation of the Envision OS interface. It demonstrates the zero-latency decision intelligence powered by the underlying multi-agent architecture. Select a query below to see how the system routes complex questions across 23 platforms in real-time.
        </p>
      </div>

      <div className="simulator bg-[var(--bg-surface-glass)] backdrop-blur-xl border border-[var(--border-strong)] rounded-3xl p-4 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 shadow-2xl">
        <div className="sim-controls bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Test Real-World Queries</div>
          <button className="prompt-btn bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-left p-4 rounded-xl text-sm hover:border-[var(--accent-blue)] hover:translate-y-[-2px] transition-all shadow-lg active:scale-95" onClick={() => runSimulation(1)}>
            &quot;Which jobs are off budget?&quot;
          </button>
          <button className="prompt-btn bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-left p-4 rounded-xl text-sm hover:border-[var(--accent-blue)] hover:translate-y-[-2px] transition-all shadow-lg active:scale-95" onClick={() => runSimulation(2)}>
            &quot;When are we receiving a CO for Flow Aventura?&quot;
          </button>
          <button className="prompt-btn bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-left p-4 rounded-xl text-sm hover:border-[var(--accent-blue)] hover:translate-y-[-2px] transition-all shadow-lg active:scale-95" onClick={() => runSimulation(3)}>
            &quot;Can&apos;t we just do this with ChatGPT?&quot;
          </button>
          
          <div className="mt-auto pt-8 border-t border-[var(--border-subtle)]" ref={routingPanelRef}>
            <div className="text-center text-[var(--text-tertiary)] text-xs">Awaiting query execution...</div>
          </div>
        </div>

        <div className="sim-chat bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-2xl flex flex-col h-[500px] overflow-hidden">
          <div className="p-5 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-surface)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] shadow-[0_0_10px_var(--accent-emerald)]"></div>
            <div className="font-semibold text-sm">#executive-ops</div>
            <div className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">Envision-MCP • 390 Tools</div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4" ref={chatBodyRef}>
            <div className="msg system">
              <div className="bubble">
                <strong>Envision OS is online.</strong><br/>
                <span className="text-[var(--text-secondary)] text-sm">Connected to 23 platforms. 17 Data Routers active.</span>
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
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 1: Ingestion</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Structuring the Chaos.</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            This section visualizes the foundational layer of Envision OS: structuring chaotic construction data. Generic AI assumes clean data; construction data is fragmented across PDFs, emails, and spreadsheets. Intelligence without infrastructure hallucinates.
          </p>
          <p className="text-lg text-[var(--text-secondary)]">
            Envision OS acts as an ingestion engine first. Before an LLM ever sees a prompt, <span className="text-white font-semibold">390 specific tools</span> parse, normalize, and structure reality across 23 different platforms into a deterministic JSON graph.
          </p>
        </div>
        
        <div className="ingestion-viz">
          <div className="pipeline-line-right"></div>
          
          <div className="ingest-engine-core">
            <div className="event-horizon"></div>
            <div className="engine-box">
              <div className="css-icon-parser">{'{ }'}</div>
              <span className="text-[0.7rem] font-bold tracking-widest">PARSER</span>
              <div className="engine-laser"></div>
            </div>
          </div>

          <div className="json-node data-out-1">{'{ "id": "co_04", "status": "approved" }'}</div>
          <div className="json-node data-out-2">{'{ "intent": "schedule_shift" }'}</div>
          <div className="json-node data-out-3">{'{ "variance": 0.12, "src": "sage" }'}</div>
          
          <div className="speed-line" style={{'--d': '0.0s', '--y': '20%'} as React.CSSProperties}></div>
          <div className="speed-line" style={{'--d': '0.7s', '--y': '50%'} as React.CSSProperties}></div>
          <div className="speed-line" style={{'--d': '1.4s', '--y': '80%'} as React.CSSProperties}></div>
          <div className="speed-line" style={{'--d': '0.3s', '--y': '35%'} as React.CSSProperties}></div>
          <div className="speed-line" style={{'--d': '1.1s', '--y': '65%'} as React.CSSProperties}></div>

          <div className="flow-item" style={{'--d': '0.0s', '--y': '10%', '--r': '-25deg', '--s': '1.2', '--c': '#EF4444'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton short"></div><div className="doc-tag">.PDF</div></div></div>
          <div className="flow-item" style={{'--d': '0.3s', '--y': '85%', '--r': '45deg', '--s': '0.8', '--c': '#10B981'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton"></div><div className="doc-tag">.XLSX</div></div></div>
          <div className="flow-item" style={{'--d': '0.6s', '--y': '30%', '--r': '-15deg', '--s': '1.0', '--c': '#3B82F6'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="doc-tag">.EML</div></div></div>
          <div className="flow-item" style={{'--d': '0.9s', '--y': '70%', '--r': '30deg', '--s': '1.1', '--c': '#F59E0B'} as React.CSSProperties}><div className="doc-file"><div className="skeleton short"></div><div className="doc-tag">RFI</div></div></div>
          <div className="flow-item" style={{'--d': '1.2s', '--y': '15%', '--r': '10deg', '--s': '0.9', '--c': '#8B5CF6'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton"></div><div className="doc-tag">.DWG</div></div></div>
          <div className="flow-item" style={{'--d': '1.5s', '--y': '90%', '--r': '-40deg', '--s': '1.3', '--c': '#06B6D4'} as React.CSSProperties}><div className="doc-file"><div className="skeleton short"></div><div className="doc-tag">SUB</div></div></div>
          <div className="flow-item" style={{'--d': '1.8s', '--y': '40%', '--r': '20deg', '--s': '0.7', '--c': '#EC4899'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton"></div><div className="doc-tag">.DOC</div></div></div>
          <div className="flow-item" style={{'--d': '2.1s', '--y': '60%', '--r': '-35deg', '--s': '1.2', '--c': '#64748B'} as React.CSSProperties}><div className="doc-file"><div className="skeleton short"></div><div className="doc-tag">.JPG</div></div></div>
          <div className="flow-item" style={{'--d': '2.4s', '--y': '25%', '--r': '50deg', '--s': '0.8', '--c': '#EF4444'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton short"></div><div className="doc-tag">.PDF</div></div></div>
          <div className="flow-item" style={{'--d': '2.7s', '--y': '75%', '--r': '-10deg', '--s': '1.1', '--c': '#10B981'} as React.CSSProperties}><div className="doc-file"><div className="skeleton"></div><div className="skeleton"></div><div className="doc-tag">.XLSX</div></div></div>
        </div>
      </div>
    </section>

    <section id="context" className="container mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center" dir="rtl">
        <div dir="ltr">
          <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 2: Project Intelligence</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Context is Everything.</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Clean data requires context. This section illustrates how Envision OS extracts qualitative intelligence from unstructured communications to build a complete project picture. A $50,000 budget variance is just an alarming number until you know the owner verbally approved the rework in a Zoom call yesterday.
          </p>
          <p className="text-lg text-[var(--text-secondary)]">
            This is the <strong>Context Fusion Engine</strong>. It automatically parses qualitative data—Slack threads, meeting transcripts, and RFIs—highlights the critical intent, and tags it to your project timeline so you have verified truth, instantly.
          </p>
        </div>

        <div className="context-dovetail-viz" dir="ltr">
          <div className="dt-sources">
            <div className="dt-card dt-card-1">
              <div className="dt-card-head" style={{'--c': 'var(--accent-blue)'} as React.CSSProperties}>Slack: #exec-ops</div>
              <div className="dt-card-body">
                &quot;We reviewed the budget. The VP <span className="dt-highlight dt-hl-1">approved the $50k overrun</span> on drywall.&quot;
              </div>
            </div>
            <div className="dt-card dt-card-2">
              <div className="dt-card-head" style={{'--c': 'var(--accent-emerald)'} as React.CSSProperties}>Zoom Transcript (S2S API)</div>
              <div className="dt-card-body">
                &quot;Architectural delta is fine. <span className="dt-highlight dt-hl-2">Proceed with the rework.</span>&quot;
              </div>
            </div>
            <div className="dt-card dt-card-3">
              <div className="dt-card-head" style={{'--c': 'var(--accent-violet)'} as React.CSSProperties}>Procore RFI-42</div>
              <div className="dt-card-body">
                &quot;<span className="dt-highlight dt-hl-3">Architectural delta confirmed.</span> Pending owner execution.&quot;
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
        <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">Phase 3: Execution</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Intelligence Requires Infrastructure.</h2>
        <p className="text-lg text-[var(--text-secondary)]">
          The intelligence demonstrated above is powered by a robust 5-layer infrastructure built entirely on Google Cloud Platform. This architectural stack maps queries from plain English through LLM agents down to 390 specific MCP tools in under 200 milliseconds.
        </p>
      </div>

      <div className="context-viz-container" ref={basetenVizRef}>
        <div className="baseten-stack" ref={basetenStackRef}>
          <div className="baseten-layer bl-1">
            <div className="layer-head"><h4>Data Layer</h4><span className="tag">L1</span></div>
            <p>BigQuery Warehouse • Vertex AI Search</p>
          </div>
          <div className="baseten-layer bl-2">
            <div className="layer-head"><h4>Compute Layer</h4><span className="tag">L2</span></div>
            <p>GKE Clusters • BIM • LiDAR • Vision</p>
          </div>
          <div className="baseten-layer bl-3">
            <div className="layer-head"><h4>Agent Layer</h4><span className="tag">L3</span></div>
            <p>Vertex AI Engine • 7 Domain LLMs</p>
          </div>
          <div className="baseten-layer bl-4">
            <div className="layer-head"><h4>Gateway Layer</h4><span className="tag">L4</span></div>
            <p>Cloud Run • FastMCP • 390 Tools</p>
          </div>
          <div className="baseten-layer bl-5">
            <div className="layer-head"><h4>Context Layer</h4><span className="tag">L5</span></div>
            <p>Colab Enterprise • Project Configurations</p>
          </div>

          <div className="data-stream ds-1"></div>
          <div className="data-stream ds-2"></div>
          <div className="data-stream ds-3"></div>
        </div>
      </div>
    </section>

    <section id="metrics" className="container mx-auto px-6 py-24 border-t border-[var(--border-strong)]">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="block font-mono text-xs text-[var(--accent-violet)] uppercase tracking-widest mb-4">The Envision OS Toolset</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">390+ Autonomous Tools</h2>
        <p className="text-lg text-[var(--text-secondary)]">
          Envision OS comes equipped with a vast library of specialized tools, enabling it to connect to any data source and perform complex, domain-specific tasks autonomously.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolCategories.map((category) => (
          <div key={category.name} className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-strong)] flex flex-col hover:border-[var(--accent-violet)] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{backgroundColor: `${category.color}20`, color: category.color}}>
                <category.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{category.count} Tools</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] flex-grow mt-2">{category.description}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-strong)] py-12 text-center text-sm text-[var(--text-tertiary)]">
      <div className="container mx-auto">
        <p>Envision OS Demo — Version 4.13.0 — Glass Box Architecture</p>
        <p className="mt-2 font-mono text-[var(--text-secondary)]">Truth Always On.</p>
      </div>
    </footer>
  </>
  );
}

    