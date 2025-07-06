import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png')],
  },

};

export default nextConfig;
