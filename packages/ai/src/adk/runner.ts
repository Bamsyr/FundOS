import { createGeminiClient } from './gemini.js';
import type { AdkAgent } from './agent.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

export interface RunContext {
  sessionId?: string;
  [key: string]: any;
}

export interface AgentResult {
  text: string;
  toolCalls?: any[];
}

export interface AgentStreamChunk {
  type: 'token' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  tool?: string;
  args?: any;
  result?: any;
  fullResponse?: string;
}

export async function runAgent(agent: AdkAgent, input: string, ctx?: RunContext): Promise<AgentResult> {
  const model = createGeminiClient({ model: agent.model });

  const tools = agent.tools.map(tool => ({
    functionDeclarations: [{
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema)
    }]
  }));

  let chat = model.startChat({
    systemInstruction: agent.system,
    tools: tools.length > 0 ? (tools as any) : undefined,
    generationConfig: {
      temperature: agent.config.temperature,
      maxOutputTokens: agent.config.maxOutputTokens,
    }
  });

  let result = await chat.sendMessage(input);
  let response = result.response;

  // Handle tool calls loop
  let toolCalls = response.candidates?.[0]?.content.parts.filter(p => p.functionCall);

  while (toolCalls && toolCalls.length > 0) {
    const toolResults = await Promise.all(toolCalls.map(async (tc) => {
      const tool = agent.tools.find(t => t.name === tc.functionCall!.name);
      if (!tool) throw new Error(`Tool ${tc.functionCall!.name} not found`);

      const callResult = await tool.handler(tc.functionCall!.args, { ...ctx });
      return {
        functionResponse: {
          name: tool.name,
          response: callResult
        }
      };
    }));

    result = await chat.sendMessage(toolResults);
    response = result.response;
    toolCalls = response.candidates?.[0]?.content.parts.filter(p => p.functionCall);
  }

  return {
    text: response.candidates?.[0]?.content.parts[0]?.text ?? '',
  };
}

export async function* streamAgent(agent: AdkAgent, input: string, ctx?: RunContext): AsyncGenerator<AgentStreamChunk> {
  const model = createGeminiClient({ model: agent.model });

  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: input }] }],
    systemInstruction: agent.system,
    generationConfig: {
      temperature: agent.config.temperature,
      maxOutputTokens: agent.config.maxOutputTokens,
    }
  });

  for await (const chunk of result.stream) {
    const text = chunk.candidates?.[0]?.content.parts[0]?.text;
    if (text) {
      yield { type: 'token', content: text };
    }
  }

  const response = await result.response;
  yield { type: 'done', fullResponse: response.candidates?.[0]?.content.parts[0]?.text ?? '' };
}
