# Installation Guide: React, Next.js, & Vite

## 📦 NPM Installation

The easiest way to use UI Debugger Pro in a modern JavaScript environment is via NPM.

```bash
npm install ui-debugger-pro
# or
yarn add ui-debugger-pro
# or
pnpm add ui-debugger-pro
```

---

## 🚀 Next.js (App Router)

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
