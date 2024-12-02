import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com','/public'], // Add cloudinary domain here
  },
};

export default nextConfig;
