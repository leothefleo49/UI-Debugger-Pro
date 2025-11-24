"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/next-plugin.ts
var next_plugin_exports = {};
__export(next_plugin_exports, {
  withUIDebugger: () => withUIDebugger
});
module.exports = __toCommonJS(next_plugin_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  withUIDebugger
});
//# sourceMappingURL=next-plugin.js.map