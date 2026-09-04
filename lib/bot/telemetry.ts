import { getRedis } from "@/lib/redis";

// AWS Bedrock Official Pricing (per 1,000,000 tokens)
export const PRICING = {
  novaMicroInputPer1M: 0.035,   // $0.035 per 1M tokens
  novaMicroOutputPer1M: 0.140,  // $0.140 per 1M tokens
  titanEmbedPer1M: 0.020,       // $0.020 per 1M tokens
};

export interface QueryTelemetry {
  inputTokens: number;
  outputTokens: number;
  embeddingTokens: number;
  latencyMs?: number;
  promptPreview: string;
}

export function calculateCostUSD(
  inputTokens: number,
  outputTokens: number,
  embeddingTokens: number
): number {
  const inputCost = (inputTokens / 1_000_000) * PRICING.novaMicroInputPer1M;
  const outputCost = (outputTokens / 1_000_000) * PRICING.novaMicroOutputPer1M;
  const embedCost = (embeddingTokens / 1_000_000) * PRICING.titanEmbedPer1M;
  return Number((inputCost + outputCost + embedCost).toFixed(7));
}

export async function recordQueryTelemetry(telemetry: QueryTelemetry): Promise<void> {
  try {
    const redis = getRedis();
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const month = today.slice(0, 7);              // YYYY-MM

    const cost = calculateCostUSD(
      telemetry.inputTokens,
      telemetry.outputTokens,
      telemetry.embeddingTokens
    );

    // 1. All-time stats
    await redis.hincrby("bot:stats:all_time", "queries", 1);
    await redis.hincrby("bot:stats:all_time", "inputTokens", telemetry.inputTokens);
    await redis.hincrby("bot:stats:all_time", "outputTokens", telemetry.outputTokens);
    await redis.hincrby("bot:stats:all_time", "embeddingTokens", telemetry.embeddingTokens);
    await redis.hincrbyfloat("bot:stats:all_time", "totalCostUSD", cost);

    // 2. Monthly stats
    await redis.sadd("bot:stats:months_set", month);
    const monthKey = `bot:stats:month:${month}`;
    await redis.hincrby(monthKey, "queries", 1);
    await redis.hincrby(monthKey, "inputTokens", telemetry.inputTokens);
    await redis.hincrby(monthKey, "outputTokens", telemetry.outputTokens);
    await redis.hincrby(monthKey, "embeddingTokens", telemetry.embeddingTokens);
    await redis.hincrbyfloat(monthKey, "totalCostUSD", cost);

    // 3. Daily stats
    const dayKey = `bot:stats:day:${today}`;
    await redis.hincrby(dayKey, "queries", 1);
    await redis.hincrby(dayKey, "inputTokens", telemetry.inputTokens);
    await redis.hincrby(dayKey, "outputTokens", telemetry.outputTokens);
    await redis.hincrby(dayKey, "embeddingTokens", telemetry.embeddingTokens);
    await redis.hincrbyfloat(dayKey, "totalCostUSD", cost);
    await redis.expire(dayKey, 86400 * 35); // Keep daily logs for 35 days

    // 4. Log recent query record
    const recentItem = JSON.stringify({
      timestamp: now.toISOString(),
      promptPreview: telemetry.promptPreview.slice(0, 80),
      inputTokens: telemetry.inputTokens,
      outputTokens: telemetry.outputTokens,
      embeddingTokens: telemetry.embeddingTokens,
      costUSD: cost,
      latencyMs: telemetry.latencyMs || 0,
    });
    await redis.lpush("bot:stats:recent_queries", recentItem);
    await redis.ltrim("bot:stats:recent_queries", 0, 49); // Keep latest 50
  } catch (err) {
    console.error("[bot:telemetry] Failed to record query telemetry:", err);
  }
}

export interface MonthlyStat {
  month: string; // "2026-09"
  queries: number;
  inputTokens: number;
  outputTokens: number;
  embeddingTokens: number;
  totalTokens: number;
  totalCostUSD: number;
}

