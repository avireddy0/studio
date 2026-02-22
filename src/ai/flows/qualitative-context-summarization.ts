'use server';
/**
 * @fileOverview A Genkit flow for summarizing qualitative data (e.g., Slack, Zoom transcripts)
 * and highlighting critical points or action items related to a specific project decision or issue.
 *
 * - summarizeQualitativeContext - A function that handles the qualitative context summarization process.
 * - QualitativeContextSummarizationInput - The input type for the summarizeQualitativeContext function.
 * - QualitativeContextSummarizationOutput - The return type for the summarizeQualitativeContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QualitativeContextSummarizationInputSchema = z.object({
  projectDecisionOrIssue: z
    .string()
    .describe(
      'A description of the specific project decision or issue to summarize context for.'
    ),
  qualitativeData: z
    .string()
    .describe(
      'Raw qualitative data, such as chat transcripts from Slack or notes from Zoom meetings, as a single string.'
    ),
});
export type QualitativeContextSummarizationInput = z.infer<
  typeof QualitativeContextSummarizationInputSchema
>;

const QualitativeContextSummarizationOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the qualitative data in relation to the project decision or issue.'
    ),
  criticalPoints: z
    .array(z.string())
    .describe(
      'A list of critical points or key insights extracted from the data relevant to the decision/issue.'
    ),
  actionItems: z
    .array(z.string())
    .describe('A list of potential action items identified from the data.'),
  confidenceLevel: z
    .enum(['High', 'Medium', 'Low'])
    .describe(
      'The AI\'s confidence level in the accuracy and completeness of the summary and extractions.'
    ),
});
export type QualitativeContextSummarizationOutput = z.infer<
  typeof QualitativeContextSummarizationOutputSchema
>;

export async function summarizeQualitativeContext(
  input: QualitativeContextSummarizationInput
): Promise<QualitativeContextSummarizationOutput> {
  return qualitativeContextSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qualitativeContextSummarizationPrompt',
  input: {schema: QualitativeContextSummarizationInputSchema},
  output: {schema: QualitativeContextSummarizationOutputSchema},
  prompt: `You are an expert project analyst tasked with summarizing qualitative project data.

Your goal is to review provided qualitative data and extract a concise summary, critical points, and potential action items related to a specific project decision or issue.

Project Decision or Issue: {{{projectDecisionOrIssue}}}

Qualitative Data:
{{{qualitativeData}}}

Carefully analyze the data and provide:
1. A clear and concise summary of how the qualitative data relates to the project decision or issue.
2. A list of critical points or key insights directly relevant to the decision or issue.
3. A list of any identified action items.
4. Your confidence level in the accuracy and completeness of your summary and extractions. If the data is sparse or unclear, adjust your confidence accordingly.

Ensure your output strictly adheres to the JSON schema provided.
`,
});

const qualitativeContextSummarizationFlow = ai.defineFlow(
  {
    name: 'qualitativeContextSummarizationFlow',
    inputSchema: QualitativeContextSummarizationInputSchema,
    outputSchema: QualitativeContextSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
