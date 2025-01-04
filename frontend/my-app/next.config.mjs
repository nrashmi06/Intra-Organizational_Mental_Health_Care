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

    config.module.rules.push({
      test: /\.(js|tsx|ts)$/,
      exclude: [
        path.resolve(__dirname, 'src/service'),
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
          ...(dev ? {
            compact: false,
            controlFlowFlattening: false
          } : {
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