export interface DailyStat {
  date: string; // "2026-09-04"
  queries: number;
  inputTokens: number;
  outputTokens: number;
  embeddingTokens: number;
  totalTokens: number;
  totalCostUSD: number;
}

export interface RecentQueryLog {
  timestamp: string;
  promptPreview: string;
  inputTokens: number;
  outputTokens: number;
  embeddingTokens: number;
  costUSD: number;
  latencyMs: number;
}

export interface AdminBotStats {
  allTime: {
    queries: number;
    inputTokens: number;
    outputTokens: number;
    embeddingTokens: number;
    totalTokens: number;
    totalCostUSD: number;
  };
  months: MonthlyStat[];
  recentDays: DailyStat[];
  recentQueries: RecentQueryLog[];
  pricing: typeof PRICING;
  circuitBreaker: {
    todayQueries: number;
    dailyMax: number;
  };
}

export async function getAdminBotStats(): Promise<AdminBotStats> {
  const redis = getRedis();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  // 1. All-time stats
  const allTimeRaw = (await redis.hgetall<Record<string, string>>("bot:stats:all_time")) || {};
  const allTimeQueries = Number(allTimeRaw.queries || 0);
  const allTimeInput = Number(allTimeRaw.inputTokens || 0);
  const allTimeOutput = Number(allTimeRaw.outputTokens || 0);
  const allTimeEmbed = Number(allTimeRaw.embeddingTokens || 0);
  const allTimeCost = Number(allTimeRaw.totalCostUSD || 0);

  // 2. All months
  const monthsSet = (await redis.smembers("bot:stats:months_set")) || [];
  if (!monthsSet.includes(currentMonth)) {
    monthsSet.push(currentMonth);
  }
  monthsSet.sort().reverse();

  const months: MonthlyStat[] = [];
  for (const m of monthsSet) {
    const raw = (await redis.hgetall<Record<string, string>>(`bot:stats:month:${m}`)) || {};
    const q = Number(raw.queries || 0);
    const inp = Number(raw.inputTokens || 0);
    const out = Number(raw.outputTokens || 0);
    const emb = Number(raw.embeddingTokens || 0);
    const c = Number(raw.totalCostUSD || 0);

    months.push({
      month: m,
      queries: q,
      inputTokens: inp,
      outputTokens: out,
      embeddingTokens: emb,
      totalTokens: inp + out + emb,
      totalCostUSD: c,
    });
  }

  // 3. Last 14 days
  const recentDays: DailyStat[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const raw = (await redis.hgetall<Record<string, string>>(`bot:stats:day:${dateStr}`)) || {};
    const q = Number(raw.queries || 0);
    const inp = Number(raw.inputTokens || 0);
    const out = Number(raw.outputTokens || 0);
    const emb = Number(raw.embeddingTokens || 0);
    const c = Number(raw.totalCostUSD || 0);

    recentDays.push({
      date: dateStr,
      queries: q,
      inputTokens: inp,
      outputTokens: out,
      embeddingTokens: emb,
      totalTokens: inp + out + emb,
      totalCostUSD: c,
    });
  }

  // 4. Circuit Breaker today count
  const todayRaw = (await redis.get<number>(`bot:circuit_breaker:${today}`)) || 0;

  // 5. Recent queries
  const recentRaw = (await redis.lrange("bot:stats:recent_queries", 0, 24)) || [];
  const recentQueries: RecentQueryLog[] = recentRaw.map((item) => {
    try {
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch {
      return {
        timestamp: "",
        promptPreview: "",
        inputTokens: 0,
        outputTokens: 0,
        embeddingTokens: 0,
        costUSD: 0,
        latencyMs: 0,
      };
    }
  });

  return {
    allTime: {
      queries: allTimeQueries,
      inputTokens: allTimeInput,
      outputTokens: allTimeOutput,
      embeddingTokens: allTimeEmbed,
      totalTokens: allTimeInput + allTimeOutput + allTimeEmbed,
      totalCostUSD: allTimeCost,
    },
    months,
    recentDays,
    recentQueries,
    pricing: PRICING,
    circuitBreaker: {
      todayQueries: Number(todayRaw),
      dailyMax: 500,
    },
  };
}
