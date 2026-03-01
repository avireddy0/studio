"use server";

import { z } from "zod";
import { querySemanticRouting, QuerySemanticRoutingInput } from "@/ai/flows/query-semantic-routing";
import { extractDocumentData, DocumentDataExtractionInput } from "@/ai/flows/document-data-extraction-flow";
import { summarizeQualitativeContext, QualitativeContextSummarizationInput } from "@/ai/flows/qualitative-context-summarization";

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

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
    
    const input: QuerySemanticRoutingInput = {
      query: validatedFields.data.query,
    };
    
    const result = await querySemanticRouting(input);
    
    return {
      message: 'Query processed.',
      data: result,
    };
  } catch (error) {
    // Demo mode: return simulated response when AI backend is unavailable
    const query = (formData.get('query') as string) || '';
    return {
      message: 'Demo response.',
      data: getDemoResponse(query),
    };
  }
}

function getDemoResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('rfi')) {
    return `INTEL: RFI Analysis Complete

RFI #202 — Structural Steel Connection Detail
Status: OPEN | Priority: HIGH | Days Open: 14
Submitted: Martinez Engineering → Phoenix Structural

The RFI requests clarification on moment connection detail at Grid J-7, Level 3. Current detail specifies bolted connection; field conditions suggest welded connection may be required.

Impact Assessment:
• Schedule: 3-day critical path delay if unresolved
• Cost: $12,400 potential change order
• Risk: HIGH — blocks steel erection sequence`;
  }

  if (q.includes('meeting') || q.includes('summarize')) {
    return `INTEL: Meeting Summary — Project Phoenix Weekly

Date: Feb 28, 2026 | Duration: 47 min
Attendees: 8 (Owner, GC, Structural, MEP)

Key Decisions:
1. Foundation pour rescheduled to March 5 due to weather
2. Steel delivery confirmed for March 12 (on schedule)
3. MEP coordination meeting moved to Tuesdays

Action Items:
• RFI #202 response due March 3 (Structural)
• Updated schedule to be distributed by EOD Friday (GC)
• Submittal log review — 4 items pending approval`;
  }

  if (q.includes('schedule') || q.includes('delay') || q.includes('predict')) {
    return `INTEL: Schedule Risk Analysis

Project Phoenix — Critical Path Status
Overall Progress: 74.2% | Schedule Health: AMBER

Potential Delays Detected:
1. Steel erection — 3 days at risk (RFI #202 dependency)
2. MEP rough-in Level 4 — awaiting coordination drawing
3. Elevator shaft — submittal approval pending (12 days)

Mitigation Recommendations:
• Expedite RFI #202 — direct call to structural engineer
• Release MEP coordination drawing from BIM model
• Escalate elevator submittal to owner's rep`;
  }

  if (q.includes('budget') || q.includes('variance') || q.includes('cost') || q.includes('check')) {
    return `INTEL: Budget Variance Report

Project Phoenix — Financial Status
Contract Value: $48.2M | Committed: $41.7M | Spent: $38.1M

Variance Summary:
• Overall: -1.2% ($578K under budget)
• Structural: +0.3% ($12.4K over — RFI-related)
• MEP: -2.1% ($89K under — value engineering)
• Sitework: On budget

Pending Change Orders:
• PCO-041: Foundation modification — $34,200
• PCO-042: Added fire stopping — $18,750
• PCO-043: Owner-directed finish upgrade — $127,000`;
  }

  return `INTEL: Query Processed

Analyzing: "${query}"

Envision OS has routed your query through the semantic intelligence engine. In production mode, this connects to:

• Procore — Project management & field data
• Sage Intacct — Financial & accounting data
• BIM 360 — Model coordination & clash detection
• Email/Slack — Communication intelligence

Current demo mode is active. Connect your data sources in Settings to enable live intelligence.`;
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