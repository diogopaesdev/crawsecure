import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crawsecure/core", "@crawsecure/browser"],
};

export default nextConfig;
