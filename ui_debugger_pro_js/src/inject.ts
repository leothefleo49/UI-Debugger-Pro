// This file is used for Next.js auto-injection
// It will be loaded via webpack entry modification
if (typeof window !== 'undefined') {
  import('react').then((React) => {
    import('react-dom/client').then(({ createRoot }) => {
      import('./index').then(({ UIDebugger }) => {
        const container = document.createElement('div');
        container.id = '__ui_debugger_pro_root__';
        container.style.cssText = 'position:fixed;z-index:99999;top:0;left:0;width:0;height:0;';
        document.body.appendChild(container);
        
        const root = createRoot(container);
        root.render(React.createElement(UIDebugger));
      });
    });
  });
}
