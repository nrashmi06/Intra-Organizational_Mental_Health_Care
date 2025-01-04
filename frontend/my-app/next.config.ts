import type { NextConfig } from 'next';
import JavaScriptObfuscator from 'webpack-obfuscator';

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Apply JavaScript obfuscation for both server-side and client-side builds
    config.plugins?.push(
      new JavaScriptObfuscator(
        {
          stringArray: true,    // Simple string array obfuscation
          selfDefending: true,  // Self-defending obfuscation
        },
        ['excluded_bundle.js']  // Specify files to exclude from obfuscation
      )
    );

    // Apply the obfuscator loader for both SSR and CSR code
    config.module?.rules?.push({
      test: /\.tsx$/,
      exclude: /node_modules/,
      enforce: 'post',
      use: {
        loader: JavaScriptObfuscator.loader,
        options: {
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['rc4'], // Use RC4 encoding for string arrays
        },
      },
    });

    // Make sure obfuscation is applied in both SSR and CSR
    if (!isServer) {
      // Client-side obfuscation, can include additional client-specific config if needed
      config.plugins?.push(
        new JavaScriptObfuscator(
          {
            stringArray: true,
            selfDefending: true,
            stringArrayEncoding: ['rc4'], // Client-side encoding
          },
          ['excluded_bundle.js']
        )
      );
    } else {
      // Server-side obfuscation, additional server-specific config if needed
      config.plugins?.push(
        new JavaScriptObfuscator(
          {
            stringArray: true,
            selfDefending: true,
            stringArrayEncoding: ['rc4'], // Server-side encoding
          },
          ['excluded_bundle.js']
        )
      );
    }

    return config;
  },

  images: {
    domains: ['res.cloudinary.com', '/public'],
  },
};

export default nextConfig;
