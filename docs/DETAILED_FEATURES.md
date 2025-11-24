# Detailed Feature Documentation

This document provides an in-depth explanation of every feature available in **UI Debugger Pro v7.6**.

---

## 🎯 Universal Zero-Config (NEW in v7.6)

UI Debugger Pro features a truly universal CLI that works with **any** project type using a single command.

### 1. One Command for Everything
*   **Command**: `npx ui-debugger-pro start` (Node.js projects) or `ui-debugger start` (Python/other projects)
*   **Works with**: React, Next.js, Vue, Angular, Svelte, Django, Flask, FastAPI, PHP, Ruby, static HTML, and more
*   **No configuration needed**: The CLI intelligently detects your project type, entry points, and dev commands
*   **Benefit**: Start debugging in **any** project within seconds

### 2. Intelligent Auto-Detection
*   **Project Type Detection**: Automatically identifies your framework by scanning files
    *   React/Vite: Looks for `main.tsx`, `index.tsx` in src/
    *   Next.js: Detects `layout.tsx` (App Router) or `_app.tsx` (Pages Router)
    *   Django: Finds `manage.py` and `settings.py`
    *   Flask: Locates `app.py` with Flask imports
    *   FastAPI: Detects `main.py` with FastAPI
    *   Vue: Finds `App.vue` and `main.ts`
    *   PHP/HTML: Looks for `index.php` or `index.html`

*   **Recursive File Search**: Scans your entire project structure (up to 4 levels deep)
    *   Finds entry files in `src/`, `app/`, `App/`, `pages/`, `public/`, or any subdirectory
    *   Skips `node_modules`, `.git`, `dist`, `build` for performance

*   **Smart Script Detection**: Parses `package.json` to find your dev command
    *   Priority order: `dev`, `start`, `serve`, `vite`, `next dev`, `ng serve`, `vue-cli-service serve`
    *   Falls back to any script with "dev" or "start" in the name

### 3. Auto-Cleanup on Exit
*   **What it does**: Press Ctrl+C to stop your server and all injected code is automatically removed
*   **Tracks changes**: Stores original file content and restores it exactly
*   **Why use it**: Zero risk of accidentally committing debug code to production

### 4. Plugin-Based Persistence (Optional)
For projects where you want the debugger permanently available:
*   **Vite Plugin**: `import { uiDebuggerPlugin } from 'ui-debugger-pro/plugin'`
*   **Next.js Plugin**: `const withUIDebugger = require('ui-debugger-pro/next')`
*   **Webpack Plugin**: `const UIDebuggerPlugin = require('ui-debugger-pro/webpack')`
*   **Benefit**: Persistent zero-config that survives restarts

### 5. Universal Proxy Server
*   **For**: PHP, Ruby, and static HTML projects without Node.js
*   **What it does**: Starts a proxy server that injects the debugger into all HTML responses
*   **Usage**: `ui-debugger start` (auto-detects and starts proxy on port 8001)
*   **Access**: Visit `localhost:8001` to see your site with the debugger

---

## 🕵️ Deep Scan Audit

The Deep Scan Audit is the core analysis engine of UI Debugger Pro. It scans the DOM (Document Object Model) to identify visual and structural issues that might not be immediately obvious.

### 1. Overlap Detection
*   **What it does**: Scans all visible elements to see if they are physically overlapping each other.
*   **How it works**: It calculates the bounding box (rect) of every element and compares it with every other element. It ignores parent-child relationships (which naturally overlap) and focuses on siblings or unrelated elements.
*   **Why use it**: Detects "z-index wars", accidental positioning errors, or elements that are hiding buttons/text.
*   **Auto-Fix**: Increases the `z-index` of the covered element and sets `position: relative`.

### 2. Cutoff Detection
*   **What it does**: Checks if an element's content is larger than the element itself (`scrollWidth > clientWidth` or `scrollHeight > clientHeight`) while `overflow` is hidden.
*   **Why use it**: Finds text that is being truncated or buttons that are half-hidden inside a container.
*   **Auto-Fix**: Sets `overflow: visible` to reveal the hidden content.

### 3. Alignment Check
*   **What it does**: Looks at groups of sibling elements and checks if they are *almost* aligned.
*   **Threshold**: If elements are misaligned by 1px to 3px, it flags them.
*   **Why use it**: "Pixel perfect" implementation often fails by 1px due to rounding errors or border widths. This highlights those subtle imperfections.

### 4. Accessibility (Contrast) Check
*   **What it does**: Calculates the contrast ratio between the text color and background color of an element.
*   **Why use it**: Ensures your text is readable for users with visual impairments.
*   **Auto-Fix**: Sets the text color to black and background to white (high contrast) temporarily.

### 5. Broken Link & Image Detection
*   **What it does**:
    *   **Images**: Checks `naturalWidth` of `<img>` tags. If 0, the image failed to load. Also checks for missing `alt` attributes.
    *   **Links**: Checks `<a>` tags for empty `href`, `#` placeholders, or missing `href` attributes.
*   **Auto-Fix**: Adds a red dashed border and a placeholder background to broken images so you can see where they should be.

---

## 🛠️ Visual Tools

