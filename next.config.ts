import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // @ts-expect-error - This feature is available but might not be in the type definition yet
    browserDebugInfoInTerminal: true,
    allowedDevOrigins: ["192.168.1.186:3000"],
  },
};

export default nextConfig;
