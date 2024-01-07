const withPWA = require("next-pwa")({
  dest: "public",
  swSrc: "service-worker.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "",
  images: {
    loader: "akamai",
    path: "",
  },
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
      "/account": { page: "/account" },
      "/fallback": { page: "/fallback" },
    };
  },
  externals: {
    FileReader: "FileReader",
  },
  webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
};

module.exports = withPWA({
  ...nextConfig,
});
