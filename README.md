# UI Debugger Pro (Universal)

**The Ultimate Visual Debugging Suite for Web Applications**

UI Debugger Pro is a universal tool designed to help developers find and fix visual bugs, layout issues, and responsiveness problems. It works with **React, Next.js, Vue, Svelte, Python (Flask/Django), PHP, Ruby, and static HTML**.

## 🚀 Quick Start - One Universal Command!

**Works with ANY project type - React, Next.js, Vue, Python, PHP, Ruby, and more!**

```bash
# For JavaScript/Node.js projects
npx ui-debugger-pro start

# For Python/other projects  
ui-debugger start
```

That's it! The CLI auto-detects your project type, finds entry points, and runs your dev server with the debugger attached. Press **Ctrl+C** to stop and automatically clean up.

### Installation

**JavaScript/Node.js Projects:**
```bash
npm install ui-debugger-pro
# or
yarn add ui-debugger-pro
# or
pnpm add ui-debugger-pro
```

**Python Projects:**
```bash
pip install ui-debugger-pro
```

**Other Methods:**

| Method | Best For | Link |
| :--- | :--- | :--- |
| **Browser Extension** | Any website (no code changes) | [**Install Extension**](./docs/INSTALL_EXTENSION.md) |
| **Bookmarklet** | Quick testing on any site | [**Get Bookmarklet**](./docs/bookmarklet_install.html) |
| **Manual Setup** | Full control | [**Installation Guides**](./docs/WHICH_METHOD.md) |

> **😕 Not sure which method to use?**
> [**Click here for a simple guide**](./docs/WHICH_METHOD.md) to find the perfect installation method for your specific project.

---

## ✨ Features (v7.6)

### 🎯 Universal Zero-Config
- **One Command, Any Project**: `npx ui-debugger-pro start` or `ui-debugger start` works everywhere
- **Smart Auto-Detection**: Automatically detects React, Next.js, Vue, Django, Flask, FastAPI, PHP, Ruby, and static HTML
- **Recursive File Search**: Finds entry points anywhere in your project structure (src/, app/, App/, pages/, public/, etc.)
- **Smart Script Detection**: Auto-detects dev commands from package.json (dev, start, serve, etc.)
- **Auto-Cleanup**: Press Ctrl+C and all injected code is automatically removed
- **Zero Configuration**: No config files, no setup, just works

### 🔌 Plugin Support (Optional)
For persistent installation without runtime injection:
- **Vite Plugin**: `import { uiDebuggerPlugin } from 'ui-debugger-pro/plugin'`
- **Next.js Plugin**: `const withUIDebugger = require('ui-debugger-pro/next')`
- **Webpack Plugin**: `const UIDebuggerPlugin = require('ui-debugger-pro/webpack')`

### 🤖 Auto-Fix & History
- **Auto-Fix**: Click a button to automatically apply CSS fixes for overlaps, cutoffs, and contrast issues.
- **Copy Code**: One-click copy the generated CSS to paste into your codebase.
- **Session History**: Track every change you make and revert them easily.

### 🕵️ Deep Scan Audit
Automatically detect common UI issues across your entire page:
- **Overlap Detection**: Finds elements that are accidentally covering each other.
- **Cutoff Detection**: Identifies content that overflows its container.
- **Alignment Check**: Detects elements that are *almost* aligned (1-3px off).
- **Accessibility Check**: Flags low contrast text.
- **Broken Link/Image Check**: Finds 404 images and empty links.

### 🛠️ Visual Tools
- **Layout Grid**: Visualize the structure of your page with a single click.
- **Animation Control**: Slow down animations to debug transitions.
- **Design Mode**: Edit text directly on the page to test copy length.
- **Global Killers**: Toggle off CSS properties (Outline, Shadow, Border, Background) globally.

### 📱 Responsive Simulator
Test your app on any device size without resizing your browser:
- **Presets**: Mobile, Tablet, Desktop.
- **Extreme Ratio Test**: Stress-tests your layout with aspect ratios **up to 20:1 and 1:20**.

### 🐒 Monkey Test
Automated chaos testing for your UI. Clicks random buttons to find broken paths.

### 🎨 Customization
- **Themes**: Switch between Dark, Light, Hacker, Cyber, and Dracula themes to match your vibe.
- **Adjustable**: Configure almost every aspect of the tool to fit your specific workflow.

> **AND MUCH MORE...**
> [**📖 Read the Detailed Feature Documentation**](./docs/DETAILED_FEATURES.md) for an in-depth explanation of every single feature.

---

## 💻 CLI Commands

### Universal Commands (Work Everywhere!)

| Command | Description |
| :--- | :--- |
| `npx ui-debugger-pro start` | **JavaScript projects:** Auto-detect and run with debugger |
| `ui-debugger start` | **Python/PHP/Ruby projects:** Auto-detect and run with debugger |

**Both commands:**
- ✅ Auto-detect project type (React, Next.js, Vue, Django, Flask, FastAPI, PHP, Ruby, HTML)
- ✅ Find entry files recursively in any directory structure
- ✅ Detect and run your dev command automatically
- ✅ Auto-cleanup on exit (Ctrl+C)

### Additional JavaScript Commands

| Command | Description |
| :--- | :--- |
| `npx ui-debugger-pro init` | Permanently add debugger to your project |
| `npx ui-debugger-pro remove` | Uninstall and remove all traces |
| `npx ui-debugger-pro help` | Open documentation |
| `npx ui-debugger-pro commands` | List all commands |

### Additional Python Commands

| Command | Description |
| :--- | :--- |
| `ui-debugger enable` | Enable debugger in config |
| `ui-debugger disable` | Disable without uninstalling |
| `ui-debugger clean` | Clean up debug logs |

> **Legacy:** `ui-debugger run -- <command>` still works but `start` is recommended.

---

## Contributing

This is a monorepo containing both the Python and JavaScript packages.

- `ui_debugger_pro_pkg/`: Python package source.
- `ui_debugger_pro_js/`: NPM package source.
- `ui_debugger_pro_ext/`: Browser Extension source.

---

## 📥 Quick Install Guide

Download the README for easy sharing:
- **Direct download:** [UI-Debugger-Pro-README.md](https://github.com/leothefleo49/UI-Debugger-Pro/releases/download/readme-latest/UI-Debugger-Pro-README.md)
- **Download page:** [docs/download_readme.html](./docs/download_readme.html)
- **Raw file:** [README.md](https://raw.githubusercontent.com/leothefleo49/UI-Debugger-Pro/main/README.md)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/leothefleo49/Solar-Panel-Calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leothefleo49/Solar-Panel-Calculator/discussions)
- **Email**: [leothefleo49@gmail.com](mailto:leothefleo49@gmail.com)
- **Documentation**: [RELEASE_INSTRUCTIONS.md](./RELEASE_INSTRUCTIONS.md)

---

## 💖 Sponsors

If you find this project useful, consider supporting continued development:

- **GitHub Sponsors:** https://github.com/sponsors/leothefleo49

Donations help cover maintenance, hosting, and new features. Not required but very much appreciated!

Made with ❤️ by [leothefleo49](https://github.com/leothefleo49)


