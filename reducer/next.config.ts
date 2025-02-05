// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, {isServer}) {
    // Enable WebAssembly and Layers experiment
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true, // Add this line to fix the "entryOptions.layer" issue
    };

    if (!isServer) {
      // Prevents Webpack from trying to bundle "fs" module in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;

