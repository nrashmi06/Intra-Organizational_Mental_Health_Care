import type { NextConfig } from 'next';
import JavaScriptObfuscator from 'webpack-obfuscator';

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Apply JavaScript obfuscation for both SSR and CSR in production build
      config.plugins?.push(
        new JavaScriptObfuscator(
          {
            stringArray: true, // Simple string array obfuscation
            selfDefending: true, // Protects against tampering
            controlFlowFlattening: true, // Adds more complexity
            debugProtection: true, // Protects from debugging
          },
          ['excluded_bundle.js'] // Specify files to exclude from obfuscation
        )
      );       

      // Apply to SSR (Server-Side Rendering) and CSR (Client-Side Rendering)
      config.module?.rules?.push({
        test: /\.tsx$/, // Target TypeScript files
        exclude: /node_modules/, // Exclude node_modules
        enforce: 'post', // Apply after other loaders
        use: {
          loader: JavaScriptObfuscator.loader,
          options: {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['rc4'], // RC4 encoding for strings
            controlFlowFlattening: true, // More control flow obfuscation
            deadCodeInjection: true, // Injects dead code for obfuscation
            debugProtection: true, // Protection from debugging tools
            selfDefending: true, // Makes the code resistant to tampering
            identifierNamesGenerator: 'hexadecimal', // Hexadecimal names for variables and functions
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
