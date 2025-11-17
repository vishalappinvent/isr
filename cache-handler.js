/**
 * Enterprise Redis Cache Handler for Next.js 13.5.6 (Pages Router)
 * Using @neshca/cache-handler with enterprise-grade error handling
 * CommonJS version for Next.js 13.5.6 compatibility
 */

const { CacheHandler } = require('@neshca/cache-handler');

// Lazy load ES modules (they export as default)
let createRedisCache = null;
let createLruCache = null;

async function loadRedisCache() {
  if (!createRedisCache) {
    const redisModule = await import('@neshca/cache-handler/redis-strings');
    createRedisCache = redisModule.default || redisModule;
  }
  return createRedisCache;
}

async function loadLruCache() {
  if (!createLruCache) {
    const lruModule = await import('@neshca/cache-handler/local-lru');
    createLruCache = lruModule.default || lruModule;
  }
  return createLruCache;
}

// ============================================================================
// Configuration with automatic defaults
// ============================================================================

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CACHE_KEY_PREFIX = process.env.CACHE_KEY_PREFIX || 'next-cache';
const CACHE_LOG_LEVEL = process.env.CACHE_LOG_LEVEL || 'info'; // 'debug', 'info', 'warn', 'error'

// Detect build time to prevent Redis connection during build
const IS_BUILD = typeof process !== 'undefined' && (
  process.env.NEXT_PHASE === 'phase-production-build' ||
  (process.argv && process.argv.some(arg => arg.includes('build')))
);

// ============================================================================
// Enterprise Logger
// ============================================================================

const logger = {
  debug: (...args) => {
    if (['debug'].includes(CACHE_LOG_LEVEL)) {
      console.log('[Cache]', ...args);
    }
  },
  info: (...args) => {
    if (['debug', 'info'].includes(CACHE_LOG_LEVEL)) {
      console.log('[Cache]', ...args);
    }
  },
  warn: (...args) => {
    if (['debug', 'info', 'warn'].includes(CACHE_LOG_LEVEL)) {
      console.warn('[Cache]', ...args);
    }
  },
  error: (...args) => {
    console.error('[Cache]', ...args);
  },
};

// ============================================================================
// Redis Client Factory with Enterprise Configuration
// ============================================================================

let redisClient = null;
let redisClientPromise = null;

async function getRedisClient() {
  // During build, return null to skip Redis
  if (IS_BUILD) {
    logger.debug('Build time detected - skipping Redis initialization');
    return null;
  }

  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (redisClientPromise) {
    return redisClientPromise;
  }

  redisClientPromise = (async () => {
    try {
      // Lazy import Redis to prevent blocking during build
      const redis = await import('redis');
      const { createClient } = redis;

      const client = createClient({
        url: REDIS_URL,
        socket: {
          connectTimeout: 10000,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis connection failed after max retries', { retries });
              return new Error('Max reconnection attempts reached');
            }
            const delay = Math.min(retries * 50, 2000);
            logger.warn(`Redis reconnecting... (attempt ${retries}/10)`, { delay });
            return delay;
          },
        },
        lazyConnect: true, // Don't connect until needed
      });

      // Event handlers
      client.on('error', (err) => {
        logger.error('Redis error:', err.message);
      });

      client.on('connect', () => {
        logger.info('Redis connecting...');
      });

      client.on('ready', () => {
        logger.info('Redis ready');
      });

      client.on('reconnecting', () => {
        logger.warn('Redis reconnecting...');
      });

      // Connect with timeout
      try {
        await Promise.race([
          client.connect(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Redis connection timeout')), 10000)
          ),
        ]);
        logger.info('Redis connected successfully');
      } catch (error) {
        logger.error('Redis connection failed:', error.message);
        throw error;
      }

      redisClient = client;
      return client;
    } catch (error) {
      logger.error('Failed to create Redis client:', error.message);
      redisClientPromise = null;
      return null;
    }
  })();

  return redisClientPromise;
}

// ============================================================================
// Cache Handler Registration
// ============================================================================

