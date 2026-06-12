import Fastify from 'fastify';
import { authMiddleware } from '@fundos/auth';
import { TOPICS } from '@fundos/events';
import { PubSub } from '@google-cloud/pubsub';

const fastify = Fastify({
  logger: true,
});

const pubsub = new PubSub();
const sseConnections = new Map<string, any>();

// Broadcast helper
export function broadcastToInvestor(investorId: string, event: string, data: any) {
  const connection = sseConnections.get(investorId);
  if (connection) {
    connection.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
}

// Global broadcast
export function broadcastAll(event: string, data: any) {
  for (const connection of sseConnections.values()) {
    connection.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
}

// Subscribe to Pub/Sub topics for SSE broadcast
async function setupPubSub() {
  const subscriptionName = 'api-gateway-sse-sub';
  // Note: in production, this subscription should already exist
  const [subscription] = await pubsub.topic(TOPICS.CONFIDENCE_UPDATED).createSubscription(subscriptionName).catch(() => pubsub.subscription(subscriptionName).get());

  subscription.on('message', message => {
    const data = JSON.parse(message.data.toString());
    broadcastAll('confidence_updated', data);
    message.ack();
  });
}

fastify.get('/health', async () => {
  return {
    status: 'ok',
    agent: 'api-gateway',
    version: '0.0.1',
    uptime: process.uptime(),
    deps: {
      pubsub: 'ok',
      auth: 'ok'
    },
    timestamp: new Date().toISOString()
  };
});

fastify.get('/ready', async () => {
  return { status: 'ready' };
});

fastify.get('/stream', { preHandler: [authMiddleware] }, async (request, reply) => {
  const investorId = request.user?.investorId || request.user?.sub;
  if (!investorId) {
    reply.status(400).send({ error: 'Bad Request', message: 'User ID missing in token' });
    return;
  }

  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');

  sseConnections.set(investorId, reply);

  request.raw.on('close', () => {
    sseConnections.delete(investorId);
  });

  // Heartbeat
  const hb = setInterval(() => {
    reply.raw.write(':heartbeat\n\n');
  }, 15000);

  request.raw.on('close', () => {
    clearInterval(hb);
  });

  reply.raw.write(`data: ${JSON.stringify({ type: 'connected', investorId })}\n\n`);
});

// Proxy routes for agents
fastify.all('/agents/:agentName/*', { preHandler: [authMiddleware] }, async (request, reply) => {
  const { agentName } = request.params as { agentName: string };
  // Placeholder for internal agent proxying
  return { message: `Proxying to ${agentName}`, path: request.url, user: request.user };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' });
    console.log('API Gateway listening on port 8080');
    setupPubSub().catch(err => console.error('Failed to setup Pub/Sub:', err));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
