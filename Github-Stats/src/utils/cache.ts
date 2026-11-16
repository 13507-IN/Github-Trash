import { LRUCache } from 'lru-cache';

const defaultOptions = {
  max: 500, // store up to 500 rendered cards or data objects
  ttl: 1000 * 60 * 60 * 2, // 2 hours default TTL
  allowStale: true
};

export const memoryCache = new LRUCache<string, any>(defaultOptions);

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 1000 * 60 * 60 * 2
): Promise<T> {
  const cached = memoryCache.get(key) as T | undefined;
  if (cached !== undefined) {
    return cached;
  }

  try {
    const data = await fetcher();
    memoryCache.set(key, data, { ttl: ttlMs });
    return data;
  } catch (error) {
    // If stale value exists, return it even if expired to prevent broken images
    const stale = memoryCache.peek(key) as T | undefined;
    if (stale !== undefined) {
      return stale;
    }
    throw error;
  }
}
