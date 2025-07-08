import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
   typescript: {
    ignoreBuildErrors: true, // Temporary bypass
  },
};

export default nextConfig;
