/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@vibeboard/core'],
  experimental: {
    optimizePackageImports: ['@vibeboard/core'],
  },
};

module.exports = nextConfig;
