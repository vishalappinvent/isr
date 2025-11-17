/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Configure cache handler for ISR
    incrementalCacheHandlerPath: require.resolve('./cache-handler.mjs'),
    // Instrumentation hook disabled - not needed for Pages Router with incrementalCacheHandlerPath
    instrumentationHook: false,
  },
};

module.exports = nextConfig;

