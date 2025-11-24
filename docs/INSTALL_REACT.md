# Installation Guide: React, Next.js, Vite, Vue & More

## ⚡ Universal Zero-Config (Recommended)

**One command works for ANY JavaScript project:**

```bash
# Install once
npm install ui-debugger-pro

# Run anywhere - auto-detects everything!
npx ui-debugger-pro start
```

**What it does:**
- 🔍 **Auto-detects** your project type (React, Next.js, Vite, Vue, Angular, etc.)
- 📁 **Finds entry files** anywhere in your project (src/, app/, App/, pages/, etc.)
- 🚀 **Detects dev command** from package.json (dev, start, serve, etc.)
- 💉 **Injects debugger** temporarily
- 🧹 **Auto-removes** everything when you press Ctrl+C

**Supports:**
- ✅ React (Create React App, Vite, Webpack)
- ✅ Next.js (App Router & Pages Router)
- ✅ Vue 2 & 3
- ✅ Angular
- ✅ Svelte
- ✅ Any framework with a dev server!

**No configuration, no code changes, just works!**

---

## 🔌 Plugin-Based Setup (Persistent)

For a persistent zero-config setup, use our plugins:

### Vite Plugin

In `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { uiDebuggerPlugin } from 'ui-debugger-pro/plugin';

export default defineConfig({
  plugins: [
    // Your other plugins...
    uiDebuggerPlugin(), // Only active in dev mode
  ],
});
```

### Next.js Plugin

In `next.config.js`:

```js
const { withUIDebugger } = require('ui-debugger-pro/next');

module.exports = withUIDebugger({
  // Your existing Next.js config...
});
```

### Webpack (CRA and others)

In `webpack.config.js`:

```js
const { UIDebuggerWebpackPlugin } = require('ui-debugger-pro/webpack');

module.exports = {
  // Your config...
  plugins: [
    new UIDebuggerWebpackPlugin(),
  ],
};
```

---

## 📦 Traditional Installation (Manual Code Edits)

If you prefer to add it directly to your code:

1. **Install the package:**
   ```bash
   npm install ui-debugger-pro
   # or
   yarn add ui-debugger-pro
   ```

2. **Add to your code:**

### Next.js (App Router)

In `app/layout.tsx`:

```tsx
import { UIDebugger } from 'ui-debugger-pro';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Only load in development mode */}
        {process.env.NODE_ENV === 'development' && <UIDebugger />}
      </body>
    </html>
  );
}
```

## ⚡ Vite / Create React App

In `src/App.tsx` or `src/main.tsx`:

```tsx
import { UIDebugger } from 'ui-debugger-pro';

function App() {
  return (
    <div>
      <YourApp />
      {import.meta.env.DEV && <UIDebugger />}
    </div>
  );
}

export default App;
```

---

## 🗑️ Removing the Debugger

### If using `npx ui-debugger-pro start`:
Just press **Ctrl+C** to stop the server - it auto-cleans up!

### If using plugins:
Simply remove the plugin from your config file.

### If installed manually:
```bash
npx ui-debugger-pro remove
```

Or manually delete the import and component from your code.

---

## 🛠️ Configuration

You can pass props to the component to override defaults (coming soon), but currently, all configuration is handled via the UI and saved to `localStorage`.