### 1. Layout Grid
*   **What it does**: Draws a red outline around *every* element on the page.
*   **Usage**: Toggle the "Layout" switch in the UI.
*   **Benefit**: Instantly visualize the box model structure of your page. See padding, margins, and nesting levels clearly.

### 2. Design Mode (Content Editing)
*   **What it does**: Enables `document.designMode`.
*   **Usage**: Toggle the "Edit" switch.
*   **Benefit**: You can click on *any* text on the page and type to change it. This is incredibly useful for testing how your layout handles longer or shorter text (e.g., "What happens if the username is 50 characters long?").

### 3. Global Killers
These toggles allow you to globally disable specific CSS properties to isolate issues.
*   **Outline**: Removes all outlines.
*   **Shadow**: Removes `box-shadow` from all elements.
*   **Border**: Sets `border-color` to transparent.
*   **Background**: Sets backgrounds to transparent (useful for finding "ghost" elements blocking clicks).
*   **Filter/Backdrop**: Removes blur and other filters.
*   **Transform**: Disables CSS transforms (scale, rotate, translate).

### 4. Animation Speed Control
*   **What it does**: Globally slows down or speeds up CSS animations and transitions.
*   **Range**: 0.1x (Slow Motion) to 2x (Fast Forward).
*   **Usage**: Use the slider in the "Audit" tab.
*   **Benefit**: Debug fast transitions or loading spinners by watching them in slow motion.

---

## 📱 Responsive Simulator

The simulator allows you to view your website in an iframe constrained to specific device dimensions.

### 1. Device Presets
*   **Mobile**: 375px x 667px (iPhone SE style)
*   **Tablet**: 768px x 1024px (iPad style)
*   **Desktop**: Full width.

### 2. Extreme Ratio Test
*   **What it does**: Cycles through a series of "stress test" resolutions.
*   **Scenarios**:
    *   Ultra-wide (e.g., 2000px x 500px)
    *   Ultra-tall (e.g., 500px x 2000px)
    *   Tiny square (300px x 300px)
    *   4K resolution
*   **Why use it**: Ensures your layout doesn't break on non-standard screens (like foldables, ultra-wide monitors, or split-screen views).

---

## 🐒 Monkey Test

*   **What it does**: An automated "chaos" tester.
*   **Behavior**: It identifies all interactive elements (buttons, links, inputs) and randomly clicks them.
*   **Safety**: It asks for confirmation before running.
*   **Benefit**: Finds "dead paths" or errors that occur when a user clicks things in an unexpected order.

---

## 🤖 Auto-Fix & History

### Auto-Fix
When an issue is found in the **Deep Scan**, an "Auto-Fix" button appears. Clicking it applies a temporary CSS patch to the element in the DOM.

### Session History
*   **Tracking**: Every Auto-Fix is recorded in the "Applied Fixes" list.
*   **Revert**: You can undo any specific fix without reloading the page.
*   **Copy CSS**: Each fix generates the exact CSS code needed to solve the problem permanently. You can copy this and paste it into your stylesheet.

---

## 💻 CLI Commands (v7.5)

### JavaScript/NPM Commands
*   `npx ui-debugger-pro start` - **Zero-Config:** Temporarily injects the debugger, runs your dev server, and auto-removes on exit (Ctrl+C).
*   `npx ui-debugger-pro init` - Installs and permanently configures the debugger in your project files.
*   `npx ui-debugger-pro remove` - Uninstalls the package and removes all injected code from your project.
*   `npx ui-debugger-pro help` - Opens the documentation in your browser.
*   `npx ui-debugger-pro commands` - Lists all available CLI commands.

### Python/PIP Commands
*   `ui-debugger run -- <your command>` - **Zero-Config:** Runs your Python app with the debugger injected. Auto-removes on exit.
*   `ui-debugger enable` - Enables the debugger in your config (persistent across restarts).
*   `ui-debugger disable` - Disables the debugger without uninstalling the package.
*   `ui-debugger clean` - Cleans up old debug logs from your project.

### Plugin Usage (Persistent Zero-Config)
Instead of CLI commands, you can use framework-specific plugins:

**Vite** (`vite.config.ts`):
```ts
import { uiDebuggerPlugin } from 'ui-debugger-pro/plugin';
export default defineConfig({
  plugins: [uiDebuggerPlugin()],
});
```

**Next.js** (`next.config.js`):
```js
const { withUIDebugger } = require('ui-debugger-pro/next');
module.exports = withUIDebugger({ /* your config */ });
```

**Webpack** (`webpack.config.js`):
```js
const { UIDebuggerWebpackPlugin } = require('ui-debugger-pro/webpack');
module.exports = {
  plugins: [new UIDebuggerWebpackPlugin()],
};
```

---

## ⚙️ Configuration & Settings

*   **Theme**: Switch between Dark, Light, Hacker, Cyber, and Dracula themes.
*   **Event Tracking**: Choose which events to log (Hover, Click, Focus, Selection).
*   **Auto-Save**: Automatically saves logs to the server (if the Python backend is running) every 30 seconds.
*   **Danger Zone**: Reset all settings or uninstall the tool.

