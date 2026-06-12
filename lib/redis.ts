import { Redis } from "@upstash/redis";

// Singleton Upstash Redis client — only usable server-side
// These env vars have NO NEXT_PUBLIC_ prefix = never bundled into client JS

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "[redis] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in .env.local"
      );
    }

    redis = new Redis({ url, token });
  }

  return redis;
}

// Cache TTL: 6 hours in seconds
export const CACHE_TTL = 6 * 60 * 60;

/**
 * Get a value from cache, or compute + store it if missing.
 * This is the main caching primitive used by all GitHub fetchers.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<{ data: T; fromCache: boolean }> {
  const r = getRedis();

  try {
    // Try cache first
    const cached = await r.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return { data: cached, fromCache: true };
    }
  } catch (err) {
    // Redis down — fall through to fetcher
    console.warn("[redis] Cache read failed, falling through to fetcher:", err);
  }

  // Cache miss — fetch fresh data
  const data = await fetcher();

  try {
    // Store in cache (fire-and-forget, don't block response)
    await r.set(key, JSON.stringify(data), { ex: ttl });
  } catch (err) {
    console.warn("[redis] Cache write failed:", err);
  }

  return { data, fromCache: false };
}
