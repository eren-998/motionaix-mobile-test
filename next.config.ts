import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer", "esbuild"],
};

export default nextConfig;
