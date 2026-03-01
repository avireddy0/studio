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
  MessageCircle,
  Hash,
  FileText,
  MapPin,
  AlertTriangle,
  Globe,
  RadioTower,
  Box,
  CornerRightDown,
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const isRunning = useRef(false);

  // --- C2 Terminal Logic ---
  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const addMessage = useCallback((content: string, type: 'user' | 'system', meta = '', metric = '') => {
    setMessages(prev => [...prev, {id: Date.now() + Math.random(), content, type, meta, metric}])
  }, []);

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isRunning.current) return;
    
    const cmd = inputValue.trim();
    setInputValue("");
    isRunning.current = true;
    
    addMessage(`> ${cmd}`, 'user');
    scrollToBottom();
    
    // Simulate processing
    await new Promise(r => setTimeout(r, 600));
    
    let response = "COMMAND_NOT_RECOGNIZED. Type 'HELP' for available protocols.";
    let metric = "ERR_CODE: 404";
    let meta = "SYSTEM_NODE_88";

    if (cmd.toUpperCase().includes("AUDIT") || cmd.toUpperCase().includes("COST") || cmd.toUpperCase().includes("BUDGET")) {
        response = "CRITICAL_ALERT: Job 402 is 12.4% over variance. Dryer-wall rework identified as the primary cost driver. Subcontractor recovery protocols initiated.";
        metric = "MARGIN_PROTECTION: $124.5K SECURED";
        meta = "FUSION_SOURCE: SAGE_FINANCE, PROCORE_API";
    } else if (cmd.toUpperCase().includes("STATUS") || cmd.toUpperCase().includes("FLOW") || cmd.toUpperCase().includes("CO")) {
        response = "ESTIMATED_CO: MARCH 14. Fire safety systems verified by Inspector Davis at 10:42 AM. Schedule integrity remains nominal.";
        metric = "SCHEDULE_CONFIDENCE: 98.4%";
        meta = "FUSION_SOURCE: PERMIT_LOGS, FIELD_REPORTS";
    } else if (cmd.toUpperCase() === "HELP") {
        response = "AVAILABLE_PROTOCOLS: \n- AUDIT [target]\n- STATUS [project_id]\n- CLEAR (wipe terminal)\n- INITIALIZE_NODE (reboot sequence)";
        metric = "SYS_OP_MANUAL";
        meta = "ENVISION_CORE_v3";
    } else if (cmd.toUpperCase() === "CLEAR") {
        setMessages([{id: Date.now(), content: "TERMINAL_CLEARED.", type: 'system', meta: 'SYS_MSG', metric: 'OK'}]);
        isRunning.current = false;
        return;
    }

    addMessage(response, 'system', meta, metric);
    scrollToBottom();
    isRunning.current = false;
  };

  useEffect(() => {
      if(messages.length === 0) {
        addMessage(
            "ENVISION_OS_v3.1_CONNECTED. SECURE_PROTOCOL_ENGAGED.\nAwaiting operator input...",
            'system',
            'AUTH_SUCCESS: ADMIN_NODE',
            'ENC: AES-256'
        );
      }
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- Charts Logic ---
  useEffect(() => {
    const chartInstances: Chart[] = [];
    
    // Global chart defaults for tactical look
    Chart.defaults.color = '#00FF41';
    Chart.defaults.font.family = 'monospace';

    if (latencyChartRef.current) {
        const ctx = latencyChartRef.current.getContext('2d');
        if (ctx) {
            chartInstances.push(new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['MANUAL_AUDIT', 'LEGACY_CRM', 'ENVISION_OS'],
                    datasets: [{
                        label: 'LATENCY_DAYS',
                        data: [45, 14, 0.01], 
                        backgroundColor: ['rgba(255,0,0,0.5)', 'rgba(255,165,0,0.5)', 'rgba(0,255,65,0.8)'],
                        borderColor: ['#FF0000', '#FFA500', '#00FF41'],
                        borderWidth: 1,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { 
                            grid: { color: 'rgba(0,255,65,0.1)' }, 
                            ticks: { color: '#00FF41' } 
                        },
                        y: { 
                            grid: { display: false }, 
                            ticks: { color: '#00FF41', font: { size: 10 } } 
                        }
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
                    labels: ['VERIFIED_DATA', 'UNVERIFIED_NOISE'],
                    datasets: [{
                        data: [98.2, 1.8],
                        backgroundColor: ['rgba(0,255,65,0.8)', 'rgba(255,0,0,0.3)'],
                        borderColor: '#00FF41',
                        borderWidth: 1
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
    <div className="flex flex-col w-full min-h-screen text-[#00FF41] selection:bg-[#00FF41] selection:text-black">
      
      {/* C2 HUD TOP BAR */}
      <nav className="fixed top-0 w-full z-[100] bg-black border-b border-[#00FF41]/30 px-6 py-2 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white glitch" data-text="ENVISION_OS">
            <Target className="size-4 text-[#00FF41]" />
            ENVISION_OS
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/50">SYS.VER: 3.1.8</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[#00FF41]/60">
            <a href="#overview" className="hover:text-[#00FF41] transition-colors">INTEL_OVERVIEW</a>
            <a href="#ingestion" className="hover:text-[#00FF41] transition-colors">DATA_PIPELINE</a>
            <a href="#fusion" className="hover:text-[#00FF41] transition-colors">CONTEXT_FUSION</a>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-500">REC</span>
            </div>
            <div className="px-3 py-1 border border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] cursor-pointer hover:bg-[#00FF41] hover:text-black transition-colors">
                SYS_ADMIN
            </div>
        </div>
      </nav>

      {/* BLOOMBERG TERMINAL / C2 LANDING VIEW */}
      <section id="overview" className="min-h-screen pt-16 p-4 tactical-grid relative flex flex-col">
        <div className="absolute top-20 right-8 text-right opacity-50 z-0 pointer-events-none hidden lg:block">
            <p className="text-[6rem] font-bold leading-none">C2</p>
            <p className="tracking-[1em] uppercase">Command_&_Control</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
            
            {/* LEFT COLUMN: INTEL FEED & RISK MATRIX */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                
                {/* PROJECT OVERVIEW PANEL */}
                <div className="c2-panel flex-1 min-h-[250px] flex flex-col">
                    <div className="c2-panel-header">
                        <span>SYS.OP // PROJECT_OVERVIEW</span>
                        <BarChart3 className="size-3" />
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 h-full">
                        <div className="border border-[#333] p-2 flex flex-col justify-between">
                            <span className="text-[8px] text-[#888]">ACTIVE_NODES</span>
                            <span className="text-3xl font-bold text-white">42</span>
                        </div>
                        <div className="border border-[#333] p-2 flex flex-col justify-between">
                            <span className="text-[8px] text-[#888]">RISK_ALERTS</span>
                            <span className="text-3xl font-bold text-red-500 glitch" data-text="03">03</span>
                        </div>
                        <div className="border border-[#333] p-2 flex flex-col justify-between col-span-2 bg-[#00FF41]/5">
                            <span className="text-[8px] text-[#888]">CAPITAL_TRACKED</span>
                            <span className="text-4xl font-bold text-[#00FF41]">$1.4B</span>
                            <span className="text-[8px] text-[#00FF41]/60">VARIANCE: +1.2% THRESHOLD_NOMINAL</span>
                        </div>
                    </div>
                </div>

                {/* RISK MATRIX PANEL */}
                <div className="c2-panel flex-1 min-h-[250px] flex flex-col">
                    <div className="c2-panel-header">
                        <span className="text-red-500">THREAT_INTEL // RISK_MATRIX</span>
                        <AlertTriangle className="size-3 text-red-500" />
                    </div>
                    <div className="p-4 space-y-2 overflow-y-auto">
                        {[
                            { id: "J-402", issue: "Budget Variance > 10%", loc: "Drywall Rev. C", status: "CRITICAL", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
                            { id: "J-118", issue: "Steel Lead Time +2 Wks", loc: "Procurement", status: "ELEVATED", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                            { id: "J-092", issue: "RFI Response Latency", loc: "Structural", status: "MONITOR", color: "text-[#00FF41]", bg: "bg-[#00FF41]/10", border: "border-[#00FF41]/30" },
                            { id: "J-092", issue: "RFI Response Latency", loc: "Structural", status: "MONITOR", color: "text-[#00FF41]", bg: "bg-[#00FF41]/10", border: "border-[#00FF41]/30" },
                        ].map((risk, i) => (
                            <div key={i} className={`p-2 border ${risk.border} ${risk.bg} flex justify-between items-center hover:bg-white/5 cursor-crosshair transition-colors`}>
                                <div>
                                    <div className={`text-[10px] font-bold ${risk.color}`}>{risk.id} // {risk.status}</div>
                                    <div className="text-[12px] text-white">{risk.issue}</div>
                                </div>
                                <CornerRightDown className={`size-3 ${risk.color}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CENTER COLUMN: GEOSPATIAL & BIM (MOCK) */}
            <div className="lg:col-span-6 flex flex-col gap-4 h-[800px] lg:h-auto">
                <div className="c2-panel flex-1 flex flex-col relative">
                    <div className="c2-panel-header absolute top-0 w-full z-20 bg-black/80 backdrop-blur-md">
                        <span>SAT.COM // SITE_INTELLIGENCE</span>
                        <div className="flex gap-2">
                            <span className="px-2 border border-[#00FF41] text-[#00FF41] bg-[#00FF41]/20">GEO</span>
                            <span className="px-2 border border-[#333] text-[#888] hover:text-white cursor-pointer">BIM</span>
                        </div>
                    </div>
                    
                    {/* Mock Map Background */}
                    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A1015]">
                        {/* Fake satellite texture using radial gradients */}
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #1A2530 0%, transparent 40%), radial-gradient(circle at 70% 60%, #152A15 0%, transparent 50%)' }}></div>
                        {/* Topo lines mock */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 20px, #00FF41 21px, #00FF41 22px)' }}></div>
                        {/* Radar sweep */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] border border-[#00FF41]/20 rounded-full">
                            <div className="absolute inset-0 radar-sweep-element"></div>
                        </div>
                        
                        {/* Map Pins */}
                        <div className="absolute top-[30%] left-[40%] flex flex-col items-center group cursor-crosshair">
                            <div className="size-4 border-2 border-red-500 bg-red-500/20 rounded-full animate-ping absolute"></div>
                            <MapPin className="size-6 text-red-500 relative z-10" />
                            <div className="mt-1 px-2 py-0.5 bg-black border border-red-500 text-[8px] text-red-500 hidden group-hover:block whitespace-nowrap z-20">J-402 // VARIANCE ALERT</div>
                        </div>
                        
                        <div className="absolute top-[60%] left-[65%] flex flex-col items-center group cursor-crosshair">
                            <div className="size-3 bg-[#00FF41] rounded-full shadow-[0_0_15px_#00FF41]"></div>
                            <div className="mt-1 px-2 py-0.5 bg-black border border-[#00FF41] text-[8px] text-[#00FF41] hidden group-hover:block whitespace-nowrap z-20">J-092 // NOMINAL</div>
                        </div>

                         <div className="absolute top-[20%] left-[75%] flex flex-col items-center group cursor-crosshair">
                            <div className="size-3 bg-amber-500 rounded-full shadow-[0_0_15px_#FFA500]"></div>
                            <div className="mt-1 px-2 py-0.5 bg-black border border-amber-500 text-[8px] text-amber-500 hidden group-hover:block whitespace-nowrap z-20">J-118 // ELEVATED</div>
                        </div>
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute bottom-4 left-4 z-10 space-y-2">
                        <div className="p-2 bg-black/80 border border-[#00FF41]/30 backdrop-blur-sm text-[10px]">
                            <div className="text-white mb-1">TARGET_LOCK: <span className="text-[#00FF41]">J-402</span></div>
                            <div className="text-[#888]">COORD: 40.7128° N, 74.0060° W</div>
                            <div className="text-[#888]">ELEV: 14M ASL</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: COMMAND TERMINAL */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                <div className="c2-panel flex-1 flex flex-col">
                    <div className="c2-panel-header bg-[#00FF41]/10 border-b-[#00FF41]/30 text-[#00FF41]">
                        <span>OP.COM // SECURE_TERMINAL</span>
                        <Terminal className="size-3" />
                    </div>
                    
                    {/* Chat Output */}
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-4" ref={chatBodyRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'text-white' : 'text-[#00FF41]'}`}>
                                <div className="break-words">
                                    {msg.content.split('\n').map((line: string, i: number) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                {(msg.metric || msg.meta) && (
                                    <div className="mt-2 p-2 border border-[#333] bg-black">
                                        {msg.metric && <div className="text-amber-500">{msg.metric}</div>}
                                        {msg.meta && <div className="text-[#888]">{msg.meta}</div>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-2 border-t border-[#333] bg-black">
                        <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                            <span className="text-white p-2">{'>'}</span>
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="AWAITING_COMMAND..." 
                                className="w-full bg-transparent outline-none text-[#00FF41] placeholder:text-[#333] uppercase"
                                autoFocus
                                disabled={isRunning.current}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* DATA INGESTION PIPELINE */}
      <section id="ingestion" className="py-20 p-4 relative border-t border-[#333] bg-black">
        <div className="c2-panel">
            <div className="c2-panel-header">
                <span>SYS.ARCH // INGESTION_PIPELINE</span>
                <RadioTower className="size-3" />
            </div>
            <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[400px]">
                
                {/* WIDE FLURRY OF ICONS ON THE LEFT */}
                <div className="relative w-full md:w-1/3 h-[300px] border border-[#333] overflow-hidden bg-[#0A0A0A]">
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                    
                    {[
                        { icon: Mail, label: 'EMAIL_SMTP', top: '10%' },
                        { icon: FileText, label: 'PDF_PARSE', top: '30%' },
                        { icon: MessageSquare, label: 'SLACK_API', top: '50%' },
                        { icon: Camera, label: 'SITE_CAM', top: '70%' },
                        { icon: Database, label: 'ERP_SYNC', top: '90%' }
                    ].map((item, i) => (
                        <div 
                            key={i} 
                            className="absolute left-0 flex items-center gap-2 p-2 border border-[#00FF41]/30 bg-black animate-funnel text-[#00FF41]"
                            style={{ 
                                top: item.top, 
                                animationDelay: `${i * 0.4}s` 
                            }}
                        >
                            <item.icon className="size-6" />
                            <span className="text-[10px] hidden sm:block">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* CENTRAL PARSER */}
                <div className="relative z-10">
                    <div className="size-32 border-2 border-amber-500 bg-amber-500/10 flex flex-col items-center justify-center p-4 shadow-[0_0_30px_rgba(255,165,0,0.3)] relative">
                        {/* Connecting lines from left container to parser - visual mock */}
                        <div className="absolute w-10 h-0.5 bg-amber-500/50 -left-10 top-1/2"></div>

                        <Cpu className="size-12 text-amber-500 mb-2" />
                        <span className="text-[10px] text-amber-500 text-center font-bold">NORMALIZATION<br/>ENGINE</span>
                        
                        {/* Output stream */}
                        <div className="absolute w-20 h-1 bg-amber-500 -right-20 top-1/2 flex items-center overflow-hidden">
                            <div className="w-full h-full bg-white animate-scan-horizontal"></div>
                        </div>
                    </div>
                </div>

                {/* STRUCTURED OUTPUT */}
                <div className="w-full md:w-1/3 flex flex-col gap-2 relative z-10 pl-10 md:pl-20">
                    <div className="text-[10px] text-[#888] mb-2">VERIFIED_DATA_STREAM</div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 border border-[#00FF41] bg-[#00FF41]/10 flex items-center px-2 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[#00FF41] opacity-20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            <span className="text-[8px] text-white z-10 relative">0x{Math.random().toString(16).substr(2, 8).toUpperCase()} // SYNC_OK</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* CONTEXT FUSION - 3D LAYERING */}
      <section id="fusion" className="py-20 p-4 border-t border-[#333] bg-black">
        <div className="c2-panel">
            <div className="c2-panel-header">
                <span className="text-secondary">SYS.LOGIC // CONTEXT_FUSION_ENGINE</span>
                <Layers className="size-3 text-secondary" />
            </div>
            
            <div className="p-10 flex flex-col lg:flex-row items-center justify-center gap-20 min-h-[600px]">
                
                {/* 3D Visualizer */}
                <div className="context-container relative w-[300px] h-[400px] perspective-1000">
                    
                    {/* Layer 1: Raw Data (Danger without context) */}
                    <div className="context-layer layer-bottom absolute inset-0 border-2 border-red-500 bg-black/80 p-4 flex flex-col justify-between shadow-[0_20px_50px_rgba(255,0,0,0.2)]">
                        <div className="text-red-500 text-[10px] border-b border-red-500/30 pb-2 flex justify-between">
                            <span>L1: RAW_ISOLATED_DATA</span>
                            <AlertTriangle className="size-3" />
                        </div>
                        <div className="text-center font-mono space-y-2">
                            <div className="bg-red-500/20 border border-red-500 p-2 text-white text-[10px]">INVOICE: $50,000</div>
                            <div className="text-[8px] text-red-500">STATUS: UNVERIFIED. High risk of duplicate payment or out-of-scope work.</div>
                        </div>
                    </div>

                    {/* Layer 2: Relational Data */}
                    <div className="context-layer layer-middle absolute inset-0 border-2 border-amber-500 bg-black/80 p-4 flex flex-col justify-between shadow-[0_20px_50px_rgba(255,165,0,0.2)]">
                         <div className="text-amber-500 text-[10px] border-b border-amber-500/30 pb-2 flex justify-between">
                            <span>L2: RELATIONAL_GRAPH</span>
                            <Database className="size-3" />
                        </div>
                         <div className="text-center font-mono space-y-2">
                            <div className="text-[10px] text-white">MATCH: PO_9921</div>
                            <div className="text-[8px] text-amber-500">VENDOR: Acme Corp. Subcontract sum aligns, but field work status unknown.</div>
                        </div>
                    </div>

                    {/* Layer 3: Verified Context (The OS Layer) */}
                    <div className="context-layer layer-top absolute inset-0 border-2 border-[#00FF41] bg-[#00FF41]/10 backdrop-blur-md p-4 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,255,65,0.4)]">
                        <div className="text-[#00FF41] text-[10px] border-b border-[#00FF41]/30 pb-2 flex justify-between">
                            <span className="font-bold">L3: VERIFIED_CONTEXT</span>
                            <ShieldCheck className="size-3" />
                        </div>
                        <div className="text-center font-mono space-y-2">
                            <div className="bg-[#00FF41] text-black font-bold p-2 text-[12px] uppercase">PAYMENT_AUTHORIZED</div>
                            <div className="text-[8px] text-white text-left space-y-1">
                                <p>> PM Daily Log confirms work complete.</p>
                                <p>> Geo-tagged photo attached to RFI #12.</p>
                                <p>> Budget variance: 0%.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explanation text */}
                <div className="max-w-md space-y-6">
                    <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Context is Everything.</h3>
                    <p className="text-[#888] text-sm leading-relaxed">
                        Raw data without context is a liability. Our fusion engine correlates isolated events—invoices, field logs, emails—into a verified reality graph.
                    </p>
                    <div className="p-4 border border-[#333] bg-[#111] space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="size-8 border border-red-500 text-red-500 flex items-center justify-center font-bold">1</div>
                            <div className="text-[10px] text-white">Isolated data creates false positives.</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 border border-amber-500 text-amber-500 flex items-center justify-center font-bold">2</div>
                            <div className="text-[10px] text-white">Basic matching lacks field reality.</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 border border-[#00FF41] bg-[#00FF41]/20 text-[#00FF41] flex items-center justify-center font-bold">3</div>
                            <div className="text-[10px] text-[#00FF41]">Envision OS provides absolute verification.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* METRICS - INSTITUTIONAL AUDIT */}
      <section className="py-20 p-4 border-t border-[#333] bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            <div className="c2-panel p-8 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-start mb-8 border-b border-[#333] pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Audit Latency</h3>
                        <p className="text-[#888] text-[10px] uppercase">Time to identify project field variances.</p>
                    </div>
                    <span className="text-4xl font-bold text-[#00FF41]">0.01s</span>
                </div>
                <div className="flex-1 relative">
                    <canvas ref={latencyChartRef}></canvas>
                </div>
            </div>

            <div className="c2-panel p-8 min-h-[400px] flex flex-col items-center justify-center">
                <Shield className="size-16 text-[#00FF41] mb-8" />
                <div className="relative size-48 mb-8">
                    <canvas ref={coverageChartRef}></canvas>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">98%</span>
                        <span className="text-[8px] text-[#00FF41] uppercase">Protection_Engaged</span>
                    </div>
                </div>
                <div className="w-full border-t border-[#333] pt-4 text-center">
                    <h4 className="text-white font-bold uppercase mb-2">Institutional DLP</h4>
                    <p className="text-[#888] text-[10px]">Continuous SOC2 compliance monitoring across all linked nodes.</p>
                </div>
            </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] border-t border-[#333] p-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-white text-xl font-bold tracking-[0.5em] mb-4">
            <Target className="size-6 text-[#00FF41]" />
            ENVISION_OS
        </div>
        <p className="text-[#888] text-[10px] uppercase tracking-widest mb-8">Weapons-grade construction intelligence.</p>
        <div className="inline-block border border-[#00FF41] text-[#00FF41] px-4 py-2 text-[10px] uppercase hover:bg-[#00FF41] hover:text-black transition-colors cursor-pointer">
            INITIATE_HANDSHAKE
        </div>
      </footer>
    </div>
  );
}