export function withUIDebugger(nextConfig: any = {}) {
  return {
    ...nextConfig,
    webpack(config: any, options: any) {
      // Inject debugger only in development
      if (options.dev && !options.isServer) {
        const originalEntry = config.entry;
        config.entry = async () => {
          const entries = await originalEntry();
          
          // Add our debugger to the main app entry
          if (entries['main.js'] && !entries['main.js'].includes('ui-debugger-pro-inject')) {
            entries['main.js'].unshift('ui-debugger-pro/inject');
          }
          
          return entries;
        };
      }
      
      // Call the user's custom webpack config if it exists
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      
      return config;
    },
  };
}
