// @ts-ignore - webpack is an optional peer dependency
import type { Compiler } from 'webpack';

export class UIDebuggerWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('UIDebuggerWebpackPlugin', (compilation: any) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing?.tap(
        'UIDebuggerWebpackPlugin',
        (data: any) => {
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
          
          data.html = data.html.replace('</body>', `${script}</body>`);
          return data;
        }
      );
    });
  }
}
