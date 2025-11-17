import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: 'healthy' | 'degraded' | 'unhealthy';
  redis: {
    connected: boolean;
    url?: string;
  };
  timestamp: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Log complete request details
  console.log('\n' + '='.repeat(80));
  console.log(`[API Request ${requestId}] ${req.method} ${req.url}`);
  console.log(`[API Request ${requestId}] Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`[API Request ${requestId}] Query:`, JSON.stringify(req.query, null, 2));
  console.log(`[API Request ${requestId}] IP:`, req.socket.remoteAddress);
  console.log('='.repeat(80) + '\n');

  try {
    // Try to import the cache handler to check Redis status
    // Note: This is a simplified check
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const isProduction = process.env.NODE_ENV === 'production';

    // In a real implementation, you'd check the actual Redis connection
    // For now, we'll check if Redis URL is configured
    const redisConfigured = !!process.env.REDIS_URL;

    const response: HealthResponse = {
      status: redisConfigured ? 'healthy' : 'degraded',
      redis: {
        connected: redisConfigured,
        url: redisUrl.replace(/:[^:@]+@/, ':****@'), // Hide password
      },
      timestamp: new Date().toISOString(),
    };

    const statusCode = response.status === 'healthy' ? 200 : 503;
    const duration = Date.now() - startTime;

    // Log complete response details
    console.log('\n' + '='.repeat(80));
    console.log(`[API Response ${requestId}] Status: ${statusCode}`);
    console.log(`[API Response ${requestId}] Headers:`, JSON.stringify(res.getHeaders(), null, 2));
    console.log(`[API Response ${requestId}] Body:`, JSON.stringify(response, null, 2));
    console.log(`[API Response ${requestId}] Duration: ${duration}ms`);
    console.log(`[API Response ${requestId}] Redis Configured: ${redisConfigured}`);
    console.log(`[API Response ${requestId}] Environment: ${isProduction ? 'production' : 'development'}`);
    console.log('='.repeat(80) + '\n');

    res.status(statusCode).json(response);
  } catch (error) {
    const errorResponse: HealthResponse = {
      status: 'unhealthy',
      redis: {
        connected: false,
      },
      timestamp: new Date().toISOString(),
    };
    
    const duration = Date.now() - startTime;

    // Log error response
    console.log('\n' + '='.repeat(80));
    console.log(`[API Response ${requestId}] Status: 503 Service Unavailable`);
    console.log(`[API Response ${requestId}] Error:`, error instanceof Error ? error.message : String(error));
    console.log(`[API Response ${requestId}] Body:`, JSON.stringify(errorResponse, null, 2));
    console.log(`[API Response ${requestId}] Duration: ${duration}ms`);
    console.log('='.repeat(80) + '\n');

    res.status(503).json(errorResponse);
  }
}

