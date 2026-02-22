'use server';
/**
 * @fileOverview A Genkit flow for extracting structured data from PDF documents like RFIs or project updates.
 *
 * - extractDocumentData - A function that extracts structured information from a PDF document.
 * - DocumentDataExtractionInput - The input type for the extractDocumentData function.
 * - DocumentDataExtractionOutput - The return type for the extractDocumentData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentDataExtractionInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type DocumentDataExtractionInput = z.infer<typeof DocumentDataExtractionInputSchema>;

const DocumentDataExtractionOutputSchema = z.object({
  rfiNumber: z.string().describe('The RFI number extracted from the document, if present.'),
  documentDate: z.string().describe('The primary date associated with the document (e.g., RFI date, creation date) in YYYY-MM-DD format.'),
  sender: z.string().describe('The name of the sender of the document.'),
  recipient: z.string().describe('The name of the recipient of the document.'),
  coreContent: z.string().describe('The core question or answer, or the main body of the document.'),
});
export type DocumentDataExtractionOutput = z.infer<typeof DocumentDataExtractionOutputSchema>;

export async function extractDocumentData(input: DocumentDataExtractionInput): Promise<DocumentDataExtractionOutput> {
  return documentDataExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentDataExtractionPrompt',
  input: {schema: DocumentDataExtractionInputSchema},
  output: {schema: DocumentDataExtractionOutputSchema},
  prompt: `You are an expert at extracting structured information from construction project documents. Your task is to analyze the provided PDF document and extract specific key pieces of information.

Carefully read the entire document and identify the following fields:
- **RFI Number:** Look for a clear RFI number, often labeled as "RFI #", "RFI No.", or similar.
- **Document Date:** Find the primary date of the document, such as the date an RFI was issued or a project update was created. Format this as YYYY-MM-DD.
- **Sender:** Identify the name of the person or entity who sent or authored the document.
- **Recipient:** Identify the name of the person or entity to whom the document is addressed.
- **Core Content:** Extract the main body of the document, which could be a question, an answer, a request for information, or a general project update description.

If a field is not explicitly found, return an empty string for that field.

Document: {{media url=pdfDataUri}}`,
});

const documentDataExtractionFlow = ai.defineFlow(
  {
    name: 'documentDataExtractionFlow',
    inputSchema: DocumentDataExtractionInputSchema,
    outputSchema: DocumentDataExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
