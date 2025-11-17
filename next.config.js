/** @type {import('next').NextConfig} */
const { resolve } = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Configure cache handler for ISR
    // Use path.resolve instead of require.resolve for ES modules
    incrementalCacheHandlerPath: resolve(process.cwd(), 'cache-handler.mjs'),
    // Instrumentation hook disabled - not needed for Pages Router with incrementalCacheHandlerPath
    instrumentationHook: false,
  },
};

module.exports = nextConfig;

