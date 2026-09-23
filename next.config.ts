import type { NextConfig } from "next";

// Static export so the site can be hosted anywhere (GitHub Pages, Netlify, Vercel…).
// Set NEXT_PUBLIC_BASE_PATH="/portfolio" when serving from a project sub-path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
