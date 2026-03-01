import {
  BrainCircuit,
  Cpu,
  Database,
  Share2,
} from 'lucide-react';
import type { ArchitectureLayer, Scenarios } from '@/types';

export const initialSuggestions = [
  { text: "Which jobs are off budget?", scenarioId: 1 },
  { text: "When are we getting a CO?", scenarioId: 2 },
  { text: "Why not use ChatGPT?", scenarioId: 3 },
];

export const scenarios: Scenarios = {
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

export const architectureLayers: ArchitectureLayer[] = [
  {
    id: 'normalized',
    level: 'L1 \u00b7 NORMALIZED CORE',
    title: 'Field Data Core',
    subtitle:
      'Budget, schedule, and field data are normalized into one reconciled ledger.',
    metric: '2.8M',
    metricLabel: 'records reconciled daily',
    tone: '#06b6d4',
    icon: Database,
    standaloneImpact:
      'Raw systems become queryable, but intent and causality remain fragmented across teams.',
    contextImpact:
      'The Context Layer tags each variance with decision evidence, turning raw records into explainable capital signals.',
    position: { x: 22, y: 76 },
  },
  {
    id: 'context',
    level: 'L2 \u00b7 UNIFIED CONTEXT',
    title: 'Context Layer',
    subtitle:
      'Cross-links owner communication, procurement signals, and field activity into decision-grade truth.',
    metric: '99.2%',
    metricLabel: 'decision confidence',
    tone: '#10b981',
    icon: Cpu,
    standaloneImpact:
      'Context acts as the system memory that interprets competing narratives before they become risk.',
    contextImpact:
      'This is the force multiplier: every downstream action carries provenance, confidence, and investor-readable rationale.',
  },
  {
    id: 'cognitive',
    level: 'L3 \u00b7 COGNITIVE LAYER',
    title: 'Reasoning Orchestrator',
    subtitle:
      'Specialized agents model schedule, cost, and risk implications in real time.',
    metric: '< 400ms',
    metricLabel: 'cross-layer reasoning latency',
    tone: '#3b82f6',
    icon: BrainCircuit,
    standaloneImpact:
      'Fast analysis is possible, but conclusions remain brittle without source-verified project context.',
    contextImpact:
      'Context Layer grounding keeps reasoning aligned with owner intent, reducing false escalations and missed risks.',
    position: { x: 50, y: 16 },
  },
  {
    id: 'action',
    level: 'L4 \u00b7 ACTION GATEWAY',
    title: 'Multi-Platform Gateway',
    subtitle:
      'Operational decisions are executed across Procore, Sage, Slack, and compliance workflows.',
    metric: '390',
    metricLabel: 'integrated tools',
    tone: '#f59e0b',
    icon: Share2,
    standaloneImpact:
      'Execution can be fast, but disconnected actions increase change-order, rework, and reporting exposure.',
    contextImpact:
      'Context-enriched actions push the right intervention first, preserving timeline integrity and margin protection.',
    position: { x: 80, y: 66 },
  },
];

export const toolCategories = [
  { id: 'finance', name: 'Finance', color: 'var(--accent-amber)', tools: 58 },
  { id: 'comms', name: 'Comms', color: 'var(--accent-blue)', tools: 85 },
  { id: 'project', name: 'Project', color: 'var(--accent-emerald)', tools: 53 },
  { id: 'hr', name: 'HR/Ops', color: 'var(--accent-violet)', tools: 42 },
  { id: 'sales', name: 'Sales', color: 'var(--accent-pink)', tools: 40 },
  { id: 'research', name: 'Research', color: 'var(--accent-cyan)', tools: 50 },
  { id: 'infra', name: 'Infra', color: '#64748B', tools: 62 },
];

export const contextSignals = [
  {
    id: 'owner-meeting',
    channel: 'OWNER MEETING',
    quote: 'Authorize the lobby upgrade. Use the premium marble as discussed.',
    detail: 'Source: Meeting transcript \u00b7 Role: Owner Representative',
    strength: 'Signal Strength 0.98',
    revealAt: 1,
  },
  {
    id: 'project-slack',
    channel: 'SLACK \u00b7 #PROJECT-FLOW',
    quote: 'Procurement lead time is now 4 weeks. Adjusting the master schedule.',
    detail: 'Source: Internal Slack \u00b7 Role: Procurement Lead',
    strength: 'Signal Strength 0.94',
    revealAt: 2,
  },
];

export const contextReasoningSteps = [
  {
    id: 'intent',
    title: 'Interpret owner intent',
    detail: 'Detected explicit owner approval for premium lobby finish scope.',
    revealAt: 1,
  },
  {
    id: 'risk-model',
    title: 'Model schedule and cost impact',
    detail: 'Lead-time analysis predicts a 4-week risk if marble procurement remains single-sourced.',
    revealAt: 2,
  },
  {
    id: 'control-plan',
    title: 'Generate control plan',
    detail: 'Recommend parallel supplier bid + RFI release to preserve quality with schedule protection.',
    revealAt: 3,
  },
];

export const contextStatusByStage = [
  'Listening for authoritative project signals\u2026',
  'Owner intent captured. Validating downstream dependencies\u2026',
  'Cross-checking procurement constraints against milestone plan\u2026',
  'Formulating investor-safe control action package\u2026',
  'Context verified. Decision package ready for execution.',
];

export const contextSequence = [0, 1, 2, 3, 4, 4];
