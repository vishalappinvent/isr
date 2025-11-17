# Enterprise Redis Cache Handler Setup

This project uses `@neshca/cache-handler` with Redis for enterprise-level ISR cache coordination across cluster instances.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Only **one** environment variable is required:

```bash
REDIS_URL=redis://3.88.216.32:6379
```

Or with password:
```bash
REDIS_URL=redis://:your-password@3.88.216.32:6379
```

### 3. Build and Run

```bash
npm run build
npm start
```

## Automatic Defaults

All settings have sensible defaults - you only need to set `REDIS_URL`:

| Setting | Default Value |
|---------|---------------|
| `REDIS_CONNECT_TIMEOUT` | 10000ms |
| `REDIS_MAX_RETRIES` | 3 |
| `REDIS_ENABLE_READY_CHECK` | true |
| `REDIS_ENABLE_OFFLINE_QUEUE` | false |
| `REDIS_LAZY_CONNECT` | false |
| `CACHE_LOG_LEVEL` | info |
| `CACHE_ENABLE_METRICS` | true |

## Optional: Override Defaults

If you need to customize any setting, add it to your environment:

```bash
# Example: Enable debug logging
CACHE_LOG_LEVEL=debug

# Example: Increase connection timeout
REDIS_CONNECT_TIMEOUT=20000

# Example: Enable lazy connect
REDIS_LAZY_CONNECT=true
```

## PM2 Configuration

Minimal PM2 config (only `REDIS_URL` required):

```json
{
  "apps": [
    {
      "name": "bodyShop_SSR_Next",
      "script": "server.js",
      "instances": 2,
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": "6664",
        "NEXT_PUBLIC_APP_URL": "http://3.88.216.32:6664",
        "REDIS_URL": "redis://3.88.216.32:6379"
      }
    }
  ]
}
```

## Health Check

Check cache health:

```bash
curl http://localhost:6664/api/cache-health
```

## Features

✅ **Automatic Redis connection management**
✅ **Reconnection strategy with exponential backoff**
✅ **Health checks and monitoring**
✅ **Graceful degradation** (falls back if Redis fails)
✅ **Structured logging** with configurable levels
✅ **Connection pooling and timeout handling**
✅ **Graceful shutdown handling**
✅ **Works in cluster mode** (multiple instances share cache)
✅ **Error handling and retry logic**

## How It Works

1. `@neshca/cache-handler` automatically coordinates ISR cache across all cluster instances
2. All instances share the same Redis cache
3. When one instance regenerates a page, all instances are notified
4. ISR revalidation is synchronized across the cluster

## Troubleshooting

### Check Redis Connection

```bash
# From your local machine
redis-cli -h 3.88.216.32 -p 6379 ping
```

### Check Logs

```bash
pm2 logs bodyShop_SSR_Next
```

Look for:
- `[Cache Info] Redis client ready` - Connection successful
- `[Cache Error]` - Connection issues

### Verify Cache Handler

```bash
curl http://localhost:6664/api/cache-health
```

Expected response:
```json
{
  "status": "healthy",
  "redis": {
    "connected": true,
    "url": "redis://3.88.216.32:6379"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

