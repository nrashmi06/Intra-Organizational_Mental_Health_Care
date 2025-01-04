import JavaScriptObfuscator from 'webpack-obfuscator';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Add the JavaScript obfuscator plugin for production builds
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

      // Add loader configuration for JavaScript obfuscation
      config.module.rules.push({
        test: /\.tsx$/,  // Only matches .tsx files
        exclude: /node_modules/, // Exclude node_modules
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
