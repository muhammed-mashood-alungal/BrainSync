import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      });
    }
    return config;
  },
};

export default nextConfig;
