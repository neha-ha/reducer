// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, options) {
    // Enable WebAssembly and Layers experiment
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true, // Add this line to fix the "entryOptions.layer" issue
    };

    return config;
  },
};

export default nextConfig;


