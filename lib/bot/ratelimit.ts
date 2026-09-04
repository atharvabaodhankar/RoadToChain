import { getRedis } from "@/lib/redis";

// Hard limits to mathematically prevent unexpected billing
export const GLOBAL_DAILY_MAX = 500; // Platform-wide daily cap (~$0.05 on Nova)
export const USER_DAILY_MAX = 20;    // Max questions per user/IP per day
export const USER_MINUTE_MAX = 5;    // Burst rate: max 5 questions per minute

export interface RateLimitResult {
  allowed: boolean;
  reason?: "CIRCUIT_BREAKER" | "USER_DAILY_LIMIT" | "USER_BURST_LIMIT" | "INPUT_TOO_LONG";
  message?: string;
  remainingToday: number;
}

export async function checkRateLimit(identifier: string, inputLength: number): Promise<RateLimitResult> {
  // 1. Input sanitization (max 500 characters)
  if (inputLength > 500) {
    return {
      allowed: false,
      reason: "INPUT_TOO_LONG",
      message: "Question is too long (max 500 characters). Please keep your query concise.",
      remainingToday: 0,
    };
  }

  const redis = getRedis();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMinute = Math.floor(Date.now() / 60000);

  try {
    // 2. Global Circuit Breaker Check
    const globalKey = `bot:circuit_breaker:${today}`;
    const globalCount = await redis.incr(globalKey);
    if (globalCount === 1) {
      await redis.expire(globalKey, 86400); // 24 hours
    }

    if (globalCount > GLOBAL_DAILY_MAX) {
      return {
        allowed: false,
        reason: "CIRCUIT_BREAKER",
        message: "Platform daily community quota reached. The AI assistant will reset at midnight UTC.",
        remainingToday: 0,
      };
    }

    // 3. User Burst Limit (5 per minute)
    const userMinuteKey = `bot:rate:${identifier}:min:${currentMinute}`;
    const userMinuteCount = await redis.incr(userMinuteKey);
    if (userMinuteCount === 1) {
      await redis.expire(userMinuteKey, 65); // 65 seconds
    }

    if (userMinuteCount > USER_MINUTE_MAX) {
      return {
        allowed: false,
        reason: "USER_BURST_LIMIT",
        message: "You're sending questions too quickly. Please wait a minute before asking again.",
        remainingToday: 0,
      };
    }

    // 4. User Daily Limit (20 per day)
    const userDailyKey = `bot:rate:${identifier}:daily:${today}`;
    const userDailyCount = await redis.incr(userDailyKey);
    if (userDailyCount === 1) {
      await redis.expire(userDailyKey, 86400); // 24 hours
    }

    const remaining = Math.max(0, USER_DAILY_MAX - userDailyCount);

    if (userDailyCount > USER_DAILY_MAX) {
      return {
        allowed: false,
        reason: "USER_DAILY_LIMIT",
        message: `You have reached your daily allowance of ${USER_DAILY_MAX} questions. Resets tomorrow!`,
        remainingToday: 0,
      };
    }

    return {
      allowed: true,
      remainingToday: remaining,
    };
  } catch (err) {
    console.error("[bot:ratelimit] Redis check failed:", err);
    // Graceful fallback if Redis is temporarily unreachable (fail safe with remaining count)
    return {
      allowed: true,
      remainingToday: 5,
    };
  }
}
