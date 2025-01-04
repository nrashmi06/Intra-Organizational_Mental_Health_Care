import path from 'path'
import JavaScriptObfuscator from 'webpack-obfuscator'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
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
        ...(dev ? {
          compact: false,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          disableConsoleOutput: false,
        } : {
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
          debugProtection: true,
          disableConsoleOutput: true,
        })
      }, ['excluded_bundle.js'])
    )

    // Loader configuration
    config.module.rules.push({
      test: /\.(js|tsx|ts)$/,
      exclude: [
        path.resolve(__dirname, 'src/pages/api'),
        /node_modules/,
        'excluded_file.ts'
      ],
      enforce: 'post',
      use: {
        loader: JavaScriptObfuscator.loader,
        options: {
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          // Different settings for dev vs prod
          ...(dev ? {
            // Lighter settings for development
            compact: false,
            controlFlowFlattening: false
          } : {
            // Heavier settings for production
            compact: true,
            controlFlowFlattening: true
          })
        }
      }
    })
    
    return config
  }
}

export default nextConfig