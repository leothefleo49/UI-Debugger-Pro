// Content script to inject the debugger
// We load the script from the CDN to ensure it's always up to date, 
// or we could bundle it. For now, let's use the CDN for simplicity in this "Universal" approach.

const script = document.createElement('script');
script.src = 'https://unpkg.com/ui-debugger-pro/dist/index.global.js';
script.onload = () => {
  // Auto-mount if requested via popup (we can use storage to check state)
  // For now, we just expose it.
  console.log('UI Debugger Pro injected. Click the extension icon to activate.');
};
document.head.appendChild(script);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    const s = document.createElement('script');
    s.textContent = `
      if (window.mountUIDebugger) {
        window.mountUIDebugger();
      } else {
        alert('UI Debugger Pro is still loading... please wait a moment.');
      }
    `;
    document.body.appendChild(s);
  }
});
