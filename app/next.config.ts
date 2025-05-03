import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://api.universalprofile.cloud/ipfs/**"),
      new URL("https://api.universalprofile.cloud/image/**"),
    ],
  },
};

export default nextConfig;
