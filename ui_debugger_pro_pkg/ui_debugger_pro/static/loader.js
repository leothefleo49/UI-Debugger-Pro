(function() {
  const CONFIG = {
    react: 'https://unpkg.com/react@18/umd/react.development.js',
    reactDOM: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    babel: 'https://unpkg.com/@babel/standalone/babel.min.js'
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    // Load dependencies if not present
    if (!window.React) await loadScript(CONFIG.react);
    if (!window.ReactDOM) await loadScript(CONFIG.reactDOM);
    if (!window.Babel) await loadScript(CONFIG.babel);

    // Create container
    const rootId = 'ui-debugger-pro-root';
    let rootEl = document.getElementById(rootId);
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.id = rootId;
      document.body.appendChild(rootEl);
    }

    // Fetch and compile the debugger
    try {
      const res = await fetch('/ui-debugger-pro/debugger.tsx');
      const code = await res.text();
      
      const compiled = Babel.transform(code, {
        presets: ['react', 'typescript'],
        filename: 'debugger.tsx'
      }).code;

      // Execute
      // We need to wrap it to export the component or mount it directly
      // The debugger.tsx should export default, but here we'll eval it.
      // To make it easier, we'll append the mount logic to the code.
      
      const mountCode = `
        const Root = window.ReactDOM.createRoot(document.getElementById('${rootId}'));
        Root.render(window.React.createElement(DebugHighlighter));
      `;

      // We need to make sure imports in debugger.tsx are handled or removed.
      // The refactored debugger.tsx should use window.React or just React (since it's global now)
      // and remove imports.
      
      const finalCode = compiled + mountCode;
      
      // Run it
      new Function(finalCode)();
      
    } catch (e) {
      console.error('UI Debugger Pro failed to load:', e);
    }
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
