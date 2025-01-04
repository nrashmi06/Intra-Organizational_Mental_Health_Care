import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'webpack-obfuscator';

// Define __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new JavaScriptObfuscator(
        {
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
          ...(dev
            ? {
                compact: false,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                disableConsoleOutput: false,
              }
            : {
                compact: true,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                debugProtection: true,
                disableConsoleOutput: true,
              }),
        },
        ['excluded_bundle.js']
      )
    );

    config.module.rules.push({
      test: /\.(js|tsx|ts)$/,
      exclude: [
        path.resolve(__dirname, 'src/pages/api'), // Convert to absolute path
        /node_modules/,
        path.resolve(__dirname, 'excluded_file.ts'), // Convert to absolute path
      ],
      enforce: 'post',
      use: {
        loader: JavaScriptObfuscator.loader,
        options: {
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          ...(dev
            ? {
                compact: false,
                controlFlowFlattening: false,
              }
            : {
                compact: true,
                controlFlowFlattening: true,
              }),
        },
      },
    });

    return config;
  },
};

export default nextConfig;
