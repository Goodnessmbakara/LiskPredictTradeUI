import NodeCache from 'node-cache';
import Redis from 'ioredis';
import { SentimentAnalysis } from '../engine';

// In-memory cache for quick access
const memoryCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
});

// Redis cache for persistent storage
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class SentimentCache {
  private static instance: SentimentCache;

  private constructor() {
    // Initialize cache
  }

  public static getInstance(): SentimentCache {
    if (!SentimentCache.instance) {
      SentimentCache.instance = new SentimentCache();
    }
    return SentimentCache.instance;
  }

  private getCacheKey(symbol: string, type: 'reddit' | 'news' | 'onchain'): string {
    return `sentiment:${type}:${symbol.toLowerCase()}`;
  }

  async getCachedSentiment(symbol: string, type: 'reddit' | 'news' | 'onchain'): Promise<any> {
    const cacheKey = this.getCacheKey(symbol, type);

    // Try memory cache first
    const memoryData = memoryCache.get(cacheKey);
    if (memoryData) {
      return memoryData;
    }

    // Try Redis cache
    const redisData = await redis.get(cacheKey);
    if (redisData) {
      const parsedData = JSON.parse(redisData);
      // Update memory cache
      memoryCache.set(cacheKey, parsedData);
      return parsedData;
    }

    return null;
  }

  async setCachedSentiment(
    symbol: string,
    type: 'reddit' | 'news' | 'onchain',
    data: any,
    ttl: number = 300 // 5 minutes default
  ): Promise<void> {
    const cacheKey = this.getCacheKey(symbol, type);
    const serializedData = JSON.stringify(data);

    // Set in memory cache
    memoryCache.set(cacheKey, data);

    // Set in Redis cache
    await redis.set(cacheKey, serializedData, 'EX', ttl);
  }

  async invalidateCache(symbol: string, type?: 'reddit' | 'news' | 'onchain'): Promise<void> {
    if (type) {
      const cacheKey = this.getCacheKey(symbol, type);
      memoryCache.del(cacheKey);
      await redis.del(cacheKey);
    } else {
      // Invalidate all types for the symbol
      const types: ('reddit' | 'news' | 'onchain')[] = ['reddit', 'news', 'onchain'];
      for (const t of types) {
        const cacheKey = this.getCacheKey(symbol, t);
        memoryCache.del(cacheKey);
        await redis.del(cacheKey);
      }
    }
  }

  // Get cache statistics
  getStats(): { memory: NodeCache.Stats; redis: Promise<number> } {
    return {
      memory: memoryCache.getStats(),
      redis: redis.dbsize(),
    };
  }
} 