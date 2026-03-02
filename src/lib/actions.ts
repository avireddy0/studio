"use server";

import { z } from "zod";
import { extractDocumentData, DocumentDataExtractionInput } from "@/ai/flows/document-data-extraction-flow";
import { summarizeQualitativeContext, QualitativeContextSummarizationInput } from "@/ai/flows/qualitative-context-summarization";

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

const DEFAULT_PREDICTIVE_FOLLOWUPS = [
  "What if steel tariffs escalate to 25% — cascade impact across all trades?",
  "Predict concrete cost trajectory through Q3 given current supply constraints",
  "Model interest rate sensitivity: +50bps impact on development pro forma",
];

export async function handleQuery(prevState: any, formData: FormData) {
  try {
    const validatedFields = querySchema.safeParse({
      query: formData.get('query'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid query.',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const query = validatedFields.data.query;

    // Check for demo pattern match (suggested prompts always get rich responses)
    const demoResult = getDemoResponse(query);
    if (demoResult) {
      return {
        message: 'Query processed.',
        data: demoResult.content,
        followUps: demoResult.followUps,
      };
    }

    // Custom prompt → try Gemini Flash
    try {
      const geminiResult = await getGeminiFlashResponse(query);
      return {
        message: 'Query processed.',
        data: geminiResult.content,
        followUps: geminiResult.followUps,
      };
    } catch {
      return {
        message: 'Demo response.',
        data: getGenericResponse(query),
        followUps: DEFAULT_PREDICTIVE_FOLLOWUPS,
      };
    }
  } catch (error) {
    const query = (formData.get('query') as string) || '';
    return {
      message: 'Demo response.',
      data: getGenericResponse(query),
      followUps: DEFAULT_PREDICTIVE_FOLLOWUPS,
    };
  }
}

// ─── GEMINI FLASH FOR CUSTOM PROMPTS ────────────────────────
async function getGeminiFlashResponse(query: string): Promise<{ content: string; followUps: string[] }> {
  const { ai } = await import('@/ai/genkit');

  const { text } = await ai.generate({
    model: 'googleai/gemini-3.1-flash-preview',
    prompt: `You are ENVISION OS, an institutional-grade construction intelligence system used by real estate developers and general contractors managing $50M+ commercial construction projects.

You are responding to a project owner/developer who uses your platform to get real-time intelligence across their development portfolio.

RESPONSE FORMAT:
1. Start with "INTEL:" followed by a brief title
2. Include specific numbers, percentages, dollar amounts (realistic for commercial construction)
3. Include a CONFIDENCE INTERVAL for any prediction (format: "Confidence: XX% ± Y%")
4. Frame analysis around how external market conditions (tariffs, material prices, labor rates, interest rates) affect THEIR project
5. Be direct and data-driven — no filler
6. Format like a classified intelligence briefing with section headers using ALL_CAPS
7. End with EXACTLY 3 lines starting with ">>>" — these are predictive follow-up questions the owner should ask next. These MUST be about future scenarios involving external market forces (tariffs, commodity prices, labor market shifts, regulatory changes, weather patterns, interest rates).

PROJECT CONTEXT:
- Project Phoenix: $48.2M mixed-use tower, 24 stories, downtown Los Angeles
- 74.2% complete, scheduled completion Aug 2026
- GMP: $51.8M | Committed: $41.7M | Expended: $38.1M
- Tracking -1.2% under budget ($578K favorable)
- Key risks: steel tariffs (Section 232), RFI backlog (14 open), MEP coordination delays
- Active trades: structural steel, concrete, MEP, curtain wall, elevator, interior finishes
- Owner: Pacific Development Group | GC: Turner-Phoenix JV
- Subcontractors: Martinez Engineering (structural), Dynalectric (electrical), Pan-Pacific Mechanical (HVAC)

User query: ${query}`,
  });

  const lines = (text || '').split('\n');
  const followUps: string[] = [];
  const contentLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('>>>')) {
      followUps.push(line.trim().replace(/^>>>\s*/, ''));
    } else {
      contentLines.push(line);
    }
  }

  return {
    content: contentLines.join('\n').trim(),
    followUps: followUps.length > 0 ? followUps : DEFAULT_PREDICTIVE_FOLLOWUPS,
  };
}

// ─── DEMO PATTERN MATCHING ──────────────────────────────────
function getDemoResponse(query: string): { content: string; followUps: string[] } | null {
  const q = query.toLowerCase();

  // COST / BUDGET / TARIFF / GMP
  if (q.includes('cost') || q.includes('budget') || q.includes('variance') || q.includes('tariff') || q.includes('gmp') || q.includes('steel') && q.includes('impact')) {
    return {
      content: `INTEL: Cost Variance Analysis — Project Phoenix

CURRENT_FINANCIAL_POSITION:
Contract Value: $48.2M | GMP: $51.8M | Committed: $41.7M | Expended: $38.1M
Overall Variance: -$578K (-1.2%) UNDER BUDGET — favorable

CRITICAL_COST_ALERT — Steel & Structural:
Current committed steel cost: $6.84M (13.2% of GMP)
Q2 2026 Section 232 tariff projection: +8-12% on imported structural steel
Source: AISC market bulletin 2026-03, Commerce Dept. tariff schedule

Affected Line Items:
• W-shapes (W14×132, W24×84): $2.31M committed → $185K-$277K exposure
• HSS sections (HSS 8×8×½): $891K committed → $71K-$107K exposure
• Connection hardware & embeds: $342K committed → $27K-$41K exposure
• Misc. steel (handrails, supports): $418K committed → $33K-$50K exposure
TOTAL TARIFF EXPOSURE: $316K — $475K

MONTE_CARLO_SIMULATION (10,000 runs):
P50: $382K | P80: $441K | P95: $512K
Confidence: 78% probability impact stays within $395K ± $80K

REMAINING_BUDGET_BUFFER:
Current contingency: $1.24M (2.4% of GMP)
Post-tariff contingency (P80): $799K (1.54%)
Risk threshold: AMBER — contingency adequate but compressed

MITIGATION_OPTIONS:
1. Accelerate remaining steel procurement to lock Q1 pricing → saves ~$180K
2. Value-engineer HSS connections from welded to bolted → saves ~$45K
3. Negotiate supplier price-protection clause with Nucor/SDI → potential 60% offset
4. Substitute domestic W-shapes where spec allows → eliminates tariff on $1.2M of material`,
      followUps: [
        "What if tariffs escalate to 25% — cascade impact across all trades and GMP?",
        "Predict concrete cost trajectory through Q3 with current LA aggregate shortages",
        "Compare our $/SF burn rate against CBRE market benchmarks for Type IA high-rise",
      ],
    };
  }

  // SCHEDULE / RISK / DELAY / RFI / WEATHER / CRITICAL PATH
  if (q.includes('schedule') || q.includes('risk') || q.includes('delay') || q.includes('rfi') || q.includes('weather') || q.includes('critical path') || q.includes('60-day') || q.includes('predict')) {
    return {
      content: `INTEL: 60-Day Critical Path Risk Assessment — Project Phoenix

SCHEDULE_STATUS:
Overall Progress: 74.2% | Schedule Health: AMBER
Projected Completion: Aug 14, 2026 (contract: Aug 1, 2026)
Current Float: 9 calendar days on critical path
Confidence: 62% probability of on-time completion ± 8 days

RISK_REGISTER — Next 60 Days (Mar 1 – Apr 30, 2026):

1. RFI BACKLOG [CRITICAL — P85 = 6-day delay]
   14 open RFIs | 4 on critical path | Avg response: 11 days (target: 7)
   • RFI-202: Steel connection detail Grid J-7 — 14 days open, blocks erection seq.
   • RFI-198: Curtain wall anchor spacing Level 18-24 — 9 days open
   • RFI-211: MEP penetration conflicts at transfer beam — 3 days open
   Impact if unresolved: 6-day CP delay | Cost exposure: $34K/day LD = $204K
   Confidence: 85% ± 6% this causes delay if RFI-202 not closed by Mar 7

2. WEATHER PATTERN [MODERATE — P60 = 3-day delay]
   NOAA 60-day outlook: Above-average precipitation for LA basin (Mar-Apr)
   Historical: 4.2 rain days avg in period | 2026 forecast: 6-8 rain days
   Exposed activities: curtain wall installation (Levels 18-22), roof membrane
   Impact: 2-4 lost work days on exterior trades
   Confidence: 60% ± 15% — moderate uncertainty in extended forecast

3. SUPPLY CHAIN — ELEVATOR [HIGH — P70 = 12-day delay]
   ThyssenKrupp submittal pending owner approval: 12 days in queue
   Lead time after approval: 14 weeks (delivery est: June 20)
   If approved by Mar 7: completion Aug 8 (within float)
   If delayed to Mar 21: completion Aug 22 (14-day overage)
   Confidence: 70% ± 10% delivery meets August close-in date

4. LABOR AVAILABILITY [LOW-MODERATE — P40 = 2-day delay]
   LA ironworker utilization: 94% (tight market)
   Dynalectric electrical crew: scheduled ramp from 12→18 workers Apr 1
   Risk: competing project (Oceanwide Phase 2) pulling same labor pool
   Confidence: 40% ± 12% this materializes as actual delay

AGGREGATE_RISK_SCORE: 7.2 / 10 — ELEVATED
Combined P80 delay estimate: 8 days | P95: 14 days
Liquidated damages exposure (P80): $272K

RECOMMENDED_ACTIONS:
1. IMMEDIATE: Escalate RFI-202 — direct principal-to-principal call with structural EOR
2. THIS WEEK: Fast-track elevator submittal to owner's rep for expedited review
3. ONGOING: Pre-negotiate rain day make-up schedule with curtain wall sub (weekend crews)
4. MONITOR: Track ironworker availability weekly — trigger backup crew sourcing if utilization hits 97%`,
      followUps: [
        "Model impact: what if RFI response times degrade to 15-day avg — schedule cascade?",
        "Predict how a La Niña weather pattern shift would affect our exterior envelope timeline",
        "What's our exposure if ThyssenKrupp announces a 4-week lead time extension on cabs?",
      ],
    };
  }

  // COMMUNICATIONS / MEETINGS / OWNER
  if (q.includes('comm') || q.includes('meeting') || q.includes('owner') || q.includes('summarize') || q.includes('email') || q.includes('slack') || q.includes('flag') || q.includes('unresolved')) {
    return {
      content: `INTEL: Owner-GC Communications Digest — Week of Feb 24, 2026

COMMUNICATION_VOLUME:
Total exchanges: 47 | Emails: 28 | Slack: 12 | Meetings: 4 | Calls: 3
Sentiment trend: NEUTRAL → SLIGHTLY NEGATIVE (↓4% from prior week)
Confidence: 72% ± 8% sentiment accurately classified

MEETING_SUMMARIES:

1. OAC Weekly (Feb 25 | 52 min | 9 attendees)
   Key decisions: Foundation pour → Mar 5 (weather delay), steel delivery confirmed Mar 12
   UNRESOLVED: Owner requested cost breakdown on PCO-043 finish upgrade ($127K) — GC to provide by Mar 1
   Tone: Constructive but owner expressed concern about PCO accumulation

2. MEP Coordination (Feb 26 | 38 min | 6 attendees)
   Moved recurring to Tuesdays. BIM clash report: 8 new clashes (4 critical)
   UNRESOLVED: Pan-Pacific Mechanical pushing back on duct routing at Level 12 transfer — no resolution

3. Structural RFI Review (Feb 27 | 25 min | 4 attendees)
   RFI-202 discussed — structural EOR needs 48hrs for connection calc review
   UNRESOLVED: EOR requested field survey data that GC has not yet provided

4. Owner 1:1 (Feb 28 | 18 min | 2 attendees)
   Pacific Dev Group COO flagged lender reporting deadline Mar 15
   UNRESOLVED: Owner needs updated cost-to-complete forecast by Mar 10 for lender draw package

UNRESOLVED_ITEMS — CRITICAL:
⚠ PCO-043 cost breakdown → GC owes owner by Mar 1 (TOMORROW)
⚠ Cost-to-complete forecast → GC owes owner by Mar 10 (lender deadline)
⚠ Field survey data for RFI-202 → GC owes structural EOR (blocking RFI closure)
⚠ MEP duct routing Level 12 → Pan-Pacific and Dynalectric at impasse

EMAIL_THREAD_FLAGS:
• Feb 26 — Owner CC'd legal counsel on PCO-043 thread (ESCALATION_SIGNAL)
• Feb 27 — Martinez Engineering replied "unable to proceed" on RFI-202 (BLOCKER)
• Feb 28 — GC project manager OOO notice Mar 3-7 (COVERAGE_GAP during critical week)

RISK_ASSESSMENT:
Owner engagement trending toward heightened scrutiny on cost control.
Legal CC on PCO thread suggests potential dispute posture.
Confidence: 65% ± 12% that PCO-043 becomes contested if not addressed this week`,
      followUps: [
        "Predict owner satisfaction trajectory if PCO-043 isn't resolved by lender deadline",
        "Model communication risk: what if GC PM absence causes RFI-202 to miss Mar 7 deadline?",
        "Analyze historical pattern — do owners who CC legal typically escalate within 30 days?",
      ],
    };
  }

  // SCENARIO / MODEL / IMPACT / LUMBER / SURGE / WHAT IF
  if (q.includes('scenario') || q.includes('model') || q.includes('lumber') || q.includes('surge') || q.includes('what if') || q.includes('impact') && (q.includes('%') || q.includes('price'))) {
    return {
      content: `INTEL: Scenario Analysis — 15% Lumber Price Surge Impact

SCENARIO_PARAMETERS:
Trigger: 15% increase in softwood lumber (SPF #2 & Better)
Baseline: $485/MBF (current) → $558/MBF (scenario)
Source: Random Lengths composite, CME futures curve
Probability of scenario: 35% within next 90 days
Drivers: Canadian tariff uncertainty, BC mill curtailments, housing starts rebound
Confidence: 35% ± 11% this price level materializes by June 2026

DIRECT_COST_IMPACT — Project Phoenix:
Committed lumber/wood framing: $1.82M (3.5% of GMP)
Uncommitted wood exposure: $340K remaining procurement

Line Item Breakdown:
• Structural blocking & nailers: $180K remaining → +$27K exposure
• Interior framing (Levels 8-24): $95K remaining → +$14.3K exposure
• Formwork lumber (reusable): $48K remaining → +$7.2K exposure
• Millwork & architectural wood: $17K remaining → +$2.6K exposure
TOTAL DIRECT EXPOSURE: +$51.1K on uncommitted quantities

INDIRECT_COST_IMPACT:
• Concrete formwork contractors may pass through material escalation: +$18K-$32K
• Interior partition subcontractor (metal stud + wood hybrid): +$8K-$14K
• Temporary construction (shoring, barriers): +$5K-$9K
TOTAL INDIRECT EXPOSURE: +$31K — $55K

AGGREGATE_SCENARIO_IMPACT:
Best case: +$82K (0.16% of GMP)
Expected case: +$97K (0.19% of GMP)
Worst case: +$126K (0.24% of GMP)
Confidence: 75% ± 9% impact stays below $110K

TIMELINE_IMPACT:
Negligible — lumber is not on critical path for Phoenix (steel-framed tower)
However: if lumber surge indicates broader commodity inflation, watch for:
• Copper (electrical rough-in): currently $4.12/lb, +15% = +$67K exposure
• Aluminum (curtain wall): currently $2,485/MT, +15% = +$142K exposure
• Diesel (equipment & hauling): currently $4.89/gal, +15% = +$23K exposure
CASCADING COMMODITY EXPOSURE: +$232K if all commodities follow lumber

CONTINGENCY_STATUS:
Current contingency: $1.24M
After steel tariff (P80): $799K
After lumber scenario (expected): $702K (1.35% of GMP)
After full commodity cascade: $470K (0.91% of GMP) — BELOW 1% THRESHOLD ⚠

RECOMMENDATION:
1. Lock remaining lumber procurement this week — $340K at current pricing saves $51K
2. Request commodity escalation clause in remaining subcontracts (curtain wall, electrical)
3. Brief owner on contingency compression — recommend $200K contingency top-up at next draw`,
      followUps: [
        "What if copper hits $5.00/lb — model full MEP cost cascade and timeline impact?",
        "Predict: how does a Fed rate hike of 50bps affect our development IRR and lender covenants?",
        "Scenario: LA Building & Safety implements new seismic retrofit requirement mid-project — exposure?",
      ],
    };
  }

  // No demo match — return null to trigger Gemini Flash
  return null;
}

// ─── GENERIC FALLBACK ───────────────────────────────────────
function getGenericResponse(query: string): string {
  return `INTEL: Query Processed

Analyzing: "${query}"

Envision OS has routed your query through the semantic intelligence engine. In production, this connects to:

• Procore — Project management & field data
• Sage Intacct — Financial & accounting data
• BIM 360 — Model coordination & clash detection
• Email/Slack/Zoom — Communication intelligence
• Market feeds — Commodity prices, tariff schedules, labor indices

Current demo mode is active. Connect your data sources in Settings to enable live intelligence.

For predictive analysis with confidence intervals, try one of the suggested prompts below.`;
}

const pdfExtractionSchema = z.object({
  pdfDataUri: z.string().min(1, "PDF data URI cannot be empty."),
});

export async function handlePdfExtraction(pdfDataUri: string) {
  try {
    const validatedFields = pdfExtractionSchema.safeParse({ pdfDataUri });

    if (!validatedFields.success) {
      return {
        message: 'Invalid PDF data.',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const input: DocumentDataExtractionInput = {
      pdfDataUri: validatedFields.data.pdfDataUri,
    };
    
    const result = await extractDocumentData(input);
    
    return {
      message: 'PDF processed.',
      data: result,
    };
  } catch (error) {
    return {
      message: 'An error occurred during PDF extraction.',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const contextSummarizationSchema = z.object({
  projectDecisionOrIssue: z.string().min(1, "Project/Decision Issue cannot be empty."),
  qualitativeData: z.string().min(1, "Qualitative Data cannot be empty."),
});

export async function handleContextSummarization(data: {projectDecisionOrIssue: string, qualitativeData: string}) {
   try {
    const validatedFields = contextSummarizationSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        message: 'Invalid input.',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const input: QualitativeContextSummarizationInput = {
      projectDecisionOrIssue: validatedFields.data.projectDecisionOrIssue,
      qualitativeData: validatedFields.data.qualitativeData,
    };
    
    const result = await summarizeQualitativeContext(input);
    
    return {
      message: 'Context summarized.',
      data: result,
    };
  } catch (error) {
    return {
      message: 'An error occurred during context summarization.',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}