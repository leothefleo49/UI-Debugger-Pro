# Installation Guide: React, Next.js, & Vite

## ⚡ Quick Setup (Recommended)

The fastest way to install and configure UI Debugger Pro is using the CLI tool. Run this in your project root:

```bash
npx ui-debugger-pro init
```

This will automatically:
1. Install the package.
2. Inject the `<UIDebugger />` component into your `layout.tsx`, `App.tsx`, or `main.tsx`.

---

## 📦 Manual Installation

If you prefer to set it up manually:

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

## 🛠️ Configuration

You can pass props to the component to override defaults (coming soon), but currently, all configuration is handled via the UI and saved to `localStorage`.
