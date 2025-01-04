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
          [] // No files excluded from obfuscation
        )
      );

      // Apply to SSR and CSR
      config.module?.rules?.push({
        test: /\.(js|tsx|ts)$/, // Target JavaScript and TypeScript files
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

      // Suppress Webpack's "Critical dependency" warnings for dynamic imports or `require()` statements
      config.ignoreWarnings = [
        (warning) =>
          warning.message.includes('Critical dependency') || 
          warning.message.includes('the request of a dependency is an expression')
      ];
    }

    return config;
  },

  images: {
    domains: ['res.cloudinary.com', '/public'],
  },
};

export default nextConfig;
