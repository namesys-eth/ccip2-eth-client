/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "",
  images: {
    loader: 'akamai',
    path: '',
  },
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/account': { page: '/account' }
    }
  },
  externals: {
    FileReader: "FileReader"
  },
  webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }
    }
    return config
  }
}

module.exports = nextConfig
