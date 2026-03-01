import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crawsecure/core", "@crawsecure/browser"],
  // firebase-admin uses native Node.js modules — must not be bundled
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore"],
};

export default nextConfig;
