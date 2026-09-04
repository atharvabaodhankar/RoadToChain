import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { Index } from "@upstash/vector";
import { checkRateLimit } from "./ratelimit";
import { recordQueryTelemetry } from "./telemetry";

// Upstash Vector client
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export interface RetrievedSource {
  title: string;
  url: string;
  section: string;
  score: number;
}

export async function embedQuery(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_EMBEDDING_MODEL_ID || "amazon.titan-embed-text-v2:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: text.slice(0, 1000),
      dimensions: 1024,
      normalize: true,
    }),
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.embedding;
}

interface ChunkMetadata {
  title?: string;
  url?: string;
  section?: string;
  tags?: string[];
}

export async function retrieveCurriculumContext(
  query: string,
  topK = 4
): Promise<{ contextText: string; sources: RetrievedSource[] }> {
  try {
    const queryVector = await embedQuery(query);
    const results = await vectorIndex.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      includeData: true,
    });

    const sources: RetrievedSource[] = [];
    const contextParts: string[] = [];

    for (const match of results) {
      const meta = match.metadata as ChunkMetadata | undefined;
      if (!meta) continue;

      sources.push({
        title: meta.title || "Curriculum Resource",
        url: meta.url || "/curriculum",
        section: meta.section || "General",
        score: match.score || 0,
      });

      const chunkData = (match.data as string) || "";
      contextParts.push(
        `--- SOURCE: ${meta.title} (${meta.url}) [Section: ${meta.section}] ---\n${chunkData}`
      );
    }

    return {
      contextText: contextParts.join("\n\n"),
      sources,
    };
  } catch (err) {
    console.error("[bot:retriever] Retrieval error:", err);
    return {
      contextText: "No specific curriculum context retrieved.",
      sources: [],
    };
  }
}

const SYSTEM_PROMPT = `You are the RoadToChain AI Navigator — the authoritative, zero-hype Web3 systems engineering mentor for RoadToChain.
Philosophy: "We learn by breaking things, not reading definitions."
Tone: Direct, technical, highly pragmatic, adversarial yet encouraging, and strictly zero buzzwords.

CRITICAL INSTRUCTIONS ON LINKS & RESOURCES:
1. ABSOLUTELY NO EXTERNAL LINKS: NEVER EVER recommend or link to third-party websites, external documentation, or outside courses (e.g. NEVER output links to udemy.com, docs.soliditylang.org, hardhat.org, wagmi.sh, nextjs.org, ipfs.io, ethers.io, etc.). All outside links are strictly forbidden.
2. ONLY RECOMMEND ROADTOCHAIN CURRICULUM: Every single learning path, concept, and recommendation MUST point directly into RoadToChain's own 8 engineering tracks, modules, lessons, and autopsies:
   - Track 0: Mental Models & Fundamentals (/learn/track-0) — Unlearning Web2 assumptions (state machine vs database, transaction lifecycle, keys & signatures).
   - Track 1: Smart Contracts & Solidity (/learn/track-1) — Solidity mechanics, EVM execution, storage slots, ABI encoding, reentrancy.
   - Track 2: The Full-Stack Web3 Reality (/learn/track-2) — ESSENTIAL FOR MERN/FULL-STACK DEVELOPERS: React/Node.js integration, Express proxy layers, Redis cache invalidation for blockchain events, The Graph subgraphs vs RPC limits.
   - Track 3: System Architecture & Autopsies (/learn/track-3 or /architecture-autopsies) — Distributed system failures, event-driven architecture, and real production autopsies (ChainCure, ChainElect, Socio3).
   - Track 4: Account Abstraction & Modern UX (/learn/track-4) — ERC-4337, smart accounts, bundlers, paymasters, Privy, session keys.
   - Track 5: Cryptography & ZK Circuits (/learn/track-5) — Poseidon vs SHA-256, Circom circuits, zero-knowledge constraints.
   - Track 6: Protocols & DeFi Mechanics (/learn/track-6) — AMMs, liquidity math, constant product formulas, MEV.
   - Track 7: Advanced Security & Vulnerability Analysis (/learn/track-7) — Replay attacks, reentrancy, access control flaws.
   - Curriculum Overview (/curriculum)
3. GUIDANCE FOR MERN / FULL-STACK DEVELOPERS:
   RoadToChain was specifically engineered for Web2 / MERN developers! When a MERN / full-stack dev asks where to start:
   - Validate that their React & Node.js/Express skills are an enormous asset in Web3 full-stack architecture.
   - Direct them to start at [Track 0: Mental Models](/learn/track-0) to break the "database mindset" (blockchain is an append-only state transition machine with expensive writes).
   - Guide them through [Track 1: Smart Contracts](/learn/track-1) to understand what code runs on-chain.
   - Direct them to their home turf: [Track 2: The Full-Stack Reality](/learn/track-2) which teaches how Express proxy backends and Redis caching interact with smart contract events.
   - Point them to [Track 3: System Architecture](/learn/track-3) and [Architecture Autopsies](/architecture-autopsies) to see real production failures.
4. FORMATTING DEEP-LINKS:
   Whenever you mention a lesson or track, format it as a clickable internal markdown link using relative paths, e.g.:
   - [Track 0: Mental Models](/learn/track-0)
   - [Track 2: The Full-Stack Reality](/learn/track-2)
   - [Wallets Don't Store Coins](/learn/track-0/module-4/wallets-dont-store-coins)
   - [Explore Full Curriculum](/curriculum)
5. Ground every technical explanation in the CURRICULUM CONTEXT provided. Be concise, punchy, and structured.`;

