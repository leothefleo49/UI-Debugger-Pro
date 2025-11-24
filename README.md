# UI Debugger Pro (Universal)

**The Ultimate Visual Debugging Suite for Web Applications**

UI Debugger Pro is a universal tool designed to help developers find and fix visual bugs, layout issues, and responsiveness problems. It works with **React, Next.js, Vue, Svelte, Python (Flask/Django), PHP, Ruby, and static HTML**.

## 🚀 Quick Start

### Choose Your Environment

| Environment | Zero-Config Setup | Installation Guide |
| :--- | :--- | :--- |
| **React / Next.js / Vite** | `npm i ui-debugger-pro && npx ui-debugger-pro start` | [**Read Guide**](./docs/INSTALL_REACT.md) |
| **Python (Flask / Django)** | `pip install ui-debugger-pro && ui-debugger run -- python manage.py runserver` | [**Read Guide**](./docs/INSTALL_PYTHON.md) |
| **HTML / PHP / Ruby** | Add `<script>` tag | [**Read Guide**](./docs/INSTALL_VANILLA.md) |
| **Browser Extension** | Chrome / Edge / Opera | [**Read Guide**](./docs/INSTALL_EXTENSION.md) |
| **Any Website (No Code)** | Bookmarklet (Drag & Drop) | [**Get Bookmarklet**](./docs/bookmarklet_install.html) |

> **😕 Not sure which one to pick?**
> [**Click here for a simple guide**](./docs/WHICH_METHOD.md) to find the perfect installation method for your specific project.

---

## ✨ Features (v7.5)

### 🔌 Zero-Config Installation
- **Automatic Setup**: Run `npx ui-debugger-pro start` or `ui-debugger run` to instantly add the debugger to any project.
- **Auto-Cleanup**: Press Ctrl+C and all injected code is automatically removed.
- **Plugin Support**: Persistent zero-config via Vite, Next.js, and Webpack plugins.
- **Universal**: Works with React, Vue, Django, Flask, FastAPI, PHP, Ruby, and static HTML.

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

### JavaScript/NPM Commands

| Command | Description |
| :--- | :--- |
| `npx ui-debugger-pro start` | **Zero-Config:** Run your app with debugger injected. Auto-removes on exit (Ctrl+C). |
| `npx ui-debugger-pro init` | Install and permanently configure the debugger in your project. |
| `npx ui-debugger-pro remove` | Uninstall the package and remove all injected code. |
| `npx ui-debugger-pro help` | Open the documentation in your browser. |
| `npx ui-debugger-pro commands` | List all available commands. |

### Python/PIP Commands

| Command | Description |
| :--- | :--- |
| `ui-debugger run -- <your command>` | **Zero-Config:** Run your Python app with debugger injected. Auto-removes on exit. |
| `ui-debugger enable` | Enable the debugger in your config. |
| `ui-debugger disable` | Disable the debugger without uninstalling. |
| `ui-debugger clean` | Clean up old debug logs. |

> *Tip: You can also access help directly inside the UI by clicking the **❓ HELP** button.*

---

## Contributing

This is a monorepo containing both the Python and JavaScript packages.

- `ui_debugger_pro_pkg/`: Python package source.
- `ui_debugger_pro_js/`: NPM package source.
- `ui_debugger_pro_ext/`: Browser Extension source.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/leothefleo49/Solar-Panel-Calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leothefleo49/Solar-Panel-Calculator/discussions)
- **Email**: [leothefleo49@gmail.com](mailto:leothefleo49@gmail.com)
- **Documentation**: [RELEASE_INSTRUCTIONS.md](./RELEASE_INSTRUCTIONS.md)

---

## 💖 Sponsor

If you find this project useful, consider supporting continued development on GitHub Sponsors:

- **Sponsor:** https://github.com/sponsors/leothefleo49

Donations are not required but are very much appreciated — they help cover maintenance, hosting, and adding new features.

Made with ❤️ by [leothefleo49](https://github.com/leothefleo49)

---

## 📥 Direct README Download

If you want one guaranteed download of the README to share, use the release-asset link below. The repository contains a GitHub Action that publishes `README.md` as a release asset named `UI-Debugger-Pro-README.md` whenever you push to `main` or `master`.

- Direct download (one click):
	- https://github.com/leothefleo49/UI-Debugger-Pro/releases/download/readme-latest/UI-Debugger-Pro-README.md

If you'd rather use a small page that forces a download (works in more browsers), open:

- Download helper page: `docs/download_readme.html`

Fallback (opens in browser; right-click → Save as):

- Raw README: `https://raw.githubusercontent.com/leothefleo49/UI-Debugger-Pro/main/README.md`


