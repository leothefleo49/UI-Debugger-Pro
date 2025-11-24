import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'playground', 
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      // Allow importing the source directly
      'ui-debugger-pro': path.resolve(__dirname, './src/index.tsx')
    }
  }
});