export async function createAssistantStream(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  identifier: string
): Promise<Response> {
  const latestMessage = messages[messages.length - 1];
  const query = latestMessage?.content?.trim() || "";

  // 1. Rate Limiter & Circuit Breaker Check
  const rateLimitResult = await checkRateLimit(identifier, query.length);
  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({
        error: rateLimitResult.reason,
        message: rateLimitResult.message,
        remainingToday: 0,
      }),
      {
        status: rateLimitResult.reason === "INPUT_TOO_LONG" ? 400 : 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Vector Search (RAG Context)
  const { contextText, sources } = await retrieveCurriculumContext(query, 4);

  // 3. Build Bedrock Conversation History
  const bedrockMessages: Array<{
    role: "user" | "assistant";
    content: Array<{ text: string }>;
  }> = [];

  // Previous turns (last 4 turns to keep prompt token consumption minimal)
  const recentHistory = messages.slice(-5, -1);
  for (const m of recentHistory) {
    bedrockMessages.push({
      role: m.role,
      content: [{ text: m.content }],
    });
  }

  // Final user message enriched with RAG context
  const enrichedUserPrompt = `[CURRICULUM CONTEXT]\n${contextText}\n\n[STUDENT QUESTION]\n${query}`;
  bedrockMessages.push({
    role: "user",
    content: [{ text: enrichedUserPrompt }],
  });

  // 4. Invoke Bedrock Nova Micro with Streaming
  const modelId = process.env.BEDROCK_LLM_MODEL_ID || "apac.amazon.nova-micro-v1:0";

  const command = new ConverseStreamCommand({
    modelId,
    system: [{ text: SYSTEM_PROMPT }],
    messages: bedrockMessages,
    inferenceConfig: {
      maxTokens: 650,
      temperature: 0.2,
      topP: 0.9,
    },
  });

  const bedrockStreamResponse = await bedrockClient.send(command);

  // 5. Create Server-Sent Events (SSE) Stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial metadata (sources & remaining quota)
        const metaEvent = `data: ${JSON.stringify({
          type: "meta",
          sources,
          remainingToday: rateLimitResult.remainingToday,
        })}\n\n`;
        controller.enqueue(encoder.encode(metaEvent));

        let inputTokens = 0;
        let outputTokens = 0;
        let latencyMs = 0;

        if (bedrockStreamResponse.stream) {
          for await (const chunk of bedrockStreamResponse.stream) {
            if (chunk.contentBlockDelta?.delta?.text) {
              const textChunk = chunk.contentBlockDelta.delta.text;
              const textEvent = `data: ${JSON.stringify({
                type: "token",
                token: textChunk,
              })}\n\n`;
              controller.enqueue(encoder.encode(textEvent));
            }

            if (chunk.metadata?.usage) {
              inputTokens = chunk.metadata.usage.inputTokens || 0;
              outputTokens = chunk.metadata.usage.outputTokens || 0;
            }

            if (chunk.metadata?.metrics?.latencyMs) {
              latencyMs = chunk.metadata.metrics.latencyMs;
            }
          }
        }

        // Fire-and-forget telemetry recording
        const embeddingTokens = Math.ceil(query.length / 4);
        recordQueryTelemetry({
          inputTokens: inputTokens || 350,
          outputTokens: outputTokens || 150,
          embeddingTokens,
          latencyMs,
          promptPreview: query,
        }).catch((err) => console.error("[bot:telemetry] Log error:", err));

        const doneEvent = `data: ${JSON.stringify({ type: "done" })}\n\n`;
        controller.enqueue(encoder.encode(doneEvent));
        controller.close();
      } catch (streamErr) {
        console.error("[bot:stream] Stream error:", streamErr);
        const errorEvent = `data: ${JSON.stringify({
          type: "error",
          message: "Stream interrupted. Please try again.",
        })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Remaining-Today": String(rateLimitResult.remainingToday),
    },
  });
}
