/** @type {import('next').NextConfig} */

const withImages = require('next-images');

const nextConfig = {
  images: {
    loader: 'akamai',
    path: '',
  },
};
module.exports = nextConfig;
module.exports = withImages();

module.exports = {
  reactStrictMode: true,
  externals: {
    FileReader: "FileReader"
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/account': { page: '/account' }
    }
  },
  reactStrictMode: true,
  assetPrefix: "#",
  webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
};
