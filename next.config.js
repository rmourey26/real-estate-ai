/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // This will replace all imports from '@mysten/sui/utils' with '@mysten/sui.js/utils'
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mysten/sui/utils": "@mysten/sui.js/utils",
    }

    return config
  },
}

module.exports = nextConfig
