# UI Debugger Pro (Universal)

The ultimate visual debugging tool for web developers. Detect overlaps, cutoffs, alignment issues, and "ghost" elements in your React & Next.js applications.

## Features

- **🕵️ Visual Wizard**: Diagnose common UI symptoms (Ghost elements, Flashing, Blurring).
- **🔍 Deep Scan**: Automated detection of overlaps, cutoffs, and alignment issues.
- **📱 Responsive Simulator**: Test your UI on Mobile, Tablet, and Desktop sizes instantly.
- **🐒 Monkey Test**: Automated random interaction testing to find fragile elements.
- **⚡ Universal Plug-and-Play**: Works with any React framework (Next.js, Vite, CRA).

## Installation

```bash
npm install ui-debugger-pro
# or
yarn add ui-debugger-pro
# or
pnpm add ui-debugger-pro
```

## Usage

### 1. Basic Usage (React / Next.js)

Import the `UIDebugger` component and place it at the root of your application (e.g., `App.tsx` or `layout.tsx`).

```tsx
import { UIDebugger } from 'ui-debugger-pro';

export default function App() {
  return (
    <>
      <YourAppContent />
      
      {/* Only show in development */}
      {process.env.NODE_ENV === 'development' && <UIDebugger />}
    </>
  );
}
```

### 2. Next.js (App Router)

In `app/layout.tsx`:

```tsx
import { UIDebugger } from 'ui-debugger-pro';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <UIDebugger />}
      </body>
    </html>
  );
}
```

### 3. CDN / Vanilla JS (Universal)

You can use UI Debugger Pro on **any** website (PHP, Ruby, static HTML) by adding a single script tag.

```html
<!-- Load React (Required) -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load UI Debugger Pro -->
<script src="https://unpkg.com/ui-debugger-pro/dist/index.global.js"></script>

<script>
  // Mount the debugger
  window.mountUIDebugger();
</script>
```

Or simply add `?ui_debug=true` to your URL to auto-mount it if the script is loaded.

## Configuration

The debugger persists its state in `localStorage`, so your settings (theme, position, toggles) are saved across reloads.

## Python Backend (Optional)

If you want to save logs to a file, you can run the optional Python backend server.

```bash
pip install ui-debugger-pro
ui-debugger-pro
```

Then, the JS component will automatically try to send logs to `http://localhost:5000/ui-debugger-pro/logs`.

## License

MIT
