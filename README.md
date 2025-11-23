# UI Debugger Pro (Universal)

**The Ultimate Visual Debugging Suite for Web Applications**

UI Debugger Pro is a universal tool designed to help developers find and fix visual bugs, layout issues, and responsiveness problems. It is available for both Python (Flask/Django) and JavaScript (React/Next.js) environments.

## Choose Your Version

### 📦 For React / Next.js / Vite
Use the NPM package for a native React component experience.

[**Go to NPM Package Docs**](./ui_debugger_pro_js/README.md)

```bash
npm install ui-debugger-pro
```

### 🌐 For Any Website (CDN)
Use the standalone script for PHP, Ruby, or static HTML sites.

```html
<script src="https://unpkg.com/ui-debugger-pro/dist/index.global.js"></script>
<script>window.mountUIDebugger()</script>
```

### 🐍 For Flask / Django / Python
Use the Python package to inject the debugger into your server-rendered templates.

[**Go to Python Package Docs**](./ui_debugger_pro_pkg/README.md)

```bash
pip install ui-debugger-pro
```

## Features

- **🕵️ Deep Scan**: Automatically detect overlaps, cutoffs, and alignment issues.
- **📱 Responsive Simulator**: Test mobile/tablet views instantly.
- **🐒 Monkey Test**: Chaos testing for your UI.
- **⚡ Universal**: Works in any web environment.

## Contributing

This is a monorepo containing both the Python and JavaScript packages.

- `ui_debugger_pro_pkg/`: Python package source.
- `ui_debugger_pro_js/`: NPM package source.

