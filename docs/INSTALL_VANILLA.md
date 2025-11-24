# Installation Guide: Vanilla JS, HTML, PHP, Ruby, & Bookmarklet

UI Debugger Pro can be used on **any** website, even if you don't use React or Python.

---

## ⚡ Zero-Config Setup (Recommended)

For quick testing with auto-cleanup:

### Python-based Proxy Method

```bash
# Install the Python package
pip install ui-debugger-pro

# Run your site through the proxy (auto-injects the debugger)
ui-debugger run                                  # Auto-detects index.html
ui-debugger run -- php -S localhost:8000         # For PHP
ui-debugger run -- ruby -run -e httpd . -p 8000  # For Ruby
ui-debugger run -- python -m http.server 8000    # For static HTML
```

This starts a proxy server that:
- Forwards requests to your backend
- Injects the UI Debugger into all HTML responses
- Auto-removes everything when you press Ctrl+C

**Access your site at:** `http://localhost:8001` (proxy port)

### NPM-based HTML Injection

```bash
# Install the package
npm install ui-debugger-pro

# Inject into index.html and run your server
npx ui-debugger-pro init    # One-time injection
npx ui-debugger-pro start   # Or use temporary injection with auto-cleanup
```

---

## 🌐 CDN (Script Tag) - Permanent Installation

Simply add this code to the bottom of your `<body>` tag. It works in WordPress, PHP, Ruby on Rails, static HTML, etc.

```html
<!-- 1. Load React Dependencies (Required) -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- 2. Load UI Debugger Pro -->
<script src="https://unpkg.com/ui-debugger-pro/dist/index.global.js"></script>

<!-- 3. Initialize -->
<script>
  // Check if we are in a dev environment or if a specific flag is set
  if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
    window.mountUIDebugger();
  }
</script>
```

---

## 🔖 Bookmarklet (No Install Required!)

Want to debug a site without changing the code? Create a bookmark in your browser with the following URL (JavaScript code):

**Copy this code and paste it into a new Bookmark's URL field:**

```javascript
javascript:(function(){function l(u,c){var s=document.createElement('script');s.src=u;s.onload=c;document.body.appendChild(s)}if(!window.React){l('https://unpkg.com/react@18/umd/react.production.min.js',function(){l('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',function(){l('https://unpkg.com/ui-debugger-pro/dist/index.global.js',function(){window.mountUIDebugger()})})})}else{l('https://unpkg.com/ui-debugger-pro/dist/index.global.js',function(){window.mountUIDebugger()})}})();
```

**How to use:**
1. Create a new bookmark named "Debug UI".
2. Paste the code above as the URL.
3. Go to ANY website.
4. Click the bookmark.
5. The Debugger will appear!
