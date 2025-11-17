/** @type {import('next').NextConfig} */
const { resolve } = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Configure cache handler for ISR
    // Using CommonJS version (.js) for Next.js 13.5.6 compatibility
    incrementalCacheHandlerPath: resolve(process.cwd(), 'cache-handler.js'),
    // Instrumentation hook disabled - not needed for Pages Router with incrementalCacheHandlerPath
    instrumentationHook: false,
  },
};

module.exports = nextConfig;

