import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer", "esbuild"],
};

export default nextConfig;
