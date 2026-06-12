import { createAgent, createTool, runAgent } from '@fundos/ai';
import { z } from 'zod';

const invokeIngestionAgent = createTool({
  name: 'invokeIngestionAgent',
  description: 'Invokes the ingestion agent to process incoming data',
  schema: z.object({ data: z.any() }),
  handler: async (input) => {
    console.log('Invoking Ingestion Agent...');
    return { status: 'ingested', ingestionId: 'ing-' + Math.random().toString(36).substr(2, 9) };
  }
});

const invokeScoringAgent = createTool({
  name: 'invokeScoringAgent',
  description: 'Invokes the scoring agent to calculate campaign scores',
  schema: z.object({ campaignId: z.string() }),
  handler: async (input) => {
    console.log(`Invoking Scoring Agent for campaign ${input.campaignId}...`);
    return { status: 'scored', score: Math.floor(Math.random() * 100) };
  }
});

const invokeConfidenceAgent = createTool({
  name: 'invokeConfidenceAgent',
  description: 'Invokes the investor confidence agent',
  schema: z.object({ campaignId: z.string() }),
  handler: async (input) => {
    console.log(`Invoking Confidence Agent for campaign ${input.campaignId}...`);
    return { status: 'signal_generated', band: 'strong' };
  }
});

const invokeMatchingAgent = createTool({
  name: 'invokeMatchingAgent',
  description: 'Invokes the matching agent to update investor matches',
  schema: z.object({ campaignId: z.string() }),
  handler: async (input) => {
    console.log(`Invoking Matching Agent for campaign ${input.campaignId}...`);
    return { status: 'matches_updated' };
  }
});

const invokeRecommendationAgent = createTool({
  name: 'invokeRecommendationAgent',
  description: 'Invokes the recommendation agent',
  schema: z.object({ campaignId: z.string() }),
  handler: async (input) => {
    console.log(`Invoking Recommendation Agent for campaign ${input.campaignId}...`);
    return { status: 'recommendations_triggered' };
  }
});

export const orchestratorAgent = createAgent({
  name: 'fundos-orchestrator',
  model: 'gemini-2.0-flash-001',
  system: `You are the FundOS Orchestrator.
  When a new campaign is published, follow this flow:
  1. agent-ingestion (validate + store data)
  2. agent-scoring (compute confidence score)
  3. agent-investor-confidence (compute investor signal)
  4. agent-matching (update matches for all investors)
  5. agent-recommendation (trigger brief updates)

  When an investment is confirmed, follow this flow:
  1. agent-investor-confidence (refresh signal)
  2. agent-profile (update investor behavior signals)
  3. agent-recommendation (trigger portfolio alerts)`,
  tools: [
    invokeIngestionAgent,
    invokeScoringAgent,
    invokeConfidenceAgent,
    invokeMatchingAgent,
    invokeRecommendationAgent
  ],
});

export async function handleNewCampaign(campaignId: string) {
  const prompt = `Process new campaign: ${campaignId}. Follow the "New Campaign Published" flow.`;
  return runAgent(orchestratorAgent, prompt);
}

export async function handleNewInvestment(investmentId: string) {
  const prompt = `Process confirmed investment: ${investmentId}. Follow the "New Investment Confirmed" flow.`;
  return runAgent(orchestratorAgent, prompt);
}
