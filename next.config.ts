import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.50.31',
    '192.168.50.31:3000',
  ],
};

export default nextConfig;