import path from 'path'
import JavaScriptObfuscator from 'webpack-obfuscator'

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
          selfDefending: true
        }, ['excluded_bundle.js'])
      )

      // Loader configuration
      config.module.rules.push({
        test: /\.(js|tsx|ts)$/,
        exclude: [
            /node_modules/, // Exclude node_modules
            path.resolve(__dirname, 'src/service/**/*.ts') // Exclude all `.ts` files in 'service' folder and subfolders
          ],
        enforce: 'post',
        use: {
          loader: JavaScriptObfuscator.loader,
          options: {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['base64']
          }
        }
      })
    }
    return config
  }
}

export default nextConfig
