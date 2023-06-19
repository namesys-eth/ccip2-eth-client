/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'

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
      '/account': { page: isProduction ? '/account.html' : '/account' },
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
