import Fastify from 'fastify';
import { orchestratorAgent, handleNewCampaign, handleNewInvestment } from './agent/agent.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({
  status: 'ok',
  agent: orchestratorAgent.name,
  version: '0.0.1',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));

fastify.get('/ready', async () => ({ status: 'ready' }));

fastify.post('/orchestrate/campaign', async (request, reply) => {
  const { campaignId } = request.body as { campaignId: string };
  const result = await handleNewCampaign(campaignId);
  return { status: 'orchestration_completed', campaignId, result };
});

fastify.post('/orchestrate/investment', async (request, reply) => {
  const { investmentId } = request.body as { investmentId: string };
  const result = await handleNewInvestment(investmentId);
  return { status: 'orchestration_completed', investmentId, result };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' });
    console.log('Orchestrator listening on port 8080');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
