import Fastify from 'fastify';
import { ingestionAgent } from './agent/agent.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async () => ({
  status: 'ok',
  agent: ingestionAgent.name,
  version: '0.0.1',
  uptime: process.uptime(),
  lastIngestion: null,
  rowsProcessedLast24h: 0,
  deps: {
    bigquery: 'ok',
    pubsub: 'ok'
  }
}));

fastify.get('/ready', async () => ({
  status: 'ready',
  bigquery: 'ok',
  pubsub: 'ok'
}));

const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' });
    console.log('Ingestion Agent listening on port 8080');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
