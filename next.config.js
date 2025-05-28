/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcMinify: false,
  },
  webpack: (config, { isServer }) => {
    return config;
  },
}

module.exports = nextConfig 