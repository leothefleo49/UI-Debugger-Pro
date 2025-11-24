// src/next-plugin.ts
function withUIDebugger(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      if (options.dev && !options.isServer) {
        const originalEntry = config.entry;
        config.entry = async () => {
          const entries = await originalEntry();
          if (entries["main.js"] && !entries["main.js"].includes("ui-debugger-pro-inject")) {
            entries["main.js"].unshift("ui-debugger-pro/inject");
          }
          return entries;
        };
      }
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  };
}
export {
  withUIDebugger
};
//# sourceMappingURL=next-plugin.mjs.map