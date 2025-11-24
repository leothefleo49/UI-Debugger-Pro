(function() {
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function loadDebugger() {
    // Load the latest version from NPM via unpkg
    loadScript('https://unpkg.com/ui-debugger-pro/dist/index.global.js', function() {
      if (window.mountUIDebugger) {
        window.mountUIDebugger();
      } else {
        console.error('UI Debugger Pro loaded but mountUIDebugger is missing.');
      }
    });
  }

  // Check for React dependencies
  if (!window.React || !window.ReactDOM) {
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
        loadDebugger();
      });
    });
  } else {
    loadDebugger();
  }
})();
