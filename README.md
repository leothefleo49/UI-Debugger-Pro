# UI Debugger Pro (Universal)

**The Ultimate Visual Debugging Suite for Web Applications**

UI Debugger Pro is a universal tool designed to help developers find and fix visual bugs, layout issues, and responsiveness problems. It works with **React, Next.js, Vue, Svelte, Python (Flask/Django), PHP, Ruby, and static HTML**.

## 🚀 Quick Start

### Choose Your Environment

| Environment | Installation Method | Guide |
| :--- | :--- | :--- |
| **React / Next.js / Vite** | `npm install ui-debugger-pro` | [**Read Guide**](./docs/INSTALL_REACT.md) |
| **Python (Flask / Django)** | `pip install ui-debugger-pro` | [**Read Guide**](./docs/INSTALL_PYTHON.md) |
| **HTML / PHP / Ruby** | Add `<script>` tag | [**Read Guide**](./docs/INSTALL_VANILLA.md) |
| **Any Website (No Code)** | Bookmarklet | [**Get Bookmarklet**](./docs/INSTALL_VANILLA.md#bookmarklet-no-install-required) |

---

## ✨ Features

### 🕵️ Deep Scan Audit
Automatically detect common UI issues across your entire page:
- **Overlap Detection**: Finds elements that are accidentally covering each other.
- **Cutoff Detection**: Identifies content that overflows its container.
- **Alignment Check**: Detects elements that are *almost* aligned (1-3px off).
- **Accessibility Check**: Flags low contrast text (New!).

### 🛠️ Visual Tools
- **Layout Grid**: Visualize the structure of your page with a single click.
- **Animation Control**: Slow down animations to debug transitions.
- **Global Killers**: Toggle off CSS properties (Outline, Shadow, Border, Background) globally.

### 📱 Responsive Simulator
Test your app on any device size without resizing your browser:
- **Presets**: Mobile, Tablet, Desktop.
- **Extreme Ratio Test**: Stress-tests your layout with 20:1 to 1:20 aspect ratios.

### 🐒 Monkey Test
Automated chaos testing for your UI. Clicks random buttons to find broken paths.

---

## Contributing

This is a monorepo containing both the Python and JavaScript packages.

- `ui_debugger_pro_pkg/`: Python package source.
- `ui_debugger_pro_js/`: NPM package source.


