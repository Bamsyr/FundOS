import { createAgent, createTool } from '@fundos/ai';
import { z } from 'zod';

const parseCsvTool = createTool({
  name: 'parseCsv',
  description: 'Parses and cleans CSV data from a URL',
  schema: z.object({ fileUrl: z.string() }),
  handler: async ({ fileUrl }) => {
    // TODO: implement papaparse logic
    return { rows: [], errors: [] };
  }
});

const storeRawTool = createTool({
  name: 'storeRaw',
  description: 'Writes data to BigQuery raw layer',
  schema: z.object({ table: z.string(), rows: z.array(z.any()) }),
  handler: async ({ table, rows }) => {
    // TODO: implement BigQuery insert
    return { inserted: rows.length, jobId: 'bq-job-123' };
  }
});

export const ingestionAgent = createAgent({
  name: 'agent-ingestion',
  model: 'gemini-2.0-flash-001',
  system: 'You are the Ingestion Agent. Normalize and validate incoming data.',
  tools: [parseCsvTool, storeRawTool],
});
