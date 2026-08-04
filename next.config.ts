import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/d4vide-portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
