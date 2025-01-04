import type { NextConfig } from 'next';
import JavaScriptObfuscator from 'webpack-obfuscator';

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Apply JavaScript obfuscation during production build
      config.plugins?.push(
        new JavaScriptObfuscator(
  {
    stringArray: true, // Simple string array obfuscation
    selfDefending: true,
  },
          ['excluded_bundle.js']  // Specify files to exclude from obfuscation
        )
      );      

      config.module?.rules?.push({
        test: /\.tsx$/,
        exclude: /node_modules/, 
        enforce: 'post',
        use: {
          loader: JavaScriptObfuscator.loader,
          options: {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['rc4'], 

          },
        },
      });
    }

    return config;
  },

  images: {
    domains: ['res.cloudinary.com', '/public'],
  },
};

export default nextConfig;
