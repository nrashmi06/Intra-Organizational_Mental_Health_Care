import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'webpack-obfuscator';

// Polyfill __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          controlFlowFlattening: true,
          deadCodeInjection: true,
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          numbersToExpressions: true,
          selfDefending: true,
        }, ['excluded_bundle.js'])
      );

      // Loader configuration
      config.module.rules.push({
        test: /\.(js|tsx|ts)$/,
        exclude: [
          /node_modules/, // Exclude node_modules
          path.resolve(__dirname, 'src/service'), // Exclude all files in 'service' folder
        ],
        enforce: 'post',
        use: {
          loader: JavaScriptObfuscator.loader,
          options: {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
          },
        },
      });
    }
    return config;
  },
};

export default nextConfig;
