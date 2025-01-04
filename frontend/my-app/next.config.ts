import type { NextConfig } from 'next';
import JavaScriptObfuscator from 'webpack-obfuscator';

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {

    if (!dev) {
      // Apply JavaScript obfuscation for both SSR and CSR in production build
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


      // Suppress Webpack's "Critical dependency" warnings for dynamic imports or `require()` statements
      config.ignoreWarnings = [
        (warning : any) =>
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
