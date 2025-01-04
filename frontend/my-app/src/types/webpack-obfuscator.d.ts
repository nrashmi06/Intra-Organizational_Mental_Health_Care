declare module 'webpack-obfuscator' {
    import { Plugin } from 'webpack'
    
    interface ObfuscatorOptions {
      rotateStringArray?: boolean
      stringArray?: boolean
      stringArrayEncoding?: string[]
      stringArrayThreshold?: number
      compact?: boolean
      controlFlowFlattening?: boolean
      deadCodeInjection?: boolean
      debugProtection?: boolean
      disableConsoleOutput?: boolean
      identifierNamesGenerator?: string
      [key: string]: any
    }
  
    class WebpackObfuscator extends Plugin {
      constructor(options?: ObfuscatorOptions, excludes?: string[])
      static loader: string
    }
  
    export = WebpackObfuscator
  }