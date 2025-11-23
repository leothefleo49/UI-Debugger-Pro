# UI Debugger Pro (Universal)

**The Ultimate Visual Debugging Suite for Web Applications**

UI Debugger Pro helps you find and fix visual bugs, layout issues, and responsiveness problems instantly. It works on **any website** and with **any framework** (React, Next.js, Python, PHP, etc.).

---

## 🚀 How to Use (Choose One Method)

You only need to pick **ONE** of the following methods to get started.

### Method A: The "One-Command" Setup (Best for React / Next.js)
If you are building a React, Next.js, or Vite app, this is the easiest way. It installs the package and sets it up for you automatically.

1.  **Open your terminal** in your project folder.
2.  **Run this command:**
    ```bash
    npx ui-debugger-pro init
    ```
3.  **Start your app** (e.g., `npm run dev`). The debugger will appear on your screen.

> **To Uninstall:** Run `npx ui-debugger-pro remove` to completely remove it from your project.

---

### Method B: Browser Extension (No Code Required)
Best if you want to debug *any* website (production or localhost) without changing your code. Works on **Chrome, Edge, Opera, and Brave**.

1.  **Download/Clone** this repository.
2.  Open your browser and go to `chrome://extensions` (or `edge://extensions`).
3.  Enable **Developer Mode** (toggle in top right).
4.  Click **Load Unpacked** and select the `ui_debugger_pro_ext` folder from this repo.
5.  Click the extension icon to activate it on any tab.

---

### Method C: The Bookmarklet (Fastest)
Best for quick checks on live websites. No installation required.

1.  Open the [**Bookmarklet Installer**](./docs/bookmarklet_install.html) file in your browser.
2.  **Drag the button** to your bookmarks bar.
3.  Click the bookmark whenever you want to debug a page.

---

### Method D: Python / Flask / Django
If you are using Python templates (Jinja2, Django Templates).

1.  **Install the package:**
    ```bash
    pip install ui-debugger-pro
    ```
2.  **Add to your template:**
    ```html
    <!-- Inside your base layout or specific page -->
    {{ ui_debugger() }}
    ```
    *(See [Python Guide](./docs/INSTALL_PYTHON.md) for full setup)*

---

## ✨ Key Features (v6.0)

### 🤖 Auto-Fix & History (New!)
- **Auto-Fix**: Click a button to automatically apply CSS fixes for overlaps, cutoffs, and contrast issues.
- **Copy Code**: One-click copy the generated CSS to paste into your codebase.
- **Session History**: Track every change you make and revert them easily.

### 🕵️ Deep Scan Audit
- **Overlap Detection**: Finds elements that are accidentally covering each other.
- **Cutoff Detection**: Identifies content that overflows its container.
- **Broken Link/Image Check**: Finds 404 images and empty links.

### 🛠️ Visual Tools
- **Design Mode**: Edit text directly on the page to test copy length.
- **Layout Grid**: Visualize the structure of your page.
- **Animation Control**: Slow down animations to debug transitions.

### 📱 Responsive Simulator
- **Device Presets**: Mobile, Tablet, Desktop.
- **Extreme Ratio Test**: Stress-tests your layout with unusual aspect ratios.

---

## ❓ FAQ

**Q: Does this work with Opera?**
A: Yes! Opera is based on Chromium. Follow the **Browser Extension** instructions above.

**Q: Can I disable it in production?**
A: Yes. If you use **Method A**, the code is only injected for development. You can also run `npx ui-debugger-pro remove` before deploying if you want to be 100% sure.

**Q: Does Auto-Fix change my source code?**
A: For safety, Auto-Fix applies changes to the **live browser view** only. It gives you the CSS code to copy/paste into your file. This prevents the tool from accidentally breaking your source files.

---

## Contributing

This is a monorepo containing both the Python and JavaScript packages.
- `ui_debugger_pro_pkg/`: Python package source.
- `ui_debugger_pro_js/`: NPM package source.
- `ui_debugger_pro_ext/`: Browser Extension source.



