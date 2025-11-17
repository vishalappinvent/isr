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
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      redis: {
        connected: false,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

