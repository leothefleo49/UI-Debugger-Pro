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

// src/webpack-plugin.ts
var webpack_plugin_exports = {};
__export(webpack_plugin_exports, {
  UIDebuggerWebpackPlugin: () => UIDebuggerWebpackPlugin
});
module.exports = __toCommonJS(webpack_plugin_exports);
var UIDebuggerWebpackPlugin = class {
  apply(compiler) {
    compiler.hooks.compilation.tap("UIDebuggerWebpackPlugin", (compilation) => {
      var _a;
      (_a = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) == null ? void 0 : _a.tap(
        "UIDebuggerWebpackPlugin",
        (data) => {
          const script = `
            <script>
              (function() {
                const script = document.createElement('script');
                script.type = 'module';
                script.textContent = \`
                  import { createRoot } from 'react-dom/client';
                  import React from 'react';
                  import { UIDebugger } from 'ui-debugger-pro';
                  
                  const container = document.createElement('div');
                  container.id = '__ui_debugger_pro_root__';
                  container.style.cssText = 'position:fixed;z-index:99999;top:0;left:0;width:0;height:0;';
                  document.body.appendChild(container);
                  
                  const root = createRoot(container);
                  root.render(React.createElement(UIDebugger));
                \`;
                document.body.appendChild(script);
              })();
            </script>
          `;
          data.html = data.html.replace("</body>", `${script}</body>`);
          return data;
        }
      );
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UIDebuggerWebpackPlugin
});
//# sourceMappingURL=webpack-plugin.js.map