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
    return {
      message: 'An error occurred.',
      error: error instanceof Error ? error.message : String(error),
    };
  }
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