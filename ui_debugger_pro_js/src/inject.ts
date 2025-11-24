// This file is used for Next.js auto-injection
// It will be loaded via webpack entry modification
if (typeof window !== 'undefined') {
  import('react').then((React) => {
    import('react-dom/client').then(({ createRoot }) => {
      import('./index').then(({ UIDebugger }) => {
        // Check for React and inject if missing (for Vanilla/HTML/PHP/Vue/Angular apps)
        if (!window.React || !window.ReactDOM) {
          const reactScript = document.createElement('script');
          reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
          reactScript.crossOrigin = 'anonymous';
          
          const reactDomScript = document.createElement('script');
          reactDomScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
          reactDomScript.crossOrigin = 'anonymous';
          
          reactScript.onload = () => {
            document.head.appendChild(reactDomScript);
          };
          
          reactDomScript.onload = () => {
            mountDebugger();
          };
          
          document.head.appendChild(reactScript);
        } else {
          mountDebugger();
        }

        function mountDebugger() {
          const container = document.createElement('div');
          container.id = '__ui_debugger_pro_root__';
          container.style.cssText = 'position:fixed;z-index:99999;top:0;left:0;width:0;height:0;';
          document.body.appendChild(container);
          
          // Use the global React/ReactDOM now available
          const root = (window.ReactDOM as any).createRoot(container);
          root.render(window.React.createElement(UIDebugger));
        }
      });
    });
  });
}
