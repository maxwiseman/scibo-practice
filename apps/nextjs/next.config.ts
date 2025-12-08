import { NextConfig } from "next";
import "./src/env";

// import { fileURLToPath } from "url";
// import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
// createJiti(fileURLToPath(import.meta.url))("./src/env");

const config: NextConfig = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@scibo/api",
    "@scibo/auth",
    "@scibo/db",
    "@scibo/ui",
    "@scibo/validators",
  ],

  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
  experimental: {
    viewTransition: true
  }
};

export default config;
