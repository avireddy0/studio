import { config } from 'dotenv';
config();

import '@/ai/flows/qualitative-context-summarization.ts';
import '@/ai/flows/document-data-extraction-flow.ts';
import '@/ai/flows/query-semantic-routing.ts';