CacheHandler.onCreation(async (context) => {
  logger.debug('Cache handler creation started', {
    buildId: context.buildId,
    dev: context.dev,
    isBuild: IS_BUILD,
  });

  // TTL function - evict slightly later than Next.js revalidate to avoid thrash
  const useTtl = (maxAge) => {
    if (!maxAge || typeof maxAge !== 'number') return undefined;
    // Add 50% buffer to avoid thrash
    return Math.floor(maxAge * 1.5);
  };

  let redisCache = null;

  // Only initialize Redis if not in build mode
  if (!IS_BUILD) {
    try {
      const client = await Promise.race([
        getRedisClient(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Redis client initialization timeout')), 5000)
        ),
      ]);

      if (client && client.isOpen) {
        const createRedisCacheFn = await loadRedisCache();
        redisCache = await createRedisCacheFn({
          client,
          useTtl,
          keyPrefix: context.buildId
            ? `${CACHE_KEY_PREFIX}:${context.buildId}:`
            : `${CACHE_KEY_PREFIX}:`,
        });
        logger.info('Redis cache handler initialized');
      } else {
        logger.warn('Redis client not available, using local cache only');
      }
    } catch (error) {
      logger.error('Failed to initialize Redis cache:', error.message);
      // Continue with local cache only - graceful degradation
    }
  } else {
    logger.debug('Build time - skipping Redis initialization');
  }

  // Local in-memory LRU fallback (always available)
  const createLruCacheFn = await loadLruCache();
  const localCache = createLruCacheFn({
    useTtl,
    // Optional: limit size to prevent memory issues
    // maxSize: 64 * 1024 * 1024, // 64 MB
  });
  logger.debug('Local LRU cache handler initialized');

  // Wrap handlers with logging to track cache hits
  const wrapHandlerWithLogging = (handler, handlerName) => {
    if (!handler) return null;
    
    return {
      name: handler.name || handlerName,
      get: async (key, meta) => {
        const startTime = Date.now();
        try {
          const result = await handler.get(key, meta);
          const duration = Date.now() - startTime;
          
          if (result) {
            logger.info(`✅ Cache HIT from ${handlerName}`, {
              key: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
              duration: `${duration}ms`,
              hasValue: !!result.value,
              lastModified: result.lastModified ? new Date(result.lastModified).toISOString() : null,
              tags: result.tags || [],
            });
            console.log(`[Cache] ✅ HIT from ${handlerName} | Key: ${key.substring(0, 50)} | ${duration}ms`);
          } else {
            logger.debug(`❌ Cache MISS from ${handlerName}`, {
              key: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
              duration: `${duration}ms`,
            });
          }
          
          return result;
        } catch (error) {
          logger.error(`Error in ${handlerName}.get:`, error.message);
          return null;
        }
      },
      set: async (key, value) => {
        const startTime = Date.now();
        try {
          await handler.set(key, value);
          const duration = Date.now() - startTime;
          logger.info(`💾 Cache SET to ${handlerName}`, {
            key: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
            duration: `${duration}ms`,
            hasValue: !!value?.value,
            tags: value?.tags || [],
          });
          console.log(`[Cache] 💾 SET to ${handlerName} | Key: ${key.substring(0, 50)} | ${duration}ms`);
        } catch (error) {
          logger.error(`Error in ${handlerName}.set:`, error.message);
        }
      },
      revalidateTag: async (tag) => {
        const startTime = Date.now();
        try {
          await handler.revalidateTag(tag);
          const duration = Date.now() - startTime;
          logger.info(`🔄 Cache REVALIDATE tag in ${handlerName}`, {
            tag,
            duration: `${duration}ms`,
          });
          console.log(`[Cache] 🔄 REVALIDATE tag "${tag}" in ${handlerName} | ${duration}ms`);
        } catch (error) {
          logger.error(`Error in ${handlerName}.revalidateTag:`, error.message);
        }
      },
      delete: handler.delete ? async (key) => {
        try {
          await handler.delete(key);
          logger.debug(`🗑️ Cache DELETE from ${handlerName}`, { key });
        } catch (error) {
          logger.error(`Error in ${handlerName}.delete:`, error.message);
        }
      } : undefined,
    };
  };

  // Wrap handlers with logging
  const wrappedHandlers = [];
  if (redisCache) {
    const wrappedRedis = wrapHandlerWithLogging(redisCache, 'Redis');
    if (wrappedRedis) wrappedHandlers.push(wrappedRedis);
  }
  const wrappedLocal = wrapHandlerWithLogging(localCache, 'Local LRU');
  if (wrappedLocal) wrappedHandlers.push(wrappedLocal);

  // Log build-time pages (from filesystem/build)
  if (context.buildId) {
    logger.info('📦 Build detected', {
      buildId: context.buildId,
      dev: context.dev,
    });
    console.log(`[Cache] 📦 Build ID: ${context.buildId} | Pages will be served from build cache initially`);
  }

  // Return configuration
  // Order matters: Redis first (shared), then local (per-instance fallback)
  return {
    handlers: wrappedHandlers,
    // Disable filesystem cache since we're using Redis
    useFileSystem: false,
    // Optional: Custom TTL configuration
    ttl: {
      defaultStaleAge: 31536000, // 1 year default
      estimateExpireAge: (staleAge) => Math.floor(staleAge * 1.5),
    },
  };
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

const shutdown = async () => {
  if (redisClient && redisClient.isOpen) {
    try {
      logger.info('Closing Redis connection...');
      await Promise.race([
        redisClient.quit(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Shutdown timeout')), 5000)
        ),
      ]);
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error.message);
      redisClient.disconnect();
    }
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Export CacheHandler for Next.js (CommonJS)
module.exports = CacheHandler;

