// @ts-ignore - vite is an optional peer dependency
import type { Plugin } from 'vite';

export function uiDebuggerPlugin(): Plugin {
  return {
    name: 'vite-plugin-ui-debugger',
    apply: 'serve', // Only apply during dev
    transformIndexHtml(html) {
      return html.replace(
        '</body>',
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
    },
  };
}
