'use server';
/**
 * @fileOverview An AI-powered 'Semantic Router' tool that analyzes natural language queries,
 * determines user intent, and orchestrates the execution of appropriate specialized internal 'MCP tools'.
 *
 * - querySemanticRouting - A function that interprets a natural language query and routes it to a specific internal tool.
 * - QuerySemanticRoutingInput - The input type for the querySemanticRouting function.
 * - QuerySemanticRoutingOutput - The return type for the querySemanticRouting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

/**
 * Input schema for the querySemanticRouting flow.
 * It expects a single string field representing the user's natural language query.
 */
const QuerySemanticRoutingInputSchema = z.object({
  query: z.string().describe('The natural language query from the user.'),
});
export type QuerySemanticRoutingInput = z.infer<typeof QuerySemanticRoutingInputSchema>;

/**
 * Output schema for the querySemanticRouting flow.
 * It returns the name of the identified tool and a record of its extracted parameters.
 */
const QuerySemanticRoutingOutputSchema = z.object({
  toolName: z.string().describe('The name of the identified internal tool to use.'),
  parameters: z
    .record(z.any())
    .describe('The parameters to pass to the identified tool.'),
});
export type QuerySemanticRoutingOutput = z.infer<typeof QuerySemanticRoutingOutputSchema>;

// --- Hypothetical Internal MCP Tools Definitions ---
// These tools are defined for the LLM to understand their signatures and descriptions.
// In a real application, these would correspond to actual internal services or functions.

const getProjectStatusTool = ai.defineTool(
  {
    name: 'getProjectStatus',
    description: 'Retrieves the status of a specific construction project or component.',
    inputSchema: z.object({
      projectName: z.string().optional().describe('The name of the project.'),
      component: z
        .string()
        .optional()
        .describe('Specific component within the project (e.g., "Block A foundation").'),
      statusType: z
        .enum(['current', 'progress', 'overall'])
        .default('current')
        .describe('Type of status to retrieve.'),
    }),
    outputSchema: z.object({
      status: z.string(),
      lastUpdated: z.string(),
    }),
  },
  async (input) => {
    // This is a placeholder implementation. Actual tool logic would go here.
    console.log('Simulating getProjectStatus with:', input);
    return { status: 'Simulated: Completed 75%', lastUpdated: new Date().toISOString() };
  }
);

const listRFIsTool = ai.defineTool(
  {
    name: 'listRFIs',
    description: 'Lists Requests for Information (RFIs) based on specified criteria.',
    inputSchema: z.object({
      status: z
        .enum(['open', 'closed', 'all'])
        .default('open')
        .describe('Status of the RFIs to list.'),
      period: z
        .string()
        .optional()
        .describe('Time period for RFIs (e.g., "Q3 2024", "last month").'),
      project: z.string().optional().describe('The project to filter RFIs by.'),
    }),
    outputSchema: z.object({
      rfiCount: z.number(),
      rfis: z.array(
        z.object({
          id: z.string(),
          subject: z.string(),
          status: z.string(),
          dueDate: z.string().optional(),
        })
      ),
    }),
  },
  async (input) => {
    // This is a placeholder implementation.
    console.log('Simulating listRFIs with:', input);
    return { rfiCount: 5, rfis: [] };
  }
);

const searchDocumentsTool = ai.defineTool(
  {
    name: 'searchDocuments',
    description: 'Searches for project documents like blueprints, reports, or specifications.',
    inputSchema: z.object({
      documentType: z
        .string()
        .optional()
        .describe('Type of document (e.g., "blueprint", "report").'),
      keywords: z.string().describe('Keywords to search for in documents.'),
      project: z.string().optional().describe('The project to search documents within.'),
    }),
    outputSchema: z.object({
      documentCount: z.number(),
      documents: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          url: z.string(),
        })
      ),
    }),
  },
  async (input) => {
    // This is a placeholder implementation.
    console.log('Simulating searchDocuments with:', input);
    return { documentCount: 2, documents: [] };
  }
);

// --- Semantic Routing Prompt Definition ---
// This prompt instructs the AI model to act as a semantic router
// and select the most appropriate tool based on the user's query.
const semanticRoutingPrompt = ai.definePrompt({
  name: 'semanticRoutingPrompt',
  input: { schema: QuerySemanticRoutingInputSchema },
  tools: [getProjectStatusTool, listRFIsTool, searchDocumentsTool],
  prompt: `You are an AI-powered semantic router for a construction project management system. Your task is to analyze user queries and determine the appropriate internal tool to handle the request.
You MUST select one of the available tools and provide all necessary parameters based on the user's query.
If a user query matches multiple tools, choose the most specific one.
If you cannot identify a suitable tool for the query or cannot extract sufficient parameters, you should indicate this by providing a text response stating so, rather than attempting to call a tool.

Available tools:
- getProjectStatus: Retrieves the status of a specific construction project or component.
- listRFIs: Lists Requests for Information (RFIs) based on specified criteria.
- searchDocuments: Searches for project documents like blueprints, reports, or specifications.

User Query: {{{query}}}`,
});

// --- Genkit Flow Definition ---
// This flow orchestrates the call to the AI model and extracts the tool calling decision.
const querySemanticRoutingFlow = ai.defineFlow(
  {
    name: 'querySemanticRoutingFlow',
    inputSchema: QuerySemanticRoutingInputSchema,
    outputSchema: QuerySemanticRoutingOutputSchema,
  },
  async (input) => {
    const response = await semanticRoutingPrompt(input);

    const toolCall = response.toolRequests?.[0]?.toolRequest; // Get the first tool call proposed by the model

    if (toolCall) {
      // If the model proposed a tool call, return its name and parameters.
      return {
        toolName: toolCall.name,
        parameters: JSON.parse(JSON.stringify(toolCall.input)),
      };
    } else {
      // If no tool was called, return an 'unknown' tool along with the model's textual response as a reason.
      return {
        toolName: 'unknown',
        parameters: {
          originalQuery: input.query,
          reason:
            response.text ||
            'No specific tool identified and no descriptive text provided by the model.',
        },
      };
    }
  }
);

/**
 * Interprets a natural language query from a project manager and routes it
 * to the correct internal data source or tool by identifying user intent.
 * @param input The natural language query from the user.
 * @returns The name of the identified tool and its extracted parameters.
 */
export async function querySemanticRouting(
  input: QuerySemanticRoutingInput
): Promise<QuerySemanticRoutingOutput> {
  return querySemanticRoutingFlow(input);
}
