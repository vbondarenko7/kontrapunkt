import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: "/kontrapunkt",
      assetPrefix: "/kontrapunkt",
      images: { unoptimized: true },
      typescript: { ignoreBuildErrors: true },
    }
  : {};

export default nextConfig;
