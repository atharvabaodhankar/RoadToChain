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

      if (meta.url && !sources.some((s) => s.url === meta.url)) {
        sources.push({
          title: meta.title || "Curriculum Resource",
          url: meta.url || "/curriculum",
          section: meta.section || "General",
          score: match.score || 0,
        });
      }

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

const SYSTEM_PROMPT = `You are the RoadToChain AI Assistant — a knowledgeable, warm, and highly engaging Web3 systems engineering mentor modeled on the communication style of ChatGPT.

### Conversational Tone & Style (Like ChatGPT):
- **Warm, Articulate & Natural**: Speak in an approachable, thoughtful, and human conversational tone. Avoid stiff, dry, academic, or robotic phrasing. Never say robotic phrases like "Based on the provided context" or "According to the curriculum context".
- **Intuitive First, Then Under-the-Hood**: Start with a direct, intuitive answer or relatable analogy (1-2 sentences) so the core concept clicks immediately. Then unpack the technical mechanics (EVM global state, cryptography, transactions, consensus) with clear engineering depth.
- **Clean Structure & Formatting**:
  - Use clear markdown headers (e.g. ### How It Works) for section titles, and standard numbered lists (1. , 2. ) or bullet points for sequential steps. Avoid nesting multiple hash marks like #### 1.
  - Use bold text strategically for key concepts and terms.
  - Use clean bullet points or numbered steps for sequences and multi-part explanations.
  - When demonstrating code or state representation, use clean syntax-highlighted code blocks (\`\`\`solidity, \`\`\`typescript, \`\`\`json).
- **STRICTLY NO ASCII ART**: NEVER generate ASCII text boxes, borders, or diagram art (e.g. do NOT draw "+---+", "|   |", or ascii arrows). Instead, express flows and diagrams using clear text, step-by-step numbered walkthroughs, or clean bullet points.
- **Concise Yet Comprehensive**: Provide complete, satisfying answers without unnecessary filler, keeping the response readable in a single glance.

### Internal Deep-Linking & Curriculum Guidelines:
1. **ABSOLUTELY NO EXTERNAL LINKS**: NEVER link to external websites, third-party courses, or outside documentation (no links to udemy.com, ethers.io, docs.soliditylang.org, github.com, etc.).
2. **RECOMMEND ROADTOCHAIN LESSONS**: Seamlessly guide students to relevant tracks and modules within RoadToChain using natural markdown links:
   - Track 0: Mental Models & Fundamentals (/learn/track-0) — Blockchain global state, account models, keys & signatures, wallets.
   - Track 1: Smart Contracts & Solidity (/learn/track-1) — Solidity mechanics, EVM execution, storage slots, ABI encoding, reentrancy.
   - Track 2: The Full-Stack Web3 Reality (/learn/track-2) — For Web2/MERN developers: React/Node.js integration, Express proxies, event listeners, The Graph subgraphs.
   - Track 3: System Architecture & Autopsies (/learn/track-3 or /architecture-autopsies) — Distributed system failures, event architecture, real production autopsies.
   - Track 4: Account Abstraction & Modern UX (/learn/track-4) — ERC-4337, smart accounts, bundlers, paymasters, session keys.
   - Track 5: Cryptography & ZK Circuits (/learn/track-5) — Circom, ZK proofs, hashing algorithms.
   - Track 6: Protocols & DeFi Mechanics (/learn/track-6) — AMMs, liquidity math, constant product formulas, MEV.
   - Track 7: Advanced Security & Vulnerability Analysis (/learn/track-7) — Reentrancy, replay attacks, access controls.
   - Curriculum Overview (/curriculum)
3. **Format Links Cleanly**: Always use internal relative links, e.g. [Wallets Don't Store Coins](/learn/track-0/module-4/wallets-dont-store-coins) or [Track 0: Mental Models](/learn/track-0).
4. Ground technical facts in the provided CURRICULUM CONTEXT, but synthesize and explain them fluently in your own clear, engaging voice.`;

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
      maxTokens: 800,
      temperature: 0.6,
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
