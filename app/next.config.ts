import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://api.universalprofile.cloud/ipfs/**")],
  },
};

export default nextConfig;
