import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.186:3000"],
  experimental: {
    browserDebugInfoInTerminal: true,
  },
};

export default nextConfig;
