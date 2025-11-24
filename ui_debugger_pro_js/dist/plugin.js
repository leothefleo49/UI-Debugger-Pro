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

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  uiDebuggerPlugin: () => uiDebuggerPlugin
});
module.exports = __toCommonJS(plugin_exports);
function uiDebuggerPlugin() {
  return {
    name: "vite-plugin-ui-debugger",
    apply: "serve",
    // Only apply during dev
    transformIndexHtml(html) {
      return html.replace(
        "</body>",
        `
    <script type="module">
      import { createRoot } from 'react-dom/client';
      import React from 'react';
      import { UIDebugger } from 'ui-debugger-pro';
      
      // Create container
      const container = document.createElement('div');
      container.id = '__ui_debugger_pro_root__';
      container.style.position = 'fixed';
      container.style.zIndex = '99999';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '0';
      container.style.height = '0';
      document.body.appendChild(container);

      // Render
      const root = createRoot(container);
      root.render(React.createElement(UIDebugger));
    </script>
  </body>`
      );
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uiDebuggerPlugin
});
//# sourceMappingURL=plugin.js.map