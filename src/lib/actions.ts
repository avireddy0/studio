"use server";

import { z } from "zod";
import { extractDocumentData, DocumentDataExtractionInput } from "@/ai/flows/document-data-extraction-flow";
import { summarizeQualitativeContext, QualitativeContextSummarizationInput } from "@/ai/flows/qualitative-context-summarization";

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

const DEFAULT_PREDICTIVE_FOLLOWUPS = [
  "Steel tariffs to 25% — cascade impact?",
  "Concrete cost trajectory through Q3",
  "Rate hike +50bps — pro forma impact?",
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

    // Parse conversation history for AI context
    let history: Array<{ role: string; content: string }> = [];
    try {
      const historyRaw = formData.get('history') as string;
      if (historyRaw) history = JSON.parse(historyRaw);
    } catch { /* ignore parse errors */ }

    // Check for demo pattern match (suggested prompts always get rich responses)
    const demoResult = getDemoResponse(query);
    if (demoResult) {
      return {
        message: 'Query processed.',
        data: demoResult.content,
        followUps: demoResult.followUps,
      };
    }

    // Custom prompt → try Gemini Flash with conversation history
    try {
      const geminiResult = await getGeminiFlashResponse(query, history);
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
async function getGeminiFlashResponse(query: string, history: Array<{ role: string; content: string }> = []): Promise<{ content: string; followUps: string[] }> {
  const { ai } = await import('@/ai/genkit');

  // Build conversation context from history (last 10 exchanges)
  const recentHistory = history.slice(-20);
  const conversationContext = recentHistory.length > 1
    ? `\nCONVERSATION_HISTORY (use this for context on follow-up questions):\n${recentHistory.map(m => `${m.role === 'user' ? 'USER' : 'ENVISION_OS'}: ${m.content}`).join('\n')}\n`
    : '';

  const { text } = await ai.generate({
    model: 'googleai/gemini-3.1-flash-preview',
    prompt: `You are ENVISION OS — a tactical construction intelligence system. Military comms style. Terse. Matter-of-fact. No filler, no pleasantries, no prose paragraphs.

VOICE: Like a battlefield intelligence officer delivering a sitrep. Short sentences. Abbreviations welcome. Data-dense. Every word earns its place.

FORMAT:
- Max 8-12 lines total. Shorter is better.
- ALL_CAPS section headers, one-line data points
- Numbers > words. "$382K exposure" not "approximately three hundred eighty two thousand dollars"
- Confidence intervals where relevant: "Conf: 78% ±8%"
- No bullet point explanations longer than one line
- End with EXACTLY 3 lines starting with ">>>" — terse follow-up prompts (max 8 words each)

PROJECT: Phoenix | $48.2M mixed-use | 24-story | DTLA
GMP: $51.8M | Committed: $41.7M | Expended: $38.1M | Var: -$578K favorable
Progress: 74.2% | Float: 9d | Target: Aug 2026
Risks: Section 232 steel tariffs, 14 open RFIs (4 on CP), MEP coordination
Trades: steel, concrete, MEP, curtain wall, elevator, finishes
Owner: Pacific Dev Group | GC: Turner-Phoenix JV
${conversationContext}
Query: ${query}`,
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
      content: `COST_SITREP — Phoenix

GMP: $51.8M | Committed: $41.7M | Expended: $38.1M
Variance: -$578K (-1.2%) — FAVORABLE

TARIFF_ALERT — Section 232 Steel:
Committed steel: $6.84M (13.2% of GMP)
Q2 projection: +8-12% on imported structural
Total exposure: $316K-$475K | P80: $441K
Contingency post-tariff: $799K (1.54%) — AMBER

ACTIONS:
1. Lock remaining steel at Q1 pricing → saves $180K
2. VE: HSS welded→bolted → saves $45K
3. Nucor/SDI price-protection clause → 60% offset potential
4. Domestic W-shape substitution → eliminates $1.2M tariff exposure`,
      followUps: [
        "Tariffs to 25% — full cascade?",
        "Concrete cost trajectory Q3",
        "$/SF burn vs CBRE benchmarks",
      ],
    };
  }

  // SCHEDULE / RISK / DELAY / RFI / WEATHER / CRITICAL PATH
  if (q.includes('schedule') || q.includes('risk') || q.includes('delay') || q.includes('rfi') || q.includes('weather') || q.includes('critical path') || q.includes('60-day') || q.includes('predict')) {
    return {
      content: `SCHEDULE_SITREP — Phoenix | 60-Day Window

Progress: 74.2% | Float: 9d | Proj completion: Aug 14 (contract: Aug 1)
On-time conf: 62% ±8d | Risk score: 7.2/10 ELEVATED

THREATS:
RFI BACKLOG [CRITICAL] — 14 open, 4 on CP, avg 11d response (tgt: 7)
  RFI-202: steel connection Grid J-7 — 14d open, blocks erection
  Impact: 6d CP delay | LD exposure: $204K ($34K/day)

ELEVATOR [HIGH] — ThyssenKrupp submittal 12d in queue
  Approve by Mar 7 → Aug 8 (in float). Mar 21 → Aug 22 (14d over)

WEATHER [MOD] — NOAA: 6-8 rain days vs 4.2 avg. 2-4d lost exterior
LABOR [LOW] — Ironworker util 94%. Oceanwide competing for same pool

ACTIONS:
1. Escalate RFI-202 — principal-to-principal call NOW
2. Fast-track elevator submittal this week
3. Pre-negotiate rain day weekend crews with curtain wall sub`,
      followUps: [
        "RFI response degrades to 15d — cascade?",
        "ThyssenKrupp +4wk lead time — exposure?",
        "La Niña shift — envelope timeline impact?",
      ],
    };
  }

  // COMMUNICATIONS / MEETINGS / OWNER
  if (q.includes('comm') || q.includes('meeting') || q.includes('owner') || q.includes('summarize') || q.includes('email') || q.includes('slack') || q.includes('flag') || q.includes('unresolved') || q.includes('minute') || q.includes('debrief')) {
    return {
      content: `COMMS_DIGEST — Week Feb 24 | Sentiment: ↓4% NEGATIVE

47 exchanges | 28 email, 12 Slack, 4 meetings, 3 calls

UNRESOLVED — IMMEDIATE:
⚠ PCO-043 cost breakdown → GC owes owner Mar 1
⚠ Cost-to-complete forecast → due Mar 10 (lender draw)
⚠ Field survey for RFI-202 → blocks structural EOR
⚠ MEP duct routing L12 → Pan-Pacific/Dynalectric impasse

FLAGS:
Feb 26 — Owner CC'd legal on PCO-043 [ESCALATION]
Feb 27 — Martinez: "unable to proceed" on RFI-202 [BLOCKER]
Feb 28 — GC PM OOO Mar 3-7 [COVERAGE GAP]

ASSESSMENT: Legal CC = potential dispute posture. PCO-043 contested if not resolved this week. Conf: 65% ±12%`,
      followUps: [
        "PCO-043 unresolved by lender deadline?",
        "GC PM absence → RFI-202 cascade?",
        "Legal CC pattern → escalation timeline?",
      ],
    };
  }

  // SCENARIO / MODEL / IMPACT / LUMBER / SURGE / WHAT IF
  if (q.includes('scenario') || q.includes('model') || q.includes('lumber') || q.includes('surge') || q.includes('what if') || q.includes('impact') && (q.includes('%') || q.includes('price'))) {
    return {
      content: `SCENARIO — 15% Lumber Surge

Trigger: SPF #2 $485→$558/MBF | Prob: 35% ±11% within 90d
Drivers: Canadian tariffs, BC mill curtailments, housing starts

IMPACT:
Direct: +$51K on $340K uncommitted wood
Indirect: +$31K-$55K (formwork, partitions, temp construction)
Aggregate: +$97K expected (0.19% GMP) | P95: $126K
Timeline: Negligible — lumber not on CP (steel-framed)

CASCADE RISK if broad commodity inflation:
Copper +15%: +$67K | Aluminum +15%: +$142K | Diesel +15%: +$23K
Full cascade: +$232K → contingency drops to $470K (0.91% GMP) ⚠

ACTIONS:
1. Lock $340K lumber procurement this week → saves $51K
2. Escalation clauses in remaining subs
3. Brief owner on contingency compression — recommend $200K top-up`,
      followUps: [
        "Copper to $5.00/lb — MEP cascade?",
        "Fed +50bps — IRR and covenant impact?",
        "New seismic requirement mid-project?",
      ],
    };
  }

  // No demo match — return null to trigger Gemini Flash
  return null;
}

// ─── GENERIC FALLBACK ───────────────────────────────────────
function getGenericResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return `SYSTEM ONLINE — Phoenix | 74.2% complete | $578K under budget | 9d float

Ready for tasking. Query costs, schedule, comms, or run scenarios.`;
  }

  if (q.includes('who') || q.includes('what is') || q.includes('explain') || q.includes('how does')) {
    return `Processing in demo mode. 23 data routers available in production: Procore, Sage, BIM 360, Email/Slack/Zoom, market feeds.

Phoenix: $48.2M GMP | 74.2% | 14 open RFIs | $1.24M contingency

Specify: costs, schedule, risks, or comms.`;
  }

  return `Query logged. Demo mode active.

Phoenix: $51.8M GMP | $41.7M committed | $38.1M expended | 9d float

Specify: costs, tariffs, schedule, comms, or scenarios.`